package com.tinyworld.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class AdminOrderCreateDTO {
    
    @NotEmpty(message = "At least one order item is required")
    @Valid
    private List<OrderItemDTO> items;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Cell number is required")
    private String cellno;
    
    @NotBlank(message = "Delivery method is required")
    private String deliveryMethod;
    
    private String status = "PENDING_PAYMENT";
    
    private Long userId; // Optional - if provided, link to existing user
}

