package com.tinyworld.service;

import com.tinyworld.dto.ProductDTO;
import com.tinyworld.model.Product;
import com.tinyworld.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAllActive().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndActive(categoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ProductDTO getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        return convertToDTO(product);
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

