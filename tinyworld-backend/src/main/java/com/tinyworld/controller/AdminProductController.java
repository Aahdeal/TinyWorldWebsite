package com.tinyworld.controller;

import com.tinyworld.dto.ProductCreateDTO;
import com.tinyworld.dto.ProductDTO;
import com.tinyworld.dto.ProductUpdateDTO;
import com.tinyworld.security.AdminSecurityUtils;
import com.tinyworld.service.AdminProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {
    
    @Autowired
    private AdminProductService adminProductService;
    
    @Autowired
    private AdminSecurityUtils adminSecurityUtils;
    
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        adminSecurityUtils.ensureAdmin();
        return ResponseEntity.ok(adminProductService.getAllProducts());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        adminSecurityUtils.ensureAdmin();
        return ResponseEntity.ok(adminProductService.getProductById(id));
    }
    
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(
            @RequestPart("product") @Valid ProductCreateDTO productDTO,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        adminSecurityUtils.ensureAdmin();
        return ResponseEntity.ok(adminProductService.createProduct(productDTO, imageFile));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") @Valid ProductUpdateDTO productDTO,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        adminSecurityUtils.ensureAdmin();
        return ResponseEntity.ok(adminProductService.updateProduct(id, productDTO, imageFile));
    }
    
    @DeleteMapping("/{id}/image")
    public ResponseEntity<Void> deleteProductImage(@PathVariable Long id) {
        adminSecurityUtils.ensureAdmin();
        adminProductService.deleteProductImage(id);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        adminSecurityUtils.ensureAdmin();
        adminProductService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
}

