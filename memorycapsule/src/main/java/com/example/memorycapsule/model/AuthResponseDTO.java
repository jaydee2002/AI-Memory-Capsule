package com.example.memorycapsule.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String email;
    private String message;

    // Constructor for success responses (token + email)
    public AuthResponseDTO(String token, String email) {
        this.token = token;
        this.email = email;
        this.message = null;
    }

    // Constructor for error responses (message only)
    public AuthResponseDTO(String message) {
        this.token = null;
        this.email = null;
        this.message = message;
    }
}
