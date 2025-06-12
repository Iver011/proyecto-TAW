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
import { LuHeading1, LuSeparatorHorizontal } from "react-icons/lu";
import { Slider } from "../ui/slider";
const type:ElementsType="SpacerField";
const extraAtributes= {
    label:20,
}
const propertiesSchema=z.object({
    label:z.number().min(5).max(200),
})
export const SpacerFieldFormElement:FormElement= {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAtributes,
    }),
    designerBtnElement:{
        icon:LuSeparatorHorizontal,
        label: "Campo espaciador"
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
                    <FormLabel>Altura (px):{form.watch("label")}</FormLabel>
                    <FormControl className="pt-2">
                        <Slider defaultValue={[field.value]}
                        min={5}
                        max={200}
                        step={1}
                        onValueChange={(value)=>{
                            field.onChange(value[0]);
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
    const {label}=element.extraAtributes

    return(
        <div style={{height:`${label}px`,width:"100%"}}></div>
    )
}

function DesignerComponent({elementInstance}:{elementInstance: FormElementInstance}) {
    const element=elementInstance as CustomInstance;
    const {label}=element.extraAtributes
    return(
    <div className="text-white flex flex-col gap-2 w-full items-center">
        <Label className="text-muted-foreground">
            Campo espaciador: {label} px
        </Label>
        <LuSeparatorHorizontal className="h-8 w-8"></LuSeparatorHorizontal>
    </div>)
}