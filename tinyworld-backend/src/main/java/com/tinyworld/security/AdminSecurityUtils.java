package com.tinyworld.security;

import com.tinyworld.exception.UnauthorizedException;
import com.tinyworld.model.User;
import com.tinyworld.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AdminSecurityUtils {
    
    @Autowired
    private UserRepository userRepository;
    
    public Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
        return user.getUserId();
    }
    
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
    }
    
    public void ensureAdmin() {
        User user = getCurrentUser();
        if (user.getRole() != User.Role.ADMIN) {
            throw new UnauthorizedException("Admin access required");
        }
    }
}

