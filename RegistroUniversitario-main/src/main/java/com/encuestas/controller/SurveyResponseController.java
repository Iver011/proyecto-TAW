package com.encuestas.controller;

import com.encuestas.dto.SurveyResponseDTO;
import com.encuestas.service.SurveyResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/responses")
@CrossOrigin(origins = "*")
public class SurveyResponseController {
    
    @Autowired
    private SurveyResponseService surveyResponseService;
    
    @GetMapping("/survey/{surveyId}")
    public ResponseEntity<List<SurveyResponseDTO>> getResponsesBySurveyId(@PathVariable Long surveyId) {
        return ResponseEntity.ok(surveyResponseService.getResponsesBySurveyId(surveyId));
    }
    
    @PostMapping
    public ResponseEntity<SurveyResponseDTO> submitSurveyResponse(@RequestBody SurveyResponseDTO responseDTO) {
        return ResponseEntity.ok(surveyResponseService.submitSurveyResponse(responseDTO));
    }
}