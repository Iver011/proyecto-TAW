package com.encuestas.repository;

import com.encuestas.model.SurveyResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SurveyResponseRepository extends JpaRepository<SurveyResponse, Long> {
    List<SurveyResponse> findBySurveyId(Long surveyId);
    
    @Query("SELECT sr FROM SurveyResponse sr LEFT JOIN FETCH sr.answers WHERE sr.survey.id = :surveyId")
    List<SurveyResponse> findBySurveyIdWithAnswers(Long surveyId);
}