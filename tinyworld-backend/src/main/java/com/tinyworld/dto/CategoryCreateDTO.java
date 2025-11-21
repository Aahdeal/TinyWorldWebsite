package com.tinyworld.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryCreateDTO {
    
    @NotBlank(message = "Category name is required")
    private String name;
    
    private String description;
    
    private Integer displayOrder = 0;
}

