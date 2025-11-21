package com.tinyworld.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductCreateDTO {
    
    @NotNull(message = "Category ID is required")
    private Long categoryId;
    
    @NotBlank(message = "Product name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal basePrice;
    
    @NotNull(message = "Display order is required")
    private Integer displayOrder = 0;
    
    private Boolean isActive = true;
}

