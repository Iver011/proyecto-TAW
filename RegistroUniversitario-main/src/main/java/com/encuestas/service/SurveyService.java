package com.encuestas.service;

import com.encuestas.dto.SurveyDTO;
import com.encuestas.dto.QuestionDTO;
import com.encuestas.model.Survey;
import com.encuestas.model.Question;
import com.encuestas.repository.SurveyRepository;
import com.encuestas.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import com.encuestas.registro.repository.UsuarioRepository;

@Service
@Transactional
public class SurveyService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public List<SurveyDTO> getSurveysByUsername(String username) {
        return surveyRepository.findByUsuario_Username(username).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public SurveyDTO getSurveyByIdForUser(Long id, String username) {
        Survey survey = surveyRepository.findByIdAndUsuario_Username(id, username)
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada o no autorizada"));
        return convertToDTO(survey);
    }

    public SurveyDTO createSurvey(SurveyDTO surveyDTO, String username) {
        Survey survey = convertToEntity(surveyDTO);
        survey.setUsuario(usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")));
        survey = surveyRepository.save(survey);
        return convertToDTO(survey);
    }

    public SurveyDTO updateSurvey(Long id, SurveyDTO surveyDTO, String username) {
        Survey existingSurvey = surveyRepository.findByIdAndUsuario_Username(id, username)
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada o no autorizada"));

        existingSurvey.setTitle(surveyDTO.getTitle());
        existingSurvey.setDescription(surveyDTO.getDescription());
        existingSurvey.setActive(surveyDTO.getActive());

        Survey updatedSurvey = surveyRepository.save(existingSurvey);
        return convertToDTO(updatedSurvey);
    }

    public void deleteSurvey(Long id, String username) {
        Survey survey = surveyRepository.findByIdAndUsuario_Username(id, username)
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada o no autorizada"));
       // survey.setActive(false);
       
        surveyRepository.delete(survey);
    }

    private SurveyDTO convertToDTO(Survey survey) {
        SurveyDTO dto = new SurveyDTO();
        dto.setId(survey.getId());
        dto.setTitle(survey.getTitle());
        dto.setDescription(survey.getDescription());
        dto.setCreatedAt(survey.getCreatedAt());
        dto.setUpdatedAt(survey.getUpdatedAt());
        dto.setActive(survey.getActive());
        dto.setTotalResponses(surveyRepository.countResponsesBySurveyId(survey.getId()));

        if (survey.getQuestions() != null) {
            dto.setQuestions(survey.getQuestions().stream()
                    .map(this::convertQuestionToDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private QuestionDTO convertQuestionToDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setSurveyId(question.getSurvey().getId());
        dto.setText(question.getText());
        dto.setQuestionType(question.getQuestionType());
        dto.setOrderIndex(question.getOrderIndex());
        dto.setRequired(question.getRequired());
        return dto;
    }

    private Survey convertToEntity(SurveyDTO dto) {
        Survey survey = new Survey();
        survey.setTitle(dto.getTitle());
        survey.setDescription(dto.getDescription());
        survey.setActive(dto.getActive() != null ? dto.getActive() : true);
        return survey;
    }
}
