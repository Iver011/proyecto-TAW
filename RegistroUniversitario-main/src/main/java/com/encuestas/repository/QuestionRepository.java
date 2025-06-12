package com.encuestas.repository;

import com.encuestas.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findBySurveyIdOrderByOrderIndexAsc(Long surveyId);
    boolean existsByTextAndSurveyId(String text, Long surveyId);

    @Query("SELECT q FROM Question q LEFT JOIN FETCH q.options WHERE q.survey.id = :surveyId ORDER BY q.orderIndex")
    List<Question> findBySurveyIdWithOptions(Long surveyId);
}