package com.encuestas.service;
import com.encuestas.dto.QuestionDTO;
import com.encuestas.dto.QuestionOptionDTO;
import com.encuestas.model.Question;
import com.encuestas.model.QuestionOption;
import com.encuestas.model.Survey;
import com.encuestas.repository.QuestionRepository;
import com.encuestas.repository.QuestionOptionRepository;
import com.encuestas.repository.SurveyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuestionService {
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private QuestionOptionRepository questionOptionRepository;
    
    @Autowired
    private SurveyRepository surveyRepository;
    
    public List<QuestionDTO> getQuestionsBySurveyId(Long surveyId) {
        return questionRepository.findBySurveyIdWithOptions(surveyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public QuestionDTO getQuestionById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pregunta no encontrada"));
        return convertToDTO(question);
    }
    
    public void saveAll(List<QuestionDTO> questionDTOs) {
    for (QuestionDTO dto : questionDTOs) {
        boolean exists = questionRepository.existsByTextAndSurveyId(dto.getText(), dto.getSurveyId());
        if (!exists) {
            createQuestion(dto); // usa tu lógica actual
        }
    }
}

    public QuestionDTO createQuestion(QuestionDTO questionDTO) {
        Survey survey = surveyRepository.findById(questionDTO.getSurveyId())
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada"));
        
        Question question = convertToEntity(questionDTO);
        question.setSurvey(survey);
        question = questionRepository.save(question);
        
        // Crear opciones si existen
        if (questionDTO.getOptions() != null && !questionDTO.getOptions().isEmpty()) {
            for (QuestionOptionDTO optionDTO : questionDTO.getOptions()) {
                QuestionOption option = new QuestionOption();
                option.setQuestion(question);
                option.setText(optionDTO.getText());
                option.setOrderIndex(optionDTO.getOrderIndex());
                questionOptionRepository.save(option);
            }
        }
        
        return convertToDTO(questionRepository.findById(question.getId()).orElse(question));
    }
    
    public QuestionDTO updateQuestion(Long id, QuestionDTO questionDTO) {
        Question existingQuestion = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pregunta no encontrada"));
        
        existingQuestion.setText(questionDTO.getText());
        existingQuestion.setQuestionType(questionDTO.getQuestionType());
        existingQuestion.setOrderIndex(questionDTO.getOrderIndex());
        existingQuestion.setRequired(questionDTO.getRequired());
        
        Question updatedQuestion = questionRepository.save(existingQuestion);
        return convertToDTO(updatedQuestion);
    }
    
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }
    
    private QuestionDTO convertToDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setSurveyId(question.getSurvey().getId());
        dto.setText(question.getText());
        dto.setQuestionType(question.getQuestionType());
        dto.setOrderIndex(question.getOrderIndex());
        dto.setRequired(question.getRequired());
        
        if (question.getOptions() != null) {
            dto.setOptions(question.getOptions().stream()
                    .map(this::convertOptionToDTO)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    private QuestionOptionDTO convertOptionToDTO(QuestionOption option) {
        QuestionOptionDTO dto = new QuestionOptionDTO();
        dto.setId(option.getId());
        dto.setText(option.getText());
        dto.setOrderIndex(option.getOrderIndex());
        return dto;
    }
    
    private Question convertToEntity(QuestionDTO dto) {
        Question question = new Question();
        question.setText(dto.getText());
        question.setQuestionType(dto.getQuestionType());
        question.setOrderIndex(dto.getOrderIndex());
        question.setRequired(dto.getRequired() != null ? dto.getRequired() : false);
        question.setOptions(new ArrayList<>());
        return question;
    }
    public List<QuestionDTO> syncQuestions(Long surveyId, List<QuestionDTO> incomingQuestions) {
    List<Question> existingQuestions = questionRepository.findBySurveyIdOrderByOrderIndexAsc(surveyId);

    Map<Long, Question> existingMap = existingQuestions.stream()
            .collect(Collectors.toMap(Question::getId, q -> q));

    List<Question> toSave = new ArrayList<>();
    Set<Long> incomingIds = new HashSet<>();

    for (QuestionDTO dto : incomingQuestions) {
        if (dto.getId() != null && existingMap.containsKey(dto.getId())) {
            // Actualizar pregunta
            Question existing = existingMap.get(dto.getId());
            existing.setText(dto.getText());
            existing.setQuestionType(dto.getQuestionType());
            existing.setRequired(dto.getRequired());
            existing.setOrderIndex(dto.getOrderIndex());

            // Opciones (puedes mejorar esto con lógica de diferencia si es necesario)
            existing.getOptions().clear();
            if (dto.getOptions() != null) {
                for (QuestionOptionDTO optDTO : dto.getOptions()) {
                    QuestionOption opt = new QuestionOption();
                    opt.setQuestion(existing);
                    opt.setText(optDTO.getText());
                    opt.setOrderIndex(optDTO.getOrderIndex());
                    existing.getOptions().add(opt);
                }
            }

            toSave.add(existing);
            incomingIds.add(existing.getId());
        } else {
            // Crear nueva pregunta
            Question newQ = convertToEntity(dto);
            newQ.setSurvey(surveyRepository.findById(surveyId).orElseThrow());
            if (dto.getOptions() != null) {
                for (QuestionOptionDTO optDTO : dto.getOptions()) {
                    QuestionOption opt = new QuestionOption();
                    opt.setQuestion(newQ);
                    opt.setText(optDTO.getText());
                    opt.setOrderIndex(optDTO.getOrderIndex());
                    newQ.getOptions().add(opt);
                }
            }
            toSave.add(newQ);
        }
    }

    // Eliminar preguntas que ya no están
    List<Question> toDelete = existingQuestions.stream()
            .filter(q -> !incomingIds.contains(q.getId()))
            .collect(Collectors.toList());

    questionRepository.deleteAll(toDelete);

    return questionRepository.saveAll(toSave).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
}
public boolean isSurveyOwnedByUser(Long surveyId, String username) {
    return surveyRepository.existsByIdAndUsuarioUsername(surveyId, username);
}
public List<QuestionDTO> getQuestionsBySurveyIdForUser(Long surveyId, String username) {
    if (!isSurveyOwnedByUser(surveyId, username)) {
        throw new AccessDeniedException("No tienes acceso a esta encuesta.");
    }
    return getQuestionsBySurveyId(surveyId); // Método que ya tienes
}
public QuestionDTO updateQuestion(Long id, QuestionDTO dto, String username) {
    Question question = questionRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Pregunta no encontrada"));

    if (!isSurveyOwnedByUser(question.getSurvey().getId(), username)) {
        throw new AccessDeniedException("No tienes permiso para editar esta pregunta.");
    }

    question.setText(dto.getText());
    question.setQuestionType(dto.getQuestionType());
    question.setOrderIndex(dto.getOrderIndex());
    question.setRequired(dto.getRequired());

    return convertToDTO(questionRepository.save(question));
}

public void deleteQuestion(Long id, String username) {
    Question question = questionRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Pregunta no encontrada"));

    if (!isSurveyOwnedByUser(question.getSurvey().getId(), username)) {
        throw new AccessDeniedException("No tienes permiso para eliminar esta pregunta.");
    }

    questionRepository.delete(question);
}

}
