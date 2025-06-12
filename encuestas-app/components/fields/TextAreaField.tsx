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
import { BsTextareaResize } from "react-icons/bs";
import { Textarea } from "../ui/textarea";
import { Slider } from "../ui/slider";
const type:ElementsType="TextAreaField";
const extraAtributes= {
            label:"Area de Texto",
            helperText: "Texto Auxiliar",
            required: false,
            placeholder: "Valor del texto",
            rows:3,
}
const propertiesSchema=z.object({
    label:z.string().min(2).max(50),
    helperText:z.string().max(200),
    required:z.boolean(),
    placeholder:z.string().max(50),
    rows:z.number().min(1).max(10)
})
export const TextAreaFieldFormElement:FormElement= {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAtributes,
    }),
    designerBtnElement:{
        icon:BsTextareaResize,
        label: "Area de Texto"
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
            placeholder:element.extraAtributes.placeholder,
            rows:element.extraAtributes.rows,
        }

    });
    useEffect(()=>{
        form.reset(element.extraAtributes);
    },[element,form])

    function applyChanges(values:propertiesFormSchemaType){
        const {label,helperText,placeholder,required,rows}=values;
        updateElement(element.id,{
            ...element,
            extraAtributes:{
                label,
                helperText,
                placeholder,
                required,
                rows,
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
             <FormField control={form.control} name="rows" render={({field})=>(
                <FormItem>
                    
                    <FormLabel>Filas: {form.watch("rows")}</FormLabel>


                    <FormControl>
                        <Slider defaultValue={[field.value]} min={1} max={10} step={1} 
                        onValueChange={(value)=>{
                            field.onChange(value[0])
                        }}></Slider>
                    </FormControl>
                    <FormMessage></FormMessage>
                </FormItem>
            )}/>
        </form>
    </Form>)
}

function FormComponent({elementInstance}:{elementInstance: FormElementInstance}) {
    const element=elementInstance as CustomInstance;
    const {label,required,placeholder,helperText,rows}=element.extraAtributes
    return(
    <div className="text-white flex flex-col gap-2 w-full">
        <Label >
            {label}
            {required && "*"}
        </Label>
        <Textarea placeholder={placeholder}></Textarea>
        {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
    </div>)
}

function DesignerComponent({elementInstance}:{elementInstance: FormElementInstance}) {
    const element=elementInstance as CustomInstance;
    const {label,required,placeholder,helperText,rows}=element.extraAtributes
    return(
    <div className="text-white flex flex-col gap-2 w-full">
        <Label>
            {label}
            {required}
        </Label>
        <Textarea readOnly disabled placeholder={placeholder}></Textarea>
        {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
    </div>)
}