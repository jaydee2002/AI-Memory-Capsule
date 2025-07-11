package com.example.memorycapsule.controller;

import com.example.memorycapsule.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/files")
public class FileController {

    private final FileService fileService;

    @GetMapping("/url")
    public ResponseEntity<String> getPresignedUrl(@RequestParam String fileName, Authentication auth) {
        // Only allow if user is authenticated
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String url = fileService.generatePresignedUrl(fileName);
        return ResponseEntity.ok(url);
    }
}
