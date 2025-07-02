package com.example.memorycapsule.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Capsule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String messageType; // TEXT, AUDIO, VIDEO
    private String textContent;
    private String fileUrl;

    private LocalDateTime unlockDate;

    private boolean isUnlocked;

    private String aiSummary;
    private String blockchainHash;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
