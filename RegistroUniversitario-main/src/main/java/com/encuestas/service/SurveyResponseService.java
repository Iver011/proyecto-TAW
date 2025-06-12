package com.encuestas.service;

import com.encuestas.dto.SurveyResponseDTO;
import com.encuestas.dto.AnswerDTO;
import com.encuestas.model.SurveyResponse;
import com.encuestas.model.Answer;
import com.encuestas.model.Survey;
import com.encuestas.model.Question;
import com.encuestas.model.QuestionOption;
import com.encuestas.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SurveyResponseService {
    
    @Autowired
    private SurveyResponseRepository surveyResponseRepository;
    
    @Autowired
    private AnswerRepository answerRepository;
    
    @Autowired
    private SurveyRepository surveyRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private QuestionOptionRepository questionOptionRepository;
    
    public List<SurveyResponseDTO> getResponsesBySurveyId(Long surveyId) {
        return surveyResponseRepository.findBySurveyIdWithAnswers(surveyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public SurveyResponseDTO submitSurveyResponse(SurveyResponseDTO responseDTO) {
        Survey survey = surveyRepository.findById(responseDTO.getSurveyId())
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada"));
        
        SurveyResponse surveyResponse = new SurveyResponse();
        surveyResponse.setSurvey(survey);
        surveyResponse.setRespondentEmail(responseDTO.getRespondentEmail());
        surveyResponse = surveyResponseRepository.save(surveyResponse);
        
        // Guardar respuestas
        if (responseDTO.getAnswers() != null) {
            for (AnswerDTO answerDTO : responseDTO.getAnswers()) {
                Answer answer = convertAnswerToEntity(answerDTO);
                answer.setSurveyResponse(surveyResponse);
                answerRepository.save(answer);
            }
        }
        
        return convertToDTO(surveyResponseRepository.findById(surveyResponse.getId()).orElse(surveyResponse));
    }
    
    private SurveyResponseDTO convertToDTO(SurveyResponse surveyResponse) {
        SurveyResponseDTO dto = new SurveyResponseDTO();
        dto.setId(surveyResponse.getId());
        dto.setSurveyId(surveyResponse.getSurvey().getId());
        dto.setRespondentEmail(surveyResponse.getRespondentEmail());
        dto.setSubmittedAt(surveyResponse.getSubmittedAt());
        
        if (surveyResponse.getAnswers() != null) {
            dto.setAnswers(surveyResponse.getAnswers().stream()
                    .map(this::convertAnswerToDTO)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    private AnswerDTO convertAnswerToDTO(Answer answer) {
        AnswerDTO dto = new AnswerDTO();
        dto.setId(answer.getId());
        dto.setQuestionId(answer.getQuestion().getId());
        dto.setSurveyResponseId(answer.getSurveyResponse().getId());
        dto.setTextAnswer(answer.getTextAnswer());
        dto.setNumericAnswer(answer.getNumericAnswer());
        dto.setDateAnswer(answer.getDateAnswer());
        if (answer.getSelectedOption() != null) {
            dto.setSelectedOptionId(answer.getSelectedOption().getId());
        }
        return dto;
    }
    
    private Answer convertAnswerToEntity(AnswerDTO dto) {
        Answer answer = new Answer();
        
        Question question = questionRepository.findById(dto.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Pregunta no encontrada"));
        answer.setQuestion(question);
        
        answer.setTextAnswer(dto.getTextAnswer());
        answer.setNumericAnswer(dto.getNumericAnswer());
        answer.setDateAnswer(dto.getDateAnswer());
        
        if (dto.getSelectedOptionId() != null) {
            QuestionOption option = questionOptionRepository.findById(dto.getSelectedOptionId())
                    .orElseThrow(() -> new RuntimeException("Opción no encontrada"));
            answer.setSelectedOption(option);
        }
        
        return answer;
    }
}
