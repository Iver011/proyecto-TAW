package com.encuestas.controller;

import com.encuestas.dto.QuestionDTO;
import com.encuestas.repository.QuestionRepository;
import com.encuestas.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {
    
    private final QuestionRepository questionRepository;

    public QuestionController(QuestionRepository questionRepository, QuestionService questionService) {
        this.questionRepository = questionRepository;
        this.questionService = questionService;
    }
    @Autowired
    private QuestionService questionService;
    
    private String getCurrentUsername() {
    return SecurityContextHolder.getContext().getAuthentication().getName();
}

    @GetMapping("/survey/{surveyId}")
    public ResponseEntity<List<QuestionDTO>> getQuestionsBySurveyId(@PathVariable Long surveyId) {
            String username = getCurrentUsername();

        return ResponseEntity.ok(questionService.getQuestionsBySurveyIdForUser(surveyId,username));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<QuestionDTO> getQuestionById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }
    
 @PostMapping
public ResponseEntity<?> createQuestions(@RequestBody List<QuestionDTO> questions) {
    if (questions == null || questions.isEmpty()) {
        return ResponseEntity.badRequest().body("Lista vacía");
    }

    String username = getCurrentUsername();
    boolean todosSonDelUsuario = questions.stream()
        .allMatch(q -> questionService.isSurveyOwnedByUser(q.getSurveyId(), username));

    if (!todosSonDelUsuario) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body("Una o más preguntas no pertenecen a tus encuestas");
    }

    List<QuestionDTO> nuevasPreguntas = questions.stream()
        .filter(q -> !questionRepository.existsByTextAndSurveyId(q.getText(), q.getSurveyId()))
        .collect(Collectors.toList());

    if (nuevasPreguntas.isEmpty()) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body("Todas las preguntas ya existen");
    }

    questionService.saveAll(nuevasPreguntas);
    return ResponseEntity.ok("Se guardaron " + nuevasPreguntas.size() + " nuevas preguntas");
}


    
    @PutMapping("/{id}")
    public ResponseEntity<QuestionDTO> updateQuestion(@PathVariable Long id, @RequestBody QuestionDTO questionDTO) {
        return ResponseEntity.ok(questionService.updateQuestion(id, questionDTO));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/sync/{surveyId}")
public ResponseEntity<?> syncQuestions(
        @PathVariable Long surveyId,
        @RequestBody List<QuestionDTO> incomingQuestions) {

    List<QuestionDTO> result = questionService.syncQuestions(surveyId, incomingQuestions);
    return ResponseEntity.ok(result);
}

}