package com.capstone.backend.controller;

import com.capstone.backend.dto.JournalEntryRequestDto;
import com.capstone.backend.dto.JournalEntryResponseDto;
import com.capstone.backend.service.JournalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/journals")
@RequiredArgsConstructor
public class JournalController {

    private final JournalService journalService;

    @PostMapping
    public ResponseEntity<JournalEntryResponseDto> createJournalEntry(@Valid @RequestBody JournalEntryRequestDto requestDto) {
        JournalEntryResponseDto createdEntry = journalService.createJournalEntry(requestDto);
        return new ResponseEntity<>(createdEntry, HttpStatus.CREATED);
    }

    @GetMapping("/patient/{id}")
    public ResponseEntity<List<JournalEntryResponseDto>> getEntriesByPatientId(@PathVariable Long id) {
        List<JournalEntryResponseDto> entries = journalService.getEntriesByPatientId(id);
        return ResponseEntity.ok(entries);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JournalEntryResponseDto> updateJournal(
            @PathVariable Long id, 
            @Valid @RequestBody JournalEntryRequestDto requestDto) {
        JournalEntryResponseDto updatedEntry = journalService.updateJournal(id, requestDto);
        return ResponseEntity.ok(updatedEntry);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJournal(@PathVariable Long id) {
        journalService.deleteJournal(id);
        return ResponseEntity.noContent().build();
    }
}
