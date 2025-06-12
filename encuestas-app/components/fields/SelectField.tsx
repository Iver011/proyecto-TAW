"use client"

import { RxDropdownMenu } from "react-icons/rx";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";
const type:ElementsType="SelectField";
const extraAtributes= {
            label:"Varias Opciones",
            helperText: "Texto Auxiliar",
            required: false,
            placeholder: "Valor del texto",
            options:[]
}
const propertiesSchema=z.object({
    label:z.string().min(2).max(50),
    helperText:z.string().max(200),
    required:z.boolean(),
    placeholder:z.string().max(50),
    options:z.array(z.string()),
})
export const SelectFieldFormElement:FormElement= {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAtributes,
    }),
    designerBtnElement:{
        icon:RxDropdownMenu,
        label: "Varias opciones"
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
    const {updateElement,setSelectedElement}=useDesigner();
    const form=useForm<propertiesFormSchemaType>({
        resolver:zodResolver(propertiesSchema),
        mode:"onSubmit",
        defaultValues:{
            label:element.extraAtributes.label,
            helperText:element.extraAtributes.helperText,
            required:element.extraAtributes.required,
            placeholder:element.extraAtributes.placeholder,
            options:element.extraAtributes.options,
        }

    });
    useEffect(()=>{
        form.reset(element.extraAtributes);
    },[element,form])

    function applyChanges(values:propertiesFormSchemaType){
        const {label,helperText,placeholder,required,options}=values;
        updateElement(element.id,{
            ...element,
            extraAtributes:{
                label,
                helperText,
                placeholder,
                required,
                options
            }
        })
        toast("Completado",{
            description:"Opciones guardades correctamente"
        })
        setSelectedElement(null)
    }
    return (<Form {...form}>
        <form onSubmit={form.handleSubmit(applyChanges)} 
         className="space-y-3">
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
            <FormField control={form.control} name="placeholder" render={({field})=>(
                <FormItem>
                    <FormLabel>Marcador</FormLabel>
                    <FormControl>
                        <Input {...field}
                        onKeyDown={e=>{
                            if(e.key==="Enter") e.currentTarget.blur();
                        }}></Input>
                    </FormControl>
                    <FormDescription>
                        El marcador del campo.
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
            <Separator></Separator>
            <FormField control={form.control} name="options" render={({field})=>(
                <FormItem>
                    <div className="flex justify-between items-center">
                    <FormLabel>Varias Opciones</FormLabel>
                    <Button variant={"outline"} className="gap-2"
                    onClick={(e)=>{
                        e.preventDefault();
                        form.setValue("options",field.value.concat("Nueva Opcion"))
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

function FormComponent({elementInstance,submitValue}:{
    elementInstance: FormElementInstance
    submitValue?:SubmitFunction
}) {
    const [value,setValue]=useState("")
    const element=elementInstance as CustomInstance;
    const {label,required,placeholder,helperText,options}=element.extraAtributes
    return(
    <div className="text-white flex flex-col gap-2 w-full">
        <Label>
            {label}
            {required}
        </Label>
        <Select onValueChange={value=>{
            setValue(value);
            if(!submitValue)return;
            submitValue(element.id,value)
        }}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder}></SelectValue>
            </SelectTrigger>
            <SelectContent>
                {options.map((option,index)=>(
                    <SelectItem key={index} value={option}>
                        {option}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
    </div>)
}

function DesignerComponent({elementInstance}:{elementInstance: FormElementInstance}) {
    const element=elementInstance as CustomInstance;
    const {label,required,placeholder,helperText}=element.extraAtributes
    return(
    <div className="text-white flex flex-col gap-2 w-full">
        <Label>
            {label}
            {required}
        </Label>
        <Select>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder}></SelectValue>
            </SelectTrigger>
        </Select>
        {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
    </div>)
}