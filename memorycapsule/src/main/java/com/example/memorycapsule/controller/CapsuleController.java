package com.example.memorycapsule.controller;

import com.example.memorycapsule.model.Capsule;
import com.example.memorycapsule.model.User;
import com.example.memorycapsule.service.CapsuleService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import com.example.memorycapsule.service.FileService;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/capsules")
@RequiredArgsConstructor
public class CapsuleController {
    private final CapsuleService capsuleService;
    private final FileService fileService;

    @PostMapping
    public Capsule createCapsule(
            @AuthenticationPrincipal User user,
            @RequestParam String title,
            @RequestParam String messageType,
            @RequestParam(required = false) String textContent,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam String unlockDate
    ) throws IOException {
        String fileUrl = null;

        if (file != null && !file.isEmpty()) {
            fileUrl = fileService.uploadFile(file);
        }

        System.out.println("Authenticated user: " + user);

        Capsule capsule = Capsule.builder()
                .title(title)
                .messageType(messageType)
                .textContent(textContent)
                .fileUrl(fileUrl)
                .unlockDate(LocalDateTime.parse(unlockDate))
                .isUnlocked(false)
                .user(user)
                .build();

        return capsuleService.save(capsule);
    }

    @GetMapping
    public List<Capsule> getCapsules(@AuthenticationPrincipal User user) {
        System.out.println("Authenticated user: " + user);
        return capsuleService.getByUser(user);
    }

    @DeleteMapping("/{id}")
    public void deleteCapsule(@PathVariable Long id) {
        capsuleService.delete(id);
    }
}