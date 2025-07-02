package com.example.memorycapsule;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MemorycapsuleApplication {
    public static void main(String[] args) {
        SpringApplication.run(MemorycapsuleApplication.class, args);
    }
}
