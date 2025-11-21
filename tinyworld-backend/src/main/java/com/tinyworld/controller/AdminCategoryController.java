package com.tinyworld.controller;

import com.tinyworld.dto.CategoryCreateDTO;
import com.tinyworld.dto.CategoryDTO;
import com.tinyworld.dto.CategoryUpdateDTO;
import com.tinyworld.security.AdminSecurityUtils;
import com.tinyworld.service.AdminCategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCategoryController {
    
    @Autowired
    private AdminCategoryService adminCategoryService;
    
    @Autowired
    private AdminSecurityUtils adminSecurityUtils;
    
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        adminSecurityUtils.ensureAdmin();
        return ResponseEntity.ok(adminCategoryService.getAllCategories());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        adminSecurityUtils.ensureAdmin();
        return ResponseEntity.ok(adminCategoryService.getCategoryById(id));
    }
    
    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(@Valid @RequestBody CategoryCreateDTO categoryDTO) {
        adminSecurityUtils.ensureAdmin();
        return ResponseEntity.ok(adminCategoryService.createCategory(categoryDTO));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryUpdateDTO categoryDTO) {
        adminSecurityUtils.ensureAdmin();
        return ResponseEntity.ok(adminCategoryService.updateCategory(id, categoryDTO));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        adminSecurityUtils.ensureAdmin();
        adminCategoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
}

