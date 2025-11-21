package com.tinyworld.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long orderId;
    private Long userId;
    private BigDecimal totalCost;
    private Integer totalQuantity;
    private LocalDate orderDate;
    private String deliveryMethod;
    private String status;
    private String email;
    private String cellno;
    private List<OrderItemResponse> items;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponse {
        private Long orderItemId;
        private Long productId;
        private String productName;
        private String categoryName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private String personalizationType;
        private String personalizationValue;
    }
}

