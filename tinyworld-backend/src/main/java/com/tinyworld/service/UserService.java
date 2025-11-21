package com.tinyworld.service;

import com.tinyworld.dto.UserProfileDTO;
import com.tinyworld.model.User;
import com.tinyworld.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public UserProfileDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        
        return convertToDTO(user);
    }
    
    @Transactional
    public UserProfileDTO updateUserProfile(Long userId, UserProfileDTO profileDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        
        // Check if email is being changed and if it's already taken
        if (!user.getEmail().equals(profileDTO.getEmail()) && 
            userRepository.existsByEmail(profileDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        user.setEmail(profileDTO.getEmail());
        user.setName(profileDTO.getName() != null ? profileDTO.getName() : "");
        user.setSurname(profileDTO.getSurname() != null ? profileDTO.getSurname() : "");
        user.setCellno(profileDTO.getCellno() != null ? profileDTO.getCellno() : "");
        
        user = userRepository.save(user);
        
        return convertToDTO(user);
    }
    
    private UserProfileDTO convertToDTO(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setUserId(user.getUserId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setSurname(user.getSurname());
        dto.setCellno(user.getCellno());
        dto.setRole(user.getRole().name());
        return dto;
    }
}

