package com.tinyworld.service;

import com.tinyworld.dto.OrderItemDTO;
import com.tinyworld.dto.OrderRequest;
import com.tinyworld.dto.OrderResponse;
import com.tinyworld.model.Order;
import com.tinyworld.model.OrderItem;
import com.tinyworld.model.Product;
import com.tinyworld.model.User;
import com.tinyworld.repository.OrderRepository;
import com.tinyworld.repository.ProductRepository;
import com.tinyworld.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
    
    @Transactional
    public OrderResponse createOrder(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDate.now());
        order.setEmail(request.getEmail());
        order.setCellno(request.getCellno());
        order.setDeliveryMethod(request.getDeliveryMethod());
        order.setStatus("PENDING_PAYMENT");
        
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
        
        return convertToResponse(order);
    }
    
    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findUserOrders(userId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public OrderResponse getOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        
        if (!order.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to order");
        }
        
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
    
    private OrderResponse convertToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setUserId(order.getUser().getUserId());
        response.setTotalCost(order.getTotalCost());
        response.setTotalQuantity(order.getTotalQuantity());
        response.setOrderDate(order.getOrderDate());
        response.setDeliveryMethod(order.getDeliveryMethod());
        response.setStatus(order.getStatus());
        response.setEmail(order.getEmail());
        response.setCellno(order.getCellno());
        
        List<OrderResponse.OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(item -> {
                    OrderResponse.OrderItemResponse itemResponse = new OrderResponse.OrderItemResponse();
                    itemResponse.setOrderItemId(item.getOrderItemId());
                    itemResponse.setProductId(item.getProduct().getProductId());
                    itemResponse.setProductName(item.getProduct().getName());
                    if (item.getProduct().getCategory() != null) {
                        itemResponse.setCategoryName(item.getProduct().getCategory().getName());
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
}

