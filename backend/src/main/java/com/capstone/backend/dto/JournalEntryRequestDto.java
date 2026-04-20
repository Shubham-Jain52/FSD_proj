package com.capstone.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JournalEntryRequestDto {

    @NotNull(message = "Patient ID must not be null")
    private Long patientId;

    @NotBlank(message = "Journal entry text cannot be blank")
    @Size(min = 5, message = "Journal entry must be at least 5 characters long")
    private String entryText;

    @NotNull(message = "Mood score must be provided")
    @Min(value = 1, message = "Mood score must be at least 1")
    @Max(value = 10, message = "Mood score cannot be more than 10")
    private Integer moodScore;
}
