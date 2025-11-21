package com.tinyworld.controller;

import com.tinyworld.dto.AdminOrderCreateDTO;
import com.tinyworld.dto.OrderResponse;
import com.tinyworld.dto.OrderStatusUpdateDTO;
import com.tinyworld.dto.PaginatedResponse;
import com.tinyworld.security.AdminSecurityUtils;
import com.tinyworld.service.AdminOrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {
    
    @Autowired
    private AdminOrderService adminOrderService;
    
    @Autowired
    private AdminSecurityUtils adminSecurityUtils;
    
    @GetMapping
    public ResponseEntity<?> getAllOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "false") boolean paginated) {
        adminSecurityUtils.ensureAdmin();
        
        if (paginated) {
            PaginatedResponse<OrderResponse> paginatedResponse = adminOrderService.getAllOrders(status, page, size);
            return ResponseEntity.ok(paginatedResponse);
        } else {
            // Backward compatibility
            List<OrderResponse> orders = adminOrderService.getAllOrders(status);
            return ResponseEntity.ok(orders);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        adminSecurityUtils.ensureAdmin();
        return ResponseEntity.ok(adminOrderService.getOrderById(id));
    }
    
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody AdminOrderCreateDTO request) {
        adminSecurityUtils.ensureAdmin();
        return ResponseEntity.ok(adminOrderService.createOrder(request));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateDTO statusDTO) {
        adminSecurityUtils.ensureAdmin();
        return ResponseEntity.ok(adminOrderService.updateOrderStatus(id, statusDTO.getStatus()));
    }
}

