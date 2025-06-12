package com.encuestas.repository;

import com.encuestas.model.QuestionOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionOptionRepository extends JpaRepository<QuestionOption, Long> {
    List<QuestionOption> findByQuestionIdOrderByOrderIndexAsc(Long questionId);
}
