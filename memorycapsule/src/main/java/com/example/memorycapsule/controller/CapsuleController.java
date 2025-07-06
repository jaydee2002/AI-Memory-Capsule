package com.example.memorycapsule.controller;

import com.example.memorycapsule.model.Capsule;
import com.example.memorycapsule.model.User;
import com.example.memorycapsule.service.AIService;
import com.example.memorycapsule.service.CapsuleService;
import com.example.memorycapsule.service.HashUtil;
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
    private final AIService aiService;

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
        String aiSummary = null;
        String blockchainHash = null;

        if (file != null && !file.isEmpty()) {
            fileUrl = fileService.uploadFile(file);
        }

        if (textContent != null && !textContent.isEmpty()) {
            try {
                aiSummary = aiService.generateReflection(textContent);
            } catch (Exception e) {
                // Log error and continue without AI summary
                System.err.println("AI summary failed: " + e.getMessage());
            }
        }

        // Prepare data string for hashing
        String dataToHash = title +
                (textContent != null ? textContent : "") +
                (fileUrl != null ? fileUrl : "") +
                unlockDate;

        // Compute hash
        blockchainHash = HashUtil.computeSHA256(dataToHash);

        Capsule capsule = Capsule.builder()
                .title(title)
                .messageType(messageType)
                .textContent(textContent)
                .fileUrl(fileUrl)
                .unlockDate(LocalDateTime.parse(unlockDate))
                .isUnlocked(false)
                .aiSummary(aiSummary)
                .blockchainHash(blockchainHash)
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