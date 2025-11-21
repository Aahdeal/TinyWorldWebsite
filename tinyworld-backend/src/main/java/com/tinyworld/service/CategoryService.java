package com.tinyworld.service;

import com.tinyworld.dto.CategoryDTO;
import com.tinyworld.model.Category;
import com.tinyworld.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAllOrdered().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public CategoryDTO getCategoryById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
        return convertToDTO(category);
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

