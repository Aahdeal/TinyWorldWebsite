package com.tinyworld.repository;

import com.tinyworld.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT o FROM Order o WHERE o.user.userId = :userId ORDER BY o.createdAt DESC")
    List<Order> findUserOrders(@Param("userId") Long userId);
    
    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.orderItems oi " +
           "LEFT JOIN FETCH oi.product p " +
           "LEFT JOIN FETCH p.category c " +
           "LEFT JOIN FETCH o.user")
    List<Order> findAllWithItems();
    
    @Query("SELECT DISTINCT o FROM Order o WHERE (:status IS NULL OR o.status = :status) ORDER BY o.createdAt DESC")
    Page<Order> findAllByStatus(@Param("status") String status, Pageable pageable);
    
    @Query("SELECT o FROM Order o " +
           "LEFT JOIN FETCH o.orderItems oi " +
           "LEFT JOIN FETCH oi.product p " +
           "LEFT JOIN FETCH p.category c " +
           "LEFT JOIN FETCH o.user " +
           "WHERE o.orderId = :orderId")
    java.util.Optional<Order> findByIdWithItems(@Param("orderId") Long orderId);
}

