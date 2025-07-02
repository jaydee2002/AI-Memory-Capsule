package com.example.memorycapsule.service;

import com.example.memorycapsule.model.Capsule;
import com.example.memorycapsule.model.User;
import com.example.memorycapsule.repository.CapsuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CapsuleService {
    private final CapsuleRepository capsuleRepository;

    public Capsule save(Capsule capsule) {
        return capsuleRepository.save(capsule);
    }

    public List<Capsule> getByUser(User user) {
        return capsuleRepository.findByUser(user);
    }

    public void delete(Long id) {
        capsuleRepository.deleteById(id);
    }
}
