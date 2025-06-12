"use client"

import { MdLinearScale } from "react-icons/md";
import { ElementsType, FormElement, FormElementInstance } from "../FormElements";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "@/hooks/useDesigner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const type: ElementsType = "LinearScaleField";

const extraAtributes = {
  min: 1,
  max: 5,
  leftLabel: "Malo",
  rightLabel: "Excelente"
};

const propertiesSchema = z.object({
  min: z.number().min(1).max(10),
  max: z.number().min(2).max(10),
  leftLabel: z.string().max(50),
  rightLabel: z.string().max(50),
}).refine(data => data.max > data.min, {
  message: "El valor máximo debe ser mayor que el mínimo",
  path: ["max"]
});

export const LinearScaleFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAtributes
  }),
  designerBtnElement: {
    icon: MdLinearScale,
    label: "Escala Lineal"
  },
  designerComponenet: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};

type CustomInstance = FormElementInstance & {
  extraAtributes: typeof extraAtributes;
};

type PropertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const form = useForm<PropertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: element.extraAtributes
  });

  useEffect(() => {
    form.reset(element.extraAtributes);
  }, [element, form]);

  function applyChanges(values: PropertiesFormSchemaType) {
    updateElement(element.id, {
      ...element,
      extraAtributes: values
    });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => e.preventDefault()}
        className="space-y-3"
      >
        <FormField control={form.control} name="min" render={({ field }) => (
          <FormItem>
            <FormLabel>Valor mínimo</FormLabel>
            <FormControl><Input type="number" {...field} /></FormControl>
            <FormDescription>Valor inicial de la escala</FormDescription>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="max" render={({ field }) => (
          <FormItem>
            <FormLabel>Valor máximo</FormLabel>
            <FormControl><Input type="number" {...field} /></FormControl>
            <FormDescription>Valor final de la escala</FormDescription>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="leftLabel" render={({ field }) => (
          <FormItem>
            <FormLabel>Etiqueta izquierda</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormDescription>Descripción del valor mínimo</FormDescription>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="rightLabel" render={({ field }) => (
          <FormItem>
            <FormLabel>Etiqueta derecha</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormDescription>Descripción del valor máximo</FormDescription>
            <FormMessage />
          </FormItem>
        )} />
      </form>
    </Form>
  );
}
function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { min, max, leftLabel, rightLabel } = element.extraAtributes;

  return (
    <div className="text-white flex flex-col gap-2 w-full">
      <Label>Escala del {min} al {max}</Label>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      <RadioGroup className="flex justify-between" defaultValue={min.toString()}>
        {Array.from({ length: max - min + 1 }, (_, i) => {
          const val = (min + i).toString();
          return (
            <div key={val} className="flex flex-col items-center space-y-1">
              <RadioGroupItem value={val} />
              <span className="text-xs">{val}</span>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { min, max, leftLabel, rightLabel } = element.extraAtributes;

  return (
    <div className="text-white flex flex-col gap-2 w-full opacity-75">
      <Label>Escala del {min} al {max}</Label>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      <div className="flex justify-between">
        {Array.from({ length: max - min + 1 }, (_, i) => (
          <div key={i} className="flex flex-col items-center">
            <input type="radio" disabled className="w-4 h-4" />
            <span className="text-xs">{min + i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
