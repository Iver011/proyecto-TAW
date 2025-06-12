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
import { RiSeparator } from "react-icons/ri";
import { Separator } from "../ui/separator";
const type:ElementsType="SeparatorField";

export const SeparatorFieldFormElement:FormElement= {
    type,
    construct: (id: string) => ({
        id,
        type,
    }),
    designerBtnElement:{
        icon:RiSeparator,
        label: "Separador"
    },

    designerComponenet: DesignerComponent,
    formComponent:FormComponent,
    propertiesComponent:PropertiesComponent,
};

function PropertiesComponent({elementInstance}:{elementInstance:FormElementInstance}){
   return(
    <p className="">Este elemento no tiene propiedades</p>
   )
}

function FormComponent({elementInstance}:{elementInstance: FormElementInstance}) {

    return(
        <Separator></Separator>
    )
}

function DesignerComponent({elementInstance}:{elementInstance: FormElementInstance}) {
    
    return(
    <div className="text-white flex flex-col gap-2 w-full">
        <Label className="text-muted-foreground">
            Separador
        </Label>
        <Separator></Separator>
    </div>)
}