// app/submit/[id]/page.tsx
"use client"

import { GetFormContentByUrl } from "@/actions/forms";
import { FormElementInstance } from "@/components/FormElements";
import FormSubmitComponent from "@/components/FormSubmitComponent";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SubmitPage() {
  const params = useParams();
  const [surveyContent, setSurveyContent] = useState<FormElementInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSurvey() {
      try {
        const id = Number(params.id);
        const content = await GetFormContentByUrl(id);
        
        if (!content) {
          throw new Error("Encuesta no encontrada");
        }
        
        // Asumo que 'content' ya es el array de FormElementInstance
        // Si viene como string JSON, usa: JSON.parse(content.content)
        setSurveyContent(content);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    loadSurvey();
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando encuesta...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <FormSubmitComponent 
      idSurvey={Number(params.id)} 
      content={surveyContent}
      
      
    />
  );
}