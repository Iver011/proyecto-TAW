"use client"

import { MdTextFields } from "react-icons/md";
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "../FormElements"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import { BsFillCalendarDateFill } from "react-icons/bs";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
const type:ElementsType="DateField";
const extraAtributes= {
            label:"Fecha",
            helperText: "Escoge una fecha",
            required: false,
}
const propertiesSchema=z.object({
    label:z.string().min(2).max(50),
    helperText:z.string().max(200),
    required:z.boolean(),
})
export const DateFieldFormElement:FormElement= {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAtributes,
    }),
    designerBtnElement:{
        icon:BsFillCalendarDateFill,
        label: "Fecha"
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
        }

    });
    useEffect(()=>{
        form.reset(element.extraAtributes);
    },[element,form])

    function applyChanges(values:propertiesFormSchemaType){
        const {label,helperText,required}=values;
        updateElement(element.id,{
            ...element,
            extraAtributes:{
                label,
                helperText,
                required
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
        </form>
    </Form>)
}

function FormComponent({elementInstance,
    defaultValue,submitValue}:{
    elementInstance: FormElementInstance,
    defaultValue?:string
    submitValue?:SubmitFunction}) {
    const element=elementInstance as CustomInstance;
    const [date,setDate]=useState<Date|undefined>(defaultValue?new Date(defaultValue):undefined)
    const {label,required,placeholder,helperText}=element.extraAtributes
    return(
    <div className="text-white flex flex-col gap-2 w-full">
        <Label>
            {label}
            {required}
        </Label>
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                     {date ? date.toLocaleDateString() : (placeholder || "Selecciona una fecha")}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} 
                onSelect={(date)=>{
                    setDate(date);
                    if(!submitValue)return;
                    const value=date?.toUTCString()||""
                    submitValue(element.id,value)
                }}
                initialFocus
                />
                
            </PopoverContent>
        </Popover>
        {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
    </div>)
}

function DesignerComponent({elementInstance}:{elementInstance: FormElementInstance}) {
    const element=elementInstance as CustomInstance;
    const {label,required,helperText}=element.extraAtributes
    return(
    <div className="text-white flex flex-col gap-2 w-full">
        <Label>
            {label}
            {required}
        </Label>
        <Button variant={"outline"} className="w-full justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4"/>
            <span>Elige una Fecha</span>
        </Button>
        {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
    </div>)
}