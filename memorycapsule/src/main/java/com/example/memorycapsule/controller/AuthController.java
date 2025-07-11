package com.example.memorycapsule.controller;


import com.example.memorycapsule.model.AuthRequestDTO;
import com.example.memorycapsule.model.AuthResponseDTO;
import com.example.memorycapsule.model.User;
import com.example.memorycapsule.service.UserService;
import com.example.memorycapsule.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        userService.save(user);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO authRequest) {
        System.out.println("Login attempt for email: " + authRequest.getEmail());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
            );
            System.out.println("Authentication successful for email: " + authRequest.getEmail());
            String token = jwtUtil.generateToken(authRequest.getEmail());
            return ResponseEntity.ok(new AuthResponseDTO(token, authRequest.getEmail()));
        } catch (AuthenticationException e) {
            System.err.println("Authentication failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponseDTO("Invalid email or password"));
        }
    }
}
