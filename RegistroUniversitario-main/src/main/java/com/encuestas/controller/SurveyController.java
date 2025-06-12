package com.encuestas.controller;

import com.encuestas.dto.SurveyDTO;
import com.encuestas.service.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/surveys")
@CrossOrigin(origins = "*")
public class SurveyController {

    @Autowired
    private SurveyService surveyService;

    @GetMapping
    public ResponseEntity<List<SurveyDTO>> getAllSurveys(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(surveyService.getSurveysByUsername(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SurveyDTO> getSurveyById(@PathVariable Long id,
                                                   @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(surveyService.getSurveyByIdForUser(id, userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<SurveyDTO> createSurvey(@RequestBody SurveyDTO surveyDTO,
                                                  @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(201).body(surveyService.createSurvey(surveyDTO, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SurveyDTO> updateSurvey(@PathVariable Long id,
                                                  @RequestBody SurveyDTO surveyDTO,
                                                  @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(surveyService.updateSurvey(id, surveyDTO, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSurvey(@PathVariable Long id,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        surveyService.deleteSurvey(id, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
    
}
