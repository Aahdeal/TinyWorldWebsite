package com.tinyworld.controller;

import com.tinyworld.dto.UserProfileDTO;
import com.tinyworld.service.OrderService;
import com.tinyworld.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private OrderService orderService;
    
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }
    
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateUserProfile(@Valid @RequestBody UserProfileDTO profileDTO) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(userService.updateUserProfile(userId, profileDTO));
    }
    
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return orderService.getUserIdByEmail(email);
    }
}

