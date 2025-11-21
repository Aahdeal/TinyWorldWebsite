package com.tinyworld.dto;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private Long userId;
    
    @Email(message = "Email must be valid")
    private String email;
    
    private String name;
    private String surname;
    private String cellno;
    private String role;
}

