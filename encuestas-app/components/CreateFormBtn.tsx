'use client'
import React from 'react'
import {
    Dialog,
    DialogContent, 
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from './ui/dialog';
import {BsFileEarmarkPlus} from 'react-icons/bs';
import {ImSpinner2} from 'react-icons/im';
import { Button } from './ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
}from './ui/form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import { resolve } from 'path';
import { useForm } from 'react-hook-form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { title } from 'process';
import { toast } from 'sonner';
import { formSchema, formSchemaType } from '@/schema/form';
import { CreateForm } from '@/actions/forms';
import { useRouter } from 'next/navigation';


function CreateFormBtn() {
    const router=useRouter();
    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            title:"",
            description:"",
            createdAt:"",
            updateAt:"",
            active:false,
        }   
    });
    async function onSubmit(values:formSchemaType){
        console.log("se esta ejecutando")
        try{
            
            const today=new Date().toISOString().split("T")[0]
            const formId=await CreateForm({
                ...values,
                createdAt:today,
                updateAt:today,
                active:false,
            })
            toast.info("Sucess",{
                description:"Encuesta creada correctamente"
            })
            console.log(formId)
            
            router.push(`/dashboard/builder/${formId}`)
        }catch(error){
            toast.error("Error al crear la encuesta",{
                description: "Por favor, intente de nuevo más tarde.",      
                
            });
    }
    }
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant={"outline"} className='group border border-primary/20 h-[230px] items-center 
            justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4'>
                <BsFileEarmarkPlus className='h-12 w-12  text-muted-foreground group-hover:text-primary'/>
                <p className='font-bold text-xl text-muted-foreground group-hover:text-primary'>Crea una nueva Encuesta</p></Button>
        </DialogTrigger>
        <DialogContent>
        <DialogHeader>
            <DialogTitle>Crear Encuesta</DialogTitle>
            <DialogDescription>
                Crea una nueva encuesta para empezar a recolectar respuestas.
            </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <FormField control={form.control} name='title' render={({field})=>(
                <FormItem>
                    <FormLabel>Nombre de la Encuesta</FormLabel>
                    <FormControl>
                        <Input {...field}/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}/>
                <FormField control={form.control} name="description" render={({field})=>(
                <FormItem>
                    <FormLabel>Descripcion</FormLabel>
                    <FormControl>
                        <Textarea rows={5} {...field}/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}/>
                 <DialogFooter>
           
               <Button type="submit" disabled={form.formState.isSubmitting} className='w-full mt-4'>
        {!form.formState.isSubmitting && <span>Guardar</span>}
        {form.formState.isSubmitting && <ImSpinner2 className='animate-spin h-4 w-4'/>}
      </Button>
      
        </DialogFooter>
            </form>
        </Form>
       
          
        </DialogContent>
    </Dialog>
  )
}

export default CreateFormBtn