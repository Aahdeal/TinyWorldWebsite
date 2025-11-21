package com.tinyworld.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long productId;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private String imageUrl;
    private Boolean isActive;
    private Integer displayOrder;
}

