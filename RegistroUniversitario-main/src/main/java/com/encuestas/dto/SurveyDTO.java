package com.encuestas.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private Boolean active;
    private List<QuestionDTO> questions;
    private Long totalResponses;
    private Long UserId;
}
