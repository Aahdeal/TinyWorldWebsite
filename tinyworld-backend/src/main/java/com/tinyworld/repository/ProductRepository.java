package com.tinyworld.repository;

import com.tinyworld.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryCategoryId(Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true ORDER BY p.displayOrder ASC, p.name ASC")
    List<Product> findAllActive();
    
    @Query("SELECT p FROM Product p WHERE p.category.categoryId = :categoryId AND p.isActive = true ORDER BY p.displayOrder ASC, p.name ASC")
    List<Product> findByCategoryIdAndActive(@Param("categoryId") Long categoryId);
}

