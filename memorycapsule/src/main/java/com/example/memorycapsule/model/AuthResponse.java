package com.example.memorycapsule.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String message;

    // Constructor for success responses (token + email)
    public AuthResponse(String token, String email) {
        this.token = token;
        this.email = email;
        this.message = null;
    }

    // Constructor for error responses (message only)
    public AuthResponse(String message) {
        this.token = null;
        this.email = null;
        this.message = message;
    }
}
