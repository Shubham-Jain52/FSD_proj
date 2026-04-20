package com.capstone.backend.controller;

import com.capstone.backend.dto.UserDto;
import com.capstone.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/clinician")
@RequiredArgsConstructor
public class ClinicianController {

    private final UserService userService;

    @GetMapping("/patients")
    public ResponseEntity<List<UserDto>> getPatients() {
        List<UserDto> patients = userService.getPatients();
        return ResponseEntity.ok(patients);
    }
}
