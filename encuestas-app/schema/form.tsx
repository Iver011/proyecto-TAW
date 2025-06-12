import {z} from "zod";

export const formSchema = z.object({
    title: z.string().min(4),
    description:z.string(),
    createdAt:z.string(),
    updateAt:z.string(),
    active:z.boolean()
})
export type formSchemaType=z.infer<typeof formSchema>;


export const questionSchema = z.object({
  surveyId: z.number(),
  text: z.string(),
  questionType: z.enum([
    "TITULO",
    "SUBTITULO",
    "CAMPO_TEXTO",
    "SEPARADOR",
    "CAMPO_ESPACIADOR",
    "CUADRO_TEXTO",
    "CAMPO_NUMERICO",
    "AREA_TEXTO",
    "FECHA",
    "OPCION_MULTIPLE",
    "SELECCION_UNICA",
  ]),
  orderIndex: z.number(),
  required: z.boolean(),
  options: z
    .array(
      z.object({
        text: z.string(),
        orderIndex: z.number(),
      })
    )
    .optional(),
});

export type questionSchemaType = z.infer<typeof questionSchema>;
