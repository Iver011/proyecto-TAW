"use client"

import { IoMdCheckbox } from "react-icons/io";
import { ElementsType, FormElement, FormElementInstance } from "../FormElements"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "@/hooks/useDesigner";
import {Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
}from "../ui/form"
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { Separator } from "../ui/separator";
const type:ElementsType="CheckboxField";
const extraAtributes= {
            label:"Casillas",
            helperText: "Texto Auxiliar",
            required: false,
            options:[]
}
const propertiesSchema=z.object({
    label:z.string().min(2).max(50),
    helperText:z.string().max(200),
    required:z.boolean(),
    options:z.array(z.string()),
})
export const CheckboxFieldFormElement:FormElement= {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAtributes,
    }),
    designerBtnElement:{
        icon:IoMdCheckbox,
        label: "Casillas"
    },

    designerComponenet: DesignerComponent,
    formComponent:FormComponent,
    propertiesComponent:PropertiesComponent,
};

type CustomInstance=FormElementInstance&{
    extraAtributes: typeof extraAtributes;
}
type propertiesFormSchemaType=z.infer<typeof propertiesSchema>;
function PropertiesComponent({elementInstance}:{elementInstance:FormElementInstance}){
    const element=elementInstance as CustomInstance;
    const {updateElement}=useDesigner();
    const form=useForm<propertiesFormSchemaType>({
        resolver:zodResolver(propertiesSchema),
        mode:"onBlur",
        defaultValues:{
            label:element.extraAtributes.label,
            helperText:element.extraAtributes.helperText,
            required:element.extraAtributes.required,
            options:element.extraAtributes.options
        }

    });
    useEffect(()=>{
        form.reset(element.extraAtributes);
    },[element,form])

    function applyChanges(values:propertiesFormSchemaType){
        const {label,helperText,required,options}=values;
        updateElement(element.id,{
            ...element,
            extraAtributes:{
                label,
                helperText,
                required,
                options
            }
        })
    }
    return (<Form {...form}>
        <form onBlur={form.handleSubmit(applyChanges)} 
        onSubmit={(e)=>{
            e.preventDefault();
        }} className="space-y-3">
            <FormField control={form.control} name="label" render={({field})=>(
                <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                        <Input {...field}
                        onKeyDown={e=>{
                            if(e.key==="Enter") e.currentTarget.blur();
                        }}></Input>
                    </FormControl>
                    <FormDescription>
                        La etiqueta del campo <br/>
                        Se mostrara encima del campo.
                    </FormDescription>
                    <FormMessage></FormMessage>
                </FormItem>
            )}/>
           
            <FormField control={form.control} name="helperText" render={({field})=>(
                <FormItem>
                    <FormLabel>Texto de Apoyo</FormLabel>
                    <FormControl>
                        <Input {...field}
                        onKeyDown={e=>{
                            if(e.key==="Enter") e.currentTarget.blur();
                        }}></Input>
                    </FormControl>
                    <FormDescription>
                        Texto de apoyo del campo. <br/>
                        Se mostrara debajo del campo.
                    </FormDescription>
                    <FormMessage></FormMessage>
                </FormItem>
            )}/>
            <FormField control={form.control} name="required" render={({field})=>(
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                    <FormLabel>Requerido</FormLabel>
                    <FormDescription>
                        El campo se requerido:
                    </FormDescription>
                    </div>
                    <FormControl>
                        <Switch checked={field.value}
                        onCheckedChange={field.onChange}></Switch>
                    </FormControl>
                    <FormMessage></FormMessage>
                </FormItem>
            )}/>
            <FormField control={form.control} name="options" render={({field})=>(
                <FormItem>
                    <div className="flex justify-between items-center">
                    <FormLabel>Varias Opciones</FormLabel>
                    <Button variant={"outline"} className="gap-2"
                    onClick={(e)=>{
                        e.preventDefault();
                        form.setValue("options",field.value.concat("Agregar Casilla"))
                    }}>
                        <AiOutlinePlus></AiOutlinePlus>
                        Agregar
                    </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {
                            form.watch("options").map((option,index)=>(
                                <div key={index} className="flex items-center justify-between gap-1">
                                    <Input placeholder="" value={option} 
                                    onChange={(e)=>{
                                        field.value[index]=e.target.value;
                                        field.onChange(field.value)
                                        
                                    }}
                                    />
                                <Button variant={"ghost"} size={"icon"} onClick={e=>{
                                    e.preventDefault();
                                    const newOptions=[...field.value]
                                    newOptions.splice(index,1) 
                                    field.onChange(newOptions)
                                }}>
                                    <AiOutlineClose></AiOutlineClose>
                                </Button>
                                </div>
                            ))
                        }
                    </div>
                    <FormMessage></FormMessage>
                </FormItem>
            )}/>
            <Separator/>
            
                        <Button className="w-full" type="submit">Guardar</Button>
        </form>
    </Form>)
}

function FormComponent({elementInstance}:{elementInstance: FormElementInstance}) {
    const element=elementInstance as CustomInstance;
    const {label,required,helperText,options}=element.extraAtributes
        const id =`checkbox-${element.id}`

    return(
    <div className="flex items-top space-x-2">
        <div className="grid gap-1.5 leading-none">
        <Label htmlFor={id}>
            {label}
            {required}
        </Label>
        {options.map((option,index)=>(
            
       <div className="flex items-center space-x-2" key={index}>
  <Checkbox id={`${id}-${index}`} />
  <Label htmlFor={`${id}-${index}`}>{option}</Label>
</div>

        ))}
        {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
        </div>
    </div>)
}
function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { label, required, helperText, options } = element.extraAtributes;
  const id = `checkbox-${element.id}`;

  return (
    <div className="text-white flex flex-col gap-2 w-full">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </Label>

      {options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Checkbox id={`${id}-${index}`} disabled />
          <Label htmlFor={`${id}-${index}`}>{option}</Label>
        </div>
      ))}

      {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
    </div>
  );
}
