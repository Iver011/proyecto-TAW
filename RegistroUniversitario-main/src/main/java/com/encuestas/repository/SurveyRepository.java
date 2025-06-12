package com.encuestas.repository;

import com.encuestas.model.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
    
@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
    List<Survey>findByUsuario_Username(String username);
    List<Survey> findByActiveTrue();
    
    @Query("SELECT s FROM Survey s LEFT JOIN FETCH s.questions WHERE s.id = :id")
    Survey findByIdWithQuestions(Long id);
    
    @Query("SELECT COUNT(sr) FROM SurveyResponse sr WHERE sr.survey.id = :surveyId")
    Long countResponsesBySurveyId(Long surveyId);
    Optional<Survey> findByIdAndUsuario_Username(Long id, String username);
List<Survey> findByUsuario_UsernameAndActiveTrue(String username);
boolean existsByIdAndUsuarioUsername(Long id, String username);

}

