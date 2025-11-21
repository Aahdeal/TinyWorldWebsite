package com.tinyworld.dto;

import jakarta.validation.constraints.DecimalMin;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductUpdateDTO {
    private Long categoryId;
    private String name;
    private String description;
    
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal basePrice;
    
    private Integer displayOrder;
    private Boolean isActive;
}

