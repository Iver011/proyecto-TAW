package com.encuestas.model;

public enum QuestionType {
    TITULO("H1"),
    SUBTITULO("H2"),
    CAMPO_TEXTO("Campo de Texto")   ,
    SEPARADOR("Separador"),
    CAMPO_ESPACIADOR("Campo espaciador"),
    CUADRO_TEXTO("Cuadro de Texto"),
    CAMPO_NUMERICO("Campo Numérico"),
    AREA_TEXTO("Área de Texto"),
    FECHA("Fecha"),
    OPCION_MULTIPLE("Opción Múltiple"),
    SELECCION_UNICA("Selección Única"); 
    
    private final String displayName;
    
    QuestionType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}