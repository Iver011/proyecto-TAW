package com.encuestas.repository;

import com.encuestas.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findBySurveyResponseId(Long surveyResponseId);
    List<Answer> findByQuestionId(Long questionId);
}