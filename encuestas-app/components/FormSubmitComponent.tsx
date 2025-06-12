"use client"

import React, { useCallback, useRef, useState, useTransition } from "react"
import { ElementsType, FormElementInstance, FormElements } from "./FormElements"
import { Button } from "./ui/button";
import { HiCursorClick } from "react-icons/hi"; 
import { toast } from "sonner";
import { ImSpinner2 } from "react-icons/im";
import { SubmitForm } from "@/actions/forms";

function FormSubmitComponent({
    idSurvey,
    content
}: {
    content: FormElementInstance[];
    idSurvey: number
}) {
    const formValues = useRef<{ [key: string]: string }>({});
    const questionsData = useRef<{ [key: string]: any }>({});
    const [renderKey, setRenderKey] = useState(new Date().getTime())
    const [submitted, setSubmitted] = useState(false)
    const [pending, startTransition] = useTransition();

    const elements = mapQuestionsToElements(content)

    const submitValue = useCallback((key: string, value: string) => {
        formValues.current[key] = value
    }, [])
    

    const submitForm = async () => {
        try {
            const JsonContent = JSON.stringify(formValues.current)
            await SubmitForm(idSurvey, JsonContent, content)
            setSubmitted(true)
        } catch (error) {
            toast.error("Error", {
                description: "Algo malo está sucediendo"
            })
        }
        
        console.log("FORM VALUES", formValues.current)
    };

    if (submitted) {
        return (
            <div className="relative z-10 flex justify-center w-full h-full items-center p-8">
                <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background
                w-full p-8 overflow-y-auto dark:border-shadow-xl dark:shadow-blue-700 rounded">
                    <h1 className="text-2xl font-bold">Respuesta Enviada</h1>
                    <p className="text-muted-foreground">
                        Gracias por contestar las preguntas de la encuesta.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative z-10 flex shadow-xl shadow-blu-700 justify-center w-full h-full items-center">
            <div key={renderKey} className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background
            w-full p-8 overflow-y-auto border rounded">
                {
                    elements.map((element) => {
                        const FormElement = FormElements[element.type].formComponent;
                        return <FormElement 
                            key={element.id}
                            elementInstance={element}
                            submitValue={submitValue}
                            
                        />
                    })
                }
                <Button 
                    className="mt-8" 
                    onClick={() => {
                        startTransition(submitForm)
                    }}
                    disabled={pending}
                >
                    {!pending && (
                        <>
                            <HiCursorClick className="mr-2" />
                            Enviar Respuesta
                        </>
                    )}
                    {pending && <ImSpinner2 className="animate-spin" />}
                </Button>
            </div>
        </div>
    )
}

export default FormSubmitComponent;

function mapBackendTypeToFrontend(type: string): ElementsType {
    switch (type) {
        case "CAMPO_TEXTO": return "TextField";
        case "CAMPO_NUMERICO": return "NumberField";
        case "AREA_TEXTO": return "TextAreaField";
        case "FECHA": return "DateField";
        case "SELECCION_UNICA": return "SelectField";
        case "OPCION_MULTIPLE": return "CheckboxField";
        case "TITULO": return "TitleField";
        case "SEPARADOR": return "SeparatorField";
        case "SUBTITULO": return "SubTitleField";
        case "CUADRO_TEXTO": return "ParagraphField";
        case "CAMPO_ESPACIADOR": return "SpacerField";
        default:
            return "TextField";
    }
}

function mapQuestionsToElements(questions: any[]): FormElementInstance[] {
    return questions.map((q) => {
        const type = mapBackendTypeToFrontend(q.questionType);
        const extraAtributes: any = {};

        if (type === "TitleField") {
            extraAtributes.label = q.text ?? "Título";
        } else {
            extraAtributes.label = q.text ?? '';
            extraAtributes.required = q.required ?? false;
            extraAtributes.options = q.options?.map((opt: any) => opt.text) || [];
            extraAtributes.optionsWithIds = q.options || []; // Guardamos las opciones con sus IDs
        }

        const base: FormElementInstance = {
            id: q.id.toString(),
            type,
            extraAtributes,
        };

        return base;
    });
}
