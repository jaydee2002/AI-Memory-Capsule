package com.example.memorycapsule.repository;

import com.example.memorycapsule.model.Capsule;
import com.example.memorycapsule.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;


public interface CapsuleRepository extends JpaRepository<Capsule, Long> {
    List<Capsule> findByUser(User user);

    Optional<Capsule> findByIdAndUser(Long id, User user);
}