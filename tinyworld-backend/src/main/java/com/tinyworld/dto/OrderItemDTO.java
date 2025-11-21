package com.tinyworld.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    @NotNull(message = "Product ID is required")
    private Long productId;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    
    private String personalizationType; // "NAME", "INITIAL", "NONE"
    private String personalizationValue;
    
    // Calculated fields (for response)
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private String productName;
}

