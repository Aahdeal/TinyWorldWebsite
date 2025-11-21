package com.tinyworld.dto;

import lombok.Data;

@Data
public class CategoryUpdateDTO {
    private String name;
    private String description;
    private Integer displayOrder;
}

