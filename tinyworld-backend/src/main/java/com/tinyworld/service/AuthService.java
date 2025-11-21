package com.tinyworld.service;

import com.tinyworld.dto.AuthResponse;
import com.tinyworld.dto.LoginRequest;
import com.tinyworld.dto.RegisterRequest;
import com.tinyworld.model.User;
import com.tinyworld.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.USER);
        
        user = userRepository.save(user);
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole().name());
        String token = jwtService.generateToken(userDetails, extraClaims);
        
        return new AuthResponse(token, "Bearer", user.getUserId(), user.getEmail(), user.getRole().name());
    }
    
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole().name());
        String token = jwtService.generateToken(userDetails, extraClaims);
        
        return new AuthResponse(token, "Bearer", user.getUserId(), user.getEmail(), user.getRole().name());
    }
}

