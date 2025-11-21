package com.tinyworld.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderStatusUpdateDTO {
    
    @NotBlank(message = "Status is required")
    private String status;
}

