package com.tinyworld.service;

import com.tinyworld.dto.CategoryCreateDTO;
import com.tinyworld.dto.CategoryDTO;
import com.tinyworld.dto.CategoryUpdateDTO;
import com.tinyworld.exception.BadRequestException;
import com.tinyworld.model.Category;
import com.tinyworld.repository.CategoryRepository;
import com.tinyworld.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminCategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public CategoryDTO getCategoryById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
        return convertToDTO(category);
    }
    
    @Transactional
    public CategoryDTO createCategory(CategoryCreateDTO categoryDTO) {
        // Check if category name already exists
        if (categoryRepository.findAll().stream()
                .anyMatch(c -> c.getName().equalsIgnoreCase(categoryDTO.getName()))) {
            throw new BadRequestException("Category with name '" + categoryDTO.getName() + "' already exists");
        }
        
        Category category = new Category();
        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());
        category.setDisplayOrder(categoryDTO.getDisplayOrder() != null ? categoryDTO.getDisplayOrder() : 0);
        
        category = categoryRepository.save(category);
        return convertToDTO(category);
    }
    
    @Transactional
    public CategoryDTO updateCategory(Long categoryId, CategoryUpdateDTO categoryDTO) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
        
        // Check if new name conflicts with existing category
        if (categoryDTO.getName() != null && !categoryDTO.getName().equals(category.getName())) {
            if (categoryRepository.findAll().stream()
                    .anyMatch(c -> c.getName().equalsIgnoreCase(categoryDTO.getName()) && 
                                  !c.getCategoryId().equals(categoryId))) {
                throw new BadRequestException("Category with name '" + categoryDTO.getName() + "' already exists");
            }
        }
        
        if (categoryDTO.getName() != null) {
            category.setName(categoryDTO.getName());
        }
        if (categoryDTO.getDescription() != null) {
            category.setDescription(categoryDTO.getDescription());
        }
        if (categoryDTO.getDisplayOrder() != null) {
            category.setDisplayOrder(categoryDTO.getDisplayOrder());
        }
        
        category = categoryRepository.save(category);
        return convertToDTO(category);
    }
    
    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
        
        // Check if category has products
        long productCount = productRepository.findByCategoryCategoryId(categoryId).size();
        if (productCount > 0) {
            throw new BadRequestException("Cannot delete category with " + productCount + " product(s). Please remove or reassign products first.");
        }
        
        categoryRepository.delete(category);
    }
    
    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setCategoryId(category.getCategoryId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setDisplayOrder(category.getDisplayOrder());
        return dto;
    }
}

