package com.tinyworld.service;

import com.tinyworld.dto.AdminOrderCreateDTO;
import com.tinyworld.dto.OrderItemDTO;
import com.tinyworld.dto.OrderResponse;
import com.tinyworld.dto.PaginatedResponse;
import com.tinyworld.model.Order;
import com.tinyworld.model.OrderItem;
import com.tinyworld.model.Product;
import com.tinyworld.model.User;
import com.tinyworld.repository.OrderRepository;
import com.tinyworld.repository.ProductRepository;
import com.tinyworld.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminOrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Transactional(readOnly = true)
    public PaginatedResponse<OrderResponse> getAllOrders(String statusFilter, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        String status = (statusFilter != null && !statusFilter.isEmpty()) ? statusFilter : null;
        
        Page<Order> orderPage = orderRepository.findAllByStatus(status, pageable);
        
        // Load full order details with items for each order
        List<OrderResponse> content = orderPage.getContent().stream()
                .map(order -> {
                    // Load the full order with items using the existing method
                    Order fullOrder = orderRepository.findByIdWithItems(order.getOrderId())
                            .orElse(order);
                    return convertToResponse(fullOrder);
                })
                .collect(Collectors.toList());
        
        PaginatedResponse<OrderResponse> response = new PaginatedResponse<>();
        response.setContent(content);
        response.setPage(orderPage.getNumber());
        response.setSize(orderPage.getSize());
        response.setTotalElements(orderPage.getTotalElements());
        response.setTotalPages(orderPage.getTotalPages());
        response.setHasNext(orderPage.hasNext());
        response.setHasPrevious(orderPage.hasPrevious());
        
        return response;
    }
    
    // Keep backward compatibility method
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders(String statusFilter) {
        List<Order> orders = orderRepository.findAllWithItems();
        
        if (statusFilter != null && !statusFilter.isEmpty()) {
            orders = orders.stream()
                    .filter(order -> order.getStatus().equalsIgnoreCase(statusFilter))
                    .collect(Collectors.toList());
        }
        
        return orders.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        return convertToResponse(order);
    }
    
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        
        // Validate status
        List<String> validStatuses = List.of(
            "PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"
        );
        if (!validStatuses.contains(newStatus.toUpperCase())) {
            throw new RuntimeException("Invalid order status: " + newStatus);
        }
        
        order.setStatus(newStatus.toUpperCase());
        order = orderRepository.save(order);
        
        return convertToResponse(order);
    }
    
    private OrderResponse convertToResponse(Order order) {
        if (order == null) {
            throw new RuntimeException("Order cannot be null");
        }
        
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        
        if (order.getUser() != null) {
            response.setUserId(order.getUser().getUserId());
        }
        
        response.setTotalCost(order.getTotalCost());
        response.setTotalQuantity(order.getTotalQuantity());
        response.setOrderDate(order.getOrderDate());
        response.setDeliveryMethod(order.getDeliveryMethod());
        response.setStatus(order.getStatus());
        response.setEmail(order.getEmail());
        response.setCellno(order.getCellno());
        
        // Safely handle orderItems - initialize if null
        List<OrderItem> items = order.getOrderItems();
        if (items == null) {
            items = new java.util.ArrayList<>();
        }
        
        List<OrderResponse.OrderItemResponse> itemResponses = items.stream()
                .filter(item -> item != null)
                .map(item -> {
                    OrderResponse.OrderItemResponse itemResponse = new OrderResponse.OrderItemResponse();
                    itemResponse.setOrderItemId(item.getOrderItemId());
                    
                    if (item.getProduct() != null) {
                        itemResponse.setProductId(item.getProduct().getProductId());
                        itemResponse.setProductName(item.getProduct().getName());
                        if (item.getProduct().getCategory() != null) {
                            itemResponse.setCategoryName(item.getProduct().getCategory().getName());
                        }
                    }
                    
                    itemResponse.setQuantity(item.getQuantity());
                    itemResponse.setUnitPrice(item.getUnitPrice());
                    itemResponse.setPersonalizationType(item.getPersonalizationType());
                    itemResponse.setPersonalizationValue(item.getPersonalizationValue());
                    return itemResponse;
                })
                .collect(Collectors.toList());
        
        response.setItems(itemResponses);
        return response;
    }
    
    @Transactional
    public OrderResponse createOrder(AdminOrderCreateDTO request) {
        User user = null;
        
        // If userId is provided, use that user; otherwise find or create by email
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));
        } else {
            // Try to find user by email
            user = userRepository.findByEmail(request.getEmail()).orElse(null);
            // If user doesn't exist, we'll create the order without a user link
            // (This allows orders for non-registered customers)
        }
        
        Order order = new Order();
        if (user != null) {
            order.setUser(user);
        }
        order.setOrderDate(LocalDate.now());
        order.setEmail(request.getEmail());
        order.setCellno(request.getCellno());
        order.setDeliveryMethod(request.getDeliveryMethod());
        order.setStatus(request.getStatus() != null ? request.getStatus() : "PENDING_PAYMENT");
        
        BigDecimal totalCost = BigDecimal.ZERO;
        int totalQuantity = 0;
        
        for (OrderItemDTO itemDTO : request.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + itemDTO.getProductId()));
            
            BigDecimal unitPrice = calculateUnitPrice(product.getBasePrice(), itemDTO.getPersonalizationType());
            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(itemDTO.getQuantity()));
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setUnitPrice(unitPrice);
            orderItem.setPersonalizationType(itemDTO.getPersonalizationType());
            orderItem.setPersonalizationValue(itemDTO.getPersonalizationValue());
            
            order.getOrderItems().add(orderItem);
            
            totalCost = totalCost.add(itemTotal);
            totalQuantity += itemDTO.getQuantity();
        }
        
        order.setTotalCost(totalCost);
        order.setTotalQuantity(totalQuantity);
        
        order = orderRepository.save(order);
        
        // Load order items for response
        order.getOrderItems().size();
        
        return convertToResponse(order);
    }
    
    private BigDecimal calculateUnitPrice(BigDecimal basePrice, String personalizationType) {
        if (personalizationType == null || personalizationType.equals("NONE")) {
            return basePrice;
        } else if (personalizationType.equals("NAME")) {
            return basePrice.add(BigDecimal.valueOf(30));
        } else if (personalizationType.equals("INITIAL")) {
            return basePrice.add(BigDecimal.valueOf(20));
        }
        return basePrice;
    }
}

