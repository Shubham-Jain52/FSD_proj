package com.capstone.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JournalEntryResponseDto {
    private Long id;
    private Long patientId; // Flattened references to not expose the Patient 'User' Entity
    private String entryText;
    private Integer moodScore;
    private LocalDateTime timestamp;
}
