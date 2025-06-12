import { formSchema, formSchemaType, questionSchema, questionSchemaType } from "@/schema/form";
import { Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";

interface AnswerDTO {
  id: number | null;
  questionId: number;
  surveyResponseId: number | null;
  textAnswer: string | null;
  numericAnswer: number | null;
  dateAnswer: string | null;
  selectedOptionId: number | null;
}

interface SurveyResponseDTO {
  id: number | null;
  surveyId: number;
  respondentEmail: string;
  submittedAt: string | null;
  answers: AnswerDTO[];
}
export async function CreateForm(data:formSchemaType):Promise<String> {
    const session=await getSession()
    const token=session?.user?.token;
    const validation=formSchema.safeParse(data);
    if (!validation.success){
        throw new Error("Datos invalidos")
    }
    console.log(data)
    const res=await fetch("http://localhost:8080/api/surveys",{
        method:"POST",
        headers:{
          "Authorization":`Bearer ${token}`,
            "Content-Type":"application/json",
            
        },
        body:JSON.stringify(data)
    })
    if (!res.ok){
        const errorBody=await res.text();
        throw new Error(`Error del servidor: ${res.status} - ${errorBody}`);
    }
    const responseData=await res.json()
    return responseData.id;
}

/*export async function CreateQuestion(data:questionSchemaType){
    const validation = questionSchema.safeParse(data);
    if(!validation.success){
        throw new Error("Datos Invalidos")
    }
    const res=await fetch("http://localhost:8080/api/questions",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    });
    if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Error del servidor: ${res.status} - ${errorBody}`);
  }

  const responseData = await res.json();
  return responseData.id;
}*/
type QuestionOptionDTO = {
  id?: number;
  questionId?: number;
  text: string;
  orderIndex: number;
};

type QuestionDTO = {
  id?: number;
  surveyId: number;
  text: string;
  questionType: string;
  orderIndex: number;
  required: boolean;
  options?: QuestionOptionDTO[];
};

export async function syncQuestions(surveyId: number, elements: any[]) {
    const session=await getSession()
    const token=session?.user?.token;  
    const mappedQuestions: QuestionDTO[] = elements
    .filter((el) => ![ ""].includes(el.type))
    .map((el, i) => {
      const question: QuestionDTO = {
        id: el.id ? parseInt(el.id) : undefined,
        surveyId,
        text: el.extraAtributes?.label || "Pregunta sin texto",
        questionType: mapTypeToBackend(el.type),
        orderIndex: i,
        required: el.extraAtributes?.required || false,
        options: ["SelectField", "CheckboxField"].includes(el.type)
          ? el.extraAtributes?.options?.map((opt: string, idx: number) => ({
              text: opt,
              orderIndex: idx
            })) || []
          : []
      };
      return question;
    });
    console.log(JSON.stringify(mappedQuestions))
    console.log(surveyId,token=='eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJpbnRlbnRvMSIsImlhdCI6MTc0OTI1NjM0NiwiZXhwIjoxNzQ5MzQyNzQ2fQ.1prQSkLGwgnqIlaR45qCq3xLcO5oQC-gA_elZ0-NsMh9zZUa-O4N3_wg3_pg2p_ojfR8--x0uVlpT-wMGc9mcQ')
  const res = await fetch(`http://localhost:8080/api/questions/sync/${surveyId}`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization":`Bearer ${token}` },
    body: JSON.stringify(mappedQuestions)
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Error sincronizando preguntas: ${res.status} - ${error}`);
  }

  return await res.json();
}

function mapTypeToBackend(type: string): string {
  switch (type) {
    case "TextField": return "CAMPO_TEXTO";
    case "NumberField": return "CAMPO_NUMERICO";
    case "TextAreaField": return "AREA_TEXTO";
    case "DateField": return "FECHA";
    case "SelectField": return "SELECCION_UNICA";
    case "CheckboxField": return "OPCION_MULTIPLE";
    case "TitleField" : return "TITULO"
    case "SeparatorField":return "SEPARADOR"
    case "SubTitleField":return "SUBTITULO"
    case "ParagraphField":return "CUADRO_TEXTO"
    case "SpacerField" :return "CAMPO_ESPACIADOR"
    default: return "CAMPO_TEXTO";
  }
}

export type FormDTO={
  id: string;
  active: boolean;
  title: string;
  description?: string;
  totalResponses: number;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}
export async function GetForms(token:string):Promise<FormDTO[]>{
  
  console.log(token)
  if(!token){
    console.warn("No hay token disponible para obtener formularios.");
    return [];
  }
  const res=await fetch("http://localhost:8080/api/surveys",{
    method:"GET",
    headers:{
      "Authorization":`Bearer ${token}`,
      "Content-Type":"application/json"
    }
  });
  if(res.status==401){
    throw new Error("Token Invalido o expirado")
  }
  if(!res.ok){
    throw new Error("Error al obtener encuestas")
  }
  const data =await res.json()
  return data as FormDTO[];
}

export async function GetSurvey(id:number,token:string|undefined):Promise<FormDTO>{
  const survey=await fetch(`http://localhost:8080/api/surveys/${id}`,{
    method:"GET",
    headers:{
      "Authorization":`Bearer ${token}`,
      "Content-Type":"application/json"
    }
  }
  )
  const surveyData=survey.json()
  return surveyData
}

export async function DeleteForm(id:number,token:string){
      if(!token){
        throw new Error("Token no disponible")
      }
    
      const res=await fetch(`http://localhost:8080/api/surveys/${id}`,{
        method:"DELETE",
        headers:{
                  "Authorization":`Bearer ${token}`,
                  "Content-Type":"application/json"
        }
      })
      if(!res.ok){
       const errorBody=await res.text();
        throw new Error(`Error del servidor: ${res.status} - ${errorBody}`);
      }
      const data={"Respuesta":"Formulario eliminado correctamente"}

      return data;
} 

export async function PublishForm(id:number){
      const session=await getSession()


  try{
    console.log(id)
    const ob=await fetch(`http://localhost:8080/api/surveys/${id}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${session?.user?.token}`,
        "Content-Type":"application/json"
      },})
    const currentSurvey=await ob.json();
    console.log(currentSurvey)
    const res=await fetch(`http://localhost:8080/api/surveys/${id}`,{
      method:"PUT",
      headers:{
        "Authorization":`Bearer ${session?.user?.token}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        title:currentSurvey.title,
        description:currentSurvey.description,
        active:true

      })
    });
    if (!res.ok){
      throw new Error("Error al publicar encuesta")
    }
    return await res.json()
  }
  catch(error){
    console.error("Error al publicar encuest:",error)
    throw error;
  }
}

export async function GetFormContentByUrl(idSurvey:number){
    const session=await getSession();
    try{
      const res=await fetch(`http://localhost:8080/api/questions/survey/${idSurvey}`,{
        method:"GET",
        headers:{
          'Authorization':`Bearer ${session?.user?.token}`,
          "Content-Type":"application/json"
        }
      })
      if(!res.ok){
        throw new Error("Error al obtener datos de la encuesta")
      }
      const data=await res.json()
      return data
    }
    catch(error){
      console.error("Error en la solicitud",error)
    }
  
}

export async function SubmitForm(surveyId: number, jsonContent: string, questionsData: any[]) {
  try {
    // Parse the form values from the JSON string
    const formValues = JSON.parse(jsonContent);
    
    // Create a map of questions by ID for easy lookup
    const questionsMap = new Map();
    questionsData.forEach(q => {
      questionsMap.set(q.id.toString(), q);
    });
    
    // Transform form values to answers array with proper types
    const answers = Object.entries(formValues).map(([questionId, value]) => {
      const question = questionsMap.get(questionId);
      if (!question) return null;
      
      const answer: any = {
        questionId: parseInt(questionId)
      };
      
      // Determine the answer type based on question type
      switch (question.questionType) {
        case "CAMPO_TEXTO":
        case "AREA_TEXTO":
          answer.textAnswer=value as string;
        case "CAMPO_NUMERICO":
          answer.numericAnswer = parseFloat(value as string);
          break;
              
        case "FECHA":
          // Convert date string to proper format (YYYY-MM-DD)
          const dateValue = new Date(value as string);
          answer.dateAnswer = dateValue.toISOString().split('T')[0];
          break;
          
        case "SELECCION_UNICA":
          // Find the option ID based on the selected text
          const selectedOption = question.options?.find((opt: any) => opt.text === value);
          if (selectedOption) {
            answer.selectedOptionId = selectedOption.id;
          }
          break;
          
        case "OPCION_MULTIPLE":
          // For multiple options, we might need to handle this differently
          // This depends on how your form component handles multiple selections
          answer.textAnswer = value as string;
          break;
          
        default:
          // For text fields, text areas, etc.
          answer.textAnswer = value as string;
          break;
      }
      
      return answer;
    }).filter(answer => {
      // Filter out null answers and empty values
      if (!answer) return false;
      
      // Check if any answer field has a value
      return answer.textAnswer || 
             answer.numericAnswer !== undefined || 
             answer.dateAnswer || 
             answer.selectedOptionId;
    });
    
    // Prepare the request body
    const requestBody = {
      surveyId: surveyId,
      respondentEmail: "anonymous@example.com", // Email por defecto como solicitaste
      answers: answers
    };
    
    console.log("Sending request body:", requestBody);
    
    // Send the request to the backend
    const response = await fetch('http://localhost:8080/api/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const result = await response.json();
    console.log("Response received:", result);
    return result;
    
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
}

export async function getStadistics(id:number,token:string|undefined){
  
  try{
    const res=await fetch(`http://localhost:8080/api/responses/survey/${id}`,{
      method:'GET',
      headers:{
          "Authorization":`Bearer ${token}`,
          "Content-Type":"application/json"
      }
    })
    const data=await res.json()
      return data
    }
    catch(error){
      console.error("Error en la solicitud",error)
    }
}

export async function getQuestions(surveyId:number,token:string|undefined) {
  const session=await getSession()
  try{
      const res=await fetch(`http://localhost:8080/api/questions/survey/${surveyId}`,{
        method:'GET',
        headers:{
          "Authorization":`Bearer ${session?.user?.token}`,
          "Content-Type":"application/json"
        }
      });
      const data=await res.json()
      return data
  }catch(error){
    console.error("Error obteniendo preguntas",error)
  }
  
}

export async function getQuestion(questionId:number,token:string|undefined) {
  
  try {
    const res = await fetch(`http://localhost:8080/api/questions/${questionId}`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error obteniendo pregunta", error);
    throw error;
  }
}
