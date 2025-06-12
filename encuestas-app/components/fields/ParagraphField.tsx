"use client"

import { MdTextFields } from "react-icons/md";
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
import { LuHeading1 } from "react-icons/lu";
import { BsTextParagraph } from "react-icons/bs";
import { Textarea } from "../ui/textarea";
const type:ElementsType="ParagraphField";
const extraAtributes= {
    label:"Ingresa un texto"
}
const propertiesSchema=z.object({
    label:z.string().min(2).max(500),
})
export const ParagraphFieldFormElement:FormElement= {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAtributes,
    }),
    designerBtnElement:{
        icon:BsTextParagraph,
        label: "Campo de Texto"
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
            label:element.extraAtributes.label??'',
        }

    });
    useEffect(()=>{
        form.reset(element.extraAtributes);
    },[element,form])

    function applyChanges(values:propertiesFormSchemaType){
        const {label}=values;
        updateElement(element.id,{
            ...element,
            extraAtributes:{
                label
            }
        })
    }
    return (<Form {...form}>
        <form onBlur={form.handleSubmit(applyChanges)} 
        onSubmit={(e)=>{
            e.preventDefault();
        }} className="space-y-3 flex flex-col">
            <FormField control={form.control} name="label" render={({field})=>(
                <FormItem>
                    <FormLabel>Texto</FormLabel>
                    <FormControl>
                        <Textarea rows={5}
                        {...field}
                        onKeyDown={e=>{
                            if(e.key==="Enter") e.currentTarget.blur();
                        }}/>
                    </FormControl>
                    <FormMessage></FormMessage>
                </FormItem>
            )}/>
        </form>
    </Form>)
}

function FormComponent({elementInstance}:{elementInstance: FormElementInstance}) {
    const element=elementInstance as CustomInstance;
    const {label}=element.extraAtributes

    return(
        <p className="bg-slate-500 rounded rounded-lg p-4">{label}</p>
    )
}

function DesignerComponent({elementInstance}:{elementInstance: FormElementInstance}) {
    const element=elementInstance as CustomInstance;
    const {label}=element.extraAtributes
    return(
    <div className="text-white flex flex-col gap-2 w-full">
        <Label className="text-muted-foreground">
            Ingresa un texto en el campo
        </Label>
        
            <p>{label}</p>
    </div>)
}