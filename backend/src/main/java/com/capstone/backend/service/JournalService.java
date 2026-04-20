package com.capstone.backend.service;

import com.capstone.backend.dto.JournalEntryRequestDto;
import com.capstone.backend.dto.JournalEntryResponseDto;

import java.util.List;

public interface JournalService {
    JournalEntryResponseDto createJournalEntry(JournalEntryRequestDto requestDto);
    List<JournalEntryResponseDto> getEntriesByPatientId(Long patientId);
    JournalEntryResponseDto updateJournal(Long id, JournalEntryRequestDto requestDto);
    void deleteJournal(Long id);
}
