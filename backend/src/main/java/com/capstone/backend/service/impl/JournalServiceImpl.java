package com.capstone.backend.service.impl;

import com.capstone.backend.dto.JournalEntryRequestDto;
import com.capstone.backend.dto.JournalEntryResponseDto;
import com.capstone.backend.exception.ResourceNotFoundException;
import com.capstone.backend.model.JournalEntry;
import com.capstone.backend.model.User;
import com.capstone.backend.repository.JournalEntryRepository;
import com.capstone.backend.repository.UserRepository;
import com.capstone.backend.service.JournalService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JournalServiceImpl implements JournalService {

    private final JournalEntryRepository journalEntryRepository;
    private final UserRepository userRepository;

    @Override
    public JournalEntryResponseDto createJournalEntry(JournalEntryRequestDto requestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        JournalEntry entry = JournalEntry.builder()
                .patient(currentUser)
                .entryText(requestDto.getEntryText())
                .moodScore(requestDto.getMoodScore())
                .timestamp(LocalDateTime.now())
                .build();

        JournalEntry savedEntry = journalEntryRepository.save(entry);

        return mapToResponseDto(savedEntry);
    }

    @Override
    public List<JournalEntryResponseDto> getEntriesByPatientId(Long patientId) {
        if (!userRepository.existsById(patientId)) {
            throw new ResourceNotFoundException("Patient not found with id: " + patientId);
        }

        return journalEntryRepository.findByPatientIdOrderByTimestampDesc(patientId).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public JournalEntryResponseDto updateJournal(Long id, JournalEntryRequestDto requestDto) {
        JournalEntry entry = journalEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Journal not found with id: " + id));

        entry.setEntryText(requestDto.getEntryText());
        entry.setMoodScore(requestDto.getMoodScore());
        
        JournalEntry updated = journalEntryRepository.save(entry);
        return mapToResponseDto(updated);
    }

    @Override
    public void deleteJournal(Long id) {
        if (!journalEntryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Journal not found with id: " + id);
        }
        journalEntryRepository.deleteById(id);
    }

    private JournalEntryResponseDto mapToResponseDto(JournalEntry entry) {
        return JournalEntryResponseDto.builder()
                .id(entry.getId())
                .patientId(entry.getPatient().getId())
                .entryText(entry.getEntryText())
                .moodScore(entry.getMoodScore())
                .timestamp(entry.getTimestamp())
                .build();
    }
}
