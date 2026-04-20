package com.capstone.backend;

import com.capstone.backend.model.Role;
import com.capstone.backend.model.User;
import com.capstone.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User patient = User.builder()
                    .username("patient1")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.PATIENT)
                    .build();

            User clinician = User.builder()
                    .username("dr_smith")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.CLINICIAN)
                    .build();

            userRepository.save(patient);
            userRepository.save(clinician);

            System.out.println("Test users seeded successfully: patient1 (PATIENT) and dr_smith (CLINICIAN).");
        }
    }
}
