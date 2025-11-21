package com.tinyworld.controller;

import com.tinyworld.dto.OrderRequest;
import com.tinyworld.dto.OrderResponse;
import com.tinyworld.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request) {
        Long userId = getCurrentUserId();
        OrderResponse response = orderService.createOrder(userId, request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getUserOrders() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(orderService.getOrderById(id, userId));
    }
    
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return orderService.getUserIdByEmail(email);
    }
}

