package com.example.memorycapsule.controller;

import com.example.memorycapsule.model.Capsule;
import com.example.memorycapsule.model.User;
import com.example.memorycapsule.service.AIService;
import com.example.memorycapsule.service.CapsuleService;
import com.example.memorycapsule.service.FileService;
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

@RestController
@RequestMapping("/api/capsules")
@RequiredArgsConstructor
public class CapsuleController {
    private final CapsuleService capsuleService;
    private final FileService fileService;
    private final AIService aiService;
    private static final Logger logger = LoggerFactory.getLogger(CapsuleController.class);

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
                logger.error("AI summary failed: {}", e.getMessage());
            }
        }

        String dataToHash = title +
                (textContent != null ? textContent : "") +
                (fileUrl != null ? fileUrl : "") +
                unlockDate;

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

    @PutMapping("/{id}")
    public Capsule updateCapsule(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam String messageType,
            @RequestParam(required = false) String textContent,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam String unlockDate
    ) throws IOException {
        Capsule existingCapsule = capsuleService.getByIdAndUser(id, user);
        if (existingCapsule == null) {
            throw new IllegalArgumentException("Capsule not found or not authorized");
        }

        String fileUrl = existingCapsule.getFileUrl();
        String aiSummary = existingCapsule.getAiSummary();

        if (file != null && !file.isEmpty()) {
            // Delete old file if exists
            if (fileUrl != null) {
                fileService.deleteFile(fileUrl);
            }
            fileUrl = fileService.uploadFile(file);
        }

        if (textContent != null && !textContent.isEmpty()) {
            try {
                aiSummary = aiService.generateReflection(textContent);
            } catch (Exception e) {
                logger.error("AI summary failed during update: {}", e.getMessage());
            }
        }

        String dataToHash = title +
                (textContent != null ? textContent : "") +
                (fileUrl != null ? fileUrl : "") +
                unlockDate;

        String blockchainHash = HashUtil.computeSHA256(dataToHash);

        existingCapsule.setTitle(title);
        existingCapsule.setMessageType(messageType);
        existingCapsule.setTextContent(textContent);
        existingCapsule.setFileUrl(fileUrl);
        try {
            existingCapsule.setUnlockDate(LocalDateTime.parse(unlockDate));
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid unlock date format");
        }
        existingCapsule.setAiSummary(aiSummary);
        existingCapsule.setBlockchainHash(blockchainHash);

        return capsuleService.save(existingCapsule);
    }
    
    @GetMapping
    public List<Capsule> getCapsules(@AuthenticationPrincipal User user) {
        logger.info("Fetching capsules for user: {}", user.getId());
        return capsuleService.getByUser(user);
    }

    @GetMapping("/{id}")
    public Capsule getCapsuleById(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        Capsule capsule = capsuleService.getByIdAndUser(id, user);
        if (capsule == null) {
            throw new IllegalArgumentException("Capsule not found or not authorized");
        }
        return capsule;
    }

    @DeleteMapping("/{id}")
    public void deleteCapsule(@PathVariable Long id) {
        capsuleService.delete(id);
    }
}