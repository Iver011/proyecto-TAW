package com.encuestas.dto;

import com.encuestas.model.QuestionType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDTO {
    private Long id;
    private Long surveyId;
    private String text;
    private QuestionType questionType;
    private Integer orderIndex;
    private Boolean required;
    private List<QuestionOptionDTO> options;
}