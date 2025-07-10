package com.example.memorycapsule.scheduler;


import com.example.memorycapsule.model.Capsule;
import com.example.memorycapsule.repository.CapsuleRepository;
import com.example.memorycapsule.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CapsuleScheduler {
    private final CapsuleRepository capsuleRepository;
    private final EmailService emailService;


    @Scheduled(fixedRate = 60000) // every 1 min
    public void unlockCapsules() {
        System.out.println("unlockCapsules running...");
        List<Capsule> capsules = capsuleRepository.findAll();
        for (Capsule capsule : capsules) {
            System.out.println(capsule.getTitle() +": "+ capsule.getUnlockDate());
            if (!capsule.isUnlocked() && capsule.getUnlockDate().isBefore(LocalDateTime.now())) {
                capsule.setUnlocked(true);
                capsuleRepository.save(capsule);

                String email = capsule.getUser().getEmail();
                String subject = "🎉 Your Memory Capsule is now unlocked!";
                String body = "Hi " + capsule.getUser().getUsername() +
                        ",\n\nYour capsule titled '" + capsule.getTitle() + "' is now unlocked! Check it in your dashboard.\n\nEnjoy your memories!\n\n💌 Memory Capsule Team";

                emailService.sendNotification(email, subject, body);
            }
        }
    }
}
