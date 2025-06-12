package com.encuestas.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerDTO {
    private Long id;
    private Long questionId;
    private Long surveyResponseId;
    private String textAnswer;
    private Double numericAnswer;
    private LocalDate dateAnswer;
    private Long selectedOptionId;
}