'use client'

import React, { useEffect, useState } from 'react';
import PreviewDialogBtn from './PreviewDialogBtn';
import SaveFormBtn from './SaveFormBtn';
import PublishFormBtn from './PublishFormBtn';
import Designer from './Designer';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import DragOverlayWrapper from './DragOverlayWrapper';
import useDesigner from '@/hooks/useDesigner';
import { ImSpinner2 } from 'react-icons/im';
import { ElementsType, FormElementInstance } from './FormElements';
import SignOutButton from './SignOutButton';
import { useSession } from 'next-auth/react';
import { FormDTO, GetSurvey } from '@/actions/forms';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import Confetti from "react-confetti"
import { FaArrowLeft } from 'react-icons/fa6';

function FormBuilder({ surveyId, title = 'Encuesta sin título' }: FormBuilderProps) {
  const { setElements } = useDesigner();
  const [isReady, setIsReady] = useState(false);
  const {data:session,status}=useSession()
  const [survey,setSurvey]=useState<FormDTO|null>(null)
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 300, tolerance: 5 },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch(`http://localhost:8080/api/questions/survey/${surveyId}`,{
          headers:{
              Authorization: `Bearer ${session?.user?.token}`

          }
        });
        const data = await res.json();
        const elements = mapQuestionsToElements(data);
        setElements(elements);

        const surveyData = await GetSurvey(surveyId, session?.user?.token);
        setSurvey(surveyData);
        console.log(surveyData)
        setIsReady(true);
      } catch (err) {
        console.error("Error cargando preguntas:", err);
      }
    }
    
    fetchQuestions();
  }, [surveyId, setElements]);

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <ImSpinner2 className="animate-spin h-12 w-12" />
      </div>
    );
  }
  const shareURL=`${window.location.origin}/submit/${survey?.id}`
  if(survey?.active){
    return(
      <div className='flex items-center justify-center w-full'>
      <Confetti width={window.innerWidth} height={window.innerHeight} 
      recycle={false}
      numberOfPieces={500}></Confetti>
      <div className='flex flex-col items-center justify-between h-1/2 w-1/2'>
        <h1 className='text-center text-4xl font-primary border-b pb-2 mb-10'>
          🎉🎉🎉 Encuesta Publicada!!!!🎉🎉🎉
        </h1>
        <h2 className='text-2xl text-muted-foreground border-b pb-10'>
          Cualquiera con el Link puede ver y responder la encuesta
        </h2>
        <div className='my-4 flex flex-col gap-2 items-center w-full border-b pb-4'>
          <Input className='w-full' readOnly value={shareURL}></Input>
          <Button className='mt-2 w-full' onClick={()=>{
            navigator.clipboard.writeText(shareURL);
            toast.info("Copiado",{
              description:"Link copiado en portapapeles"
            }
              
            )
          }}>Copiar Link</Button>
        </div>
        <div className='flex justify-between w-full'>
          <Button variant={"link"} asChild>
            <Link href={"/dashboard"} className='gap-2'>
              <BsArrowLeft></BsArrowLeft>
              Volver
            </Link>
          </Button>
           <Button variant={"link"} asChild>
            <Link href={`/dashboard/stadistic/${survey.id}`} className='gap-2'>
              
              Detalles de la encuesta
              <BsArrowRight></BsArrowRight>
            </Link>
          </Button>
        </div>
      </div>
      </div>
    )
  }
  

  return (
    <DndContext sensors={sensors}>
      <main className="flex flex-col w-full">
        <nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
          <Link href={"/dashboard"}> <Button variant={"outline"} className='gap-2 hover:cursor-pointer'>
                  <FaArrowLeft className='h-6 w-6'></FaArrowLeft>Atras</Button>
                  </Link>
          <div className="flex items-center gap-2">
            
            <SignOutButton></SignOutButton>
            <PreviewDialogBtn />
            <SaveFormBtn id={surveyId}/>
            <PublishFormBtn id={surveyId}/>
          </div>
        </nav>
        <div className="flex w-full flex-grow items-center justify-center relative overflow-y-auto h-[200px] bg-accent bg-[url(/jigsaw.svg)] dark:bg-[url(/jigsaw-dark.svg)]">
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  );
}

export default FormBuilder;

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
    }
    const base: FormElementInstance = {
      id: q.id.toString(),
      type,
      extraAtributes,
    };
    return base;
  });
}


function mapBackendTypeToFrontend(type: string): ElementsType {
  switch (type) {
    case "CAMPO_TEXTO": return "TextField";
    case "CAMPO_NUMERICO": return "NumberField";
    case "AREA_TEXTO": return "TextAreaField";
    case "FECHA": return "DateField";
    case "SELECCION_UNICA": return "SelectField";
    case "OPCION_MULTIPLE": return "CheckboxField";
    case "TITULO" :return "TitleField";
    case "SEPARADOR":return "SeparatorField"
    case "SUBTITULO":return "SubTitleField"
    case "CUADRO_TEXTO":return "ParagraphField"
    case "CAMPO_ESPACIADOR":return "SpacerField"
    default: return "TextField";
  }
}
type FormBuilderProps = {
  surveyId: number;
  title?: string;
};
