package com.tinyworld.service;

import com.tinyworld.dto.ProductCreateDTO;
import com.tinyworld.dto.ProductDTO;
import com.tinyworld.dto.ProductUpdateDTO;
import com.tinyworld.model.Category;
import com.tinyworld.model.Product;
import com.tinyworld.repository.CategoryRepository;
import com.tinyworld.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ProductDTO getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        return convertToDTO(product);
    }
    
    @Transactional
    public ProductDTO createProduct(ProductCreateDTO productDTO, MultipartFile imageFile) {
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + productDTO.getCategoryId()));
        
        Product product = new Product();
        product.setCategory(category);
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setBasePrice(productDTO.getBasePrice());
        product.setDisplayOrder(productDTO.getDisplayOrder() != null ? productDTO.getDisplayOrder() : 0);
        product.setIsActive(productDTO.getIsActive() != null ? productDTO.getIsActive() : true);
        
        // Handle image upload
        if (imageFile != null && !imageFile.isEmpty()) {
            String filename = fileStorageService.storeFile(imageFile);
            product.setImageUrl("/api/files/" + filename);
        }
        
        product = productRepository.save(product);
        return convertToDTO(product);
    }
    
    @Transactional
    public ProductDTO updateProduct(Long productId, ProductUpdateDTO productDTO, MultipartFile imageFile) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        
        // Update category if provided
        if (productDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + productDTO.getCategoryId()));
            product.setCategory(category);
        }
        
        // Update other fields if provided
        if (productDTO.getName() != null) {
            product.setName(productDTO.getName());
        }
        if (productDTO.getDescription() != null) {
            product.setDescription(productDTO.getDescription());
        }
        if (productDTO.getBasePrice() != null) {
            product.setBasePrice(productDTO.getBasePrice());
        }
        if (productDTO.getDisplayOrder() != null) {
            product.setDisplayOrder(productDTO.getDisplayOrder());
        }
        if (productDTO.getIsActive() != null) {
            product.setIsActive(productDTO.getIsActive());
        }
        
        // Handle image upload/replacement
        if (imageFile != null && !imageFile.isEmpty()) {
            // Delete old image if exists
            if (product.getImageUrl() != null && product.getImageUrl().startsWith("/api/files/")) {
                String oldFilename = product.getImageUrl().replace("/api/files/", "");
                try {
                    fileStorageService.deleteFile(oldFilename);
                } catch (Exception e) {
                    // Log error but continue
                }
            }
            
            // Store new image
            String filename = fileStorageService.storeFile(imageFile);
            product.setImageUrl("/api/files/" + filename);
        }
        
        product = productRepository.save(product);
        return convertToDTO(product);
    }
    
    @Transactional
    public void deleteProductImage(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        
        if (product.getImageUrl() != null && product.getImageUrl().startsWith("/api/files/")) {
            String filename = product.getImageUrl().replace("/api/files/", "");
            fileStorageService.deleteFile(filename);
            product.setImageUrl(null);
            productRepository.save(product);
        }
    }
    
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        
        // Soft delete by setting isActive to false
        product.setIsActive(false);
        productRepository.save(product);
    }
    
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getProductId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setBasePrice(product.getBasePrice());
        dto.setImageUrl(product.getImageUrl());
        dto.setIsActive(product.getIsActive());
        dto.setDisplayOrder(product.getDisplayOrder());
        
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getCategoryId());
            dto.setCategoryName(product.getCategory().getName());
        }
        
        return dto;
    }
}

