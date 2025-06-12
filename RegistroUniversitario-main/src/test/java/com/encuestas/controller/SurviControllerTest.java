package com.encuestas.controller;

import com.encuestas.dto.SurveyDTO;
import com.encuestas.service.SurveyService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@WebMvcTest(SurveyController.class)
@WithMockUser // Simula usuario autenticado para todos los tests
class SurviControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SurveyService surveyService;

    @Test
    void getAllSurveysReturnsOk() throws Exception {
        Mockito.when(surveyService.getSurveysByUsername(anyString()))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/surveys")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void getSurveyByIdReturnsOk() throws Exception {
        SurveyDTO dto = new SurveyDTO();
        dto.setId(1L);
        Mockito.when(surveyService.getSurveyByIdForUser(eq(1L), anyString())).thenReturn(dto);

        mockMvc.perform(get("/api/surveys/1")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void createSurveyReturnsCreated() throws Exception {
        SurveyDTO dto = new SurveyDTO();
        dto.setId(1L);
        Mockito.when(surveyService.createSurvey(any(SurveyDTO.class), anyString())).thenReturn(dto);

        mockMvc.perform(post("/api/surveys")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Encuesta Test\"}"))
                .andExpect(status().isCreated());
    }

    @Test
    void updateSurveyReturnsOk() throws Exception {
        SurveyDTO dto = new SurveyDTO();
        dto.setId(1L);
        Mockito.when(surveyService.updateSurvey(eq(1L), any(SurveyDTO.class), anyString())).thenReturn(dto);

        mockMvc.perform(put("/api/surveys/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"id\":1,\"name\":\"Actualizada\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void deleteSurveyReturnsOk() throws Exception {
        mockMvc.perform(delete("/api/surveys/1")
                .with(csrf()))
                .andExpect(status().isOk());
    }
}