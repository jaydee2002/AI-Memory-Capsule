package com.example.memorycapsule.controller;


import com.example.memorycapsule.model.AuthRequest;
import com.example.memorycapsule.model.AuthResponse;
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
import org.springframework.security.crypto.password.PasswordEncoder;
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
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        System.out.println("Login attempt for email: " + authRequest.getEmail());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
            );
            System.out.println("Authentication successful for email: " + authRequest.getEmail());
            String token = jwtUtil.generateToken(authRequest.getEmail());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (AuthenticationException e) {
            System.err.println("Authentication failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse("Invalid email or password"));
        }
    }
}
