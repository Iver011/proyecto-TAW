'use client'
import { signIn } from 'next-auth/react';
import {useRouter} from "next/navigation"
import React from 'react'
import { useState } from 'react';
function RegisterPage() {
    const router=useRouter()

    const [errors,setErrors]=useState<string[]>([]);
    const [nombre,setNombre]=useState<string>("Test")
    const [apellido,setApellido]=useState<string>("Test")
    const [username,setUsername]=useState<string>("Test");
    const [email,setEmail]=useState<string>("test@test.com");
    const [password,setPassword]=useState<string>("123456")
    
    const handleSubmit=async(event:React.FormEvent<HTMLFormElement>)=>{
        console.log(nombre,apellido,username,email,password)
        
        event.preventDefault();
        setErrors([]);
        const res = await fetch(`http://localhost:8080/api/auth/signup`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                nombre,apellido,username,email,password
            }),
        }
    )
    const responseAPI=await res.json()
    
    if (!res.ok) {
        
     const mensajes = Array.isArray(responseAPI.message)
      ? responseAPI.message
      : [responseAPI.message];
    setErrors(mensajes);
    console.log("Errores:", mensajes);
    return;
    }

    const responseNextAuth = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (responseNextAuth?.error) {
      setErrors(responseNextAuth.error.split(","));
      console.log(responseNextAuth,"caso2")
      return;
    }

    router.push("./dashboard");
  };

    
    

  return (
    <div className='h-screen flex flex-col justify-center items-center'>
        <div className="dark:bg-slate-800 w-1/4 h-4/5 p-5 gap-4 rounded-lg mt-10">
        <h2 className='text-3xl font-bold'>Registrarse</h2>
        <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-2 mt-4'>
            <span>Nombre </span>
            <input type='text' value={nombre} onChange={(event)=>setNombre(event.target.value)} 
            className='w-full h-full p-3 border-b border-gray-500 focus:outline-none' placeholder='Nombres'></input>
        </div>
        <div className='flex flex-col gap-2 mt-4 '>
            <span>Apellidos </span>
            <input type='text' value={apellido} onChange={(event)=>setApellido(event.target.value)}
            className='w-full focus:outline-none border-b border-gray-500 p-3' placeholder='Apellidos'></input>
        </div>
        <div className='flex flex-col gap-2 mt-4'>
            <span>Email </span>
            <input type='text' value={email} onChange={(event)=>setEmail(event.target.value)}
            className="w-full focus:outline-none border-b border-gray-500 p-3" placeholder='Email'></input>
        </div>
        <div className='flex flex-col gap-2 mt-4'>
            <span>Nombre de usuario </span>
            <input type='text' value={username} onChange={(event)=>setUsername(event.target.value)} 
            className='w-full focus:outline-none border-b border-gray-500 p-3' 
            placeholder='Username'></input>
        </div>
        <div className='flex flex-col gap-2 mt-4'>
            <span>Contraseña</span>
            <input type='password' value={password} onChange={(event)=>setPassword(event.target.value)} 
            className='w-full focus:outline-none border-b border-gray-500 p-3'  placeholder='Contraseña'></input>
        </div>
        <button className='w-full mt-8 bg-slate-950 p-3 rounded-lg hover:cursor-pointer'  type='submit'>Registrarme</button>
        </form>
        {errors.length > 0 && (
        <div className="alert alert-danger mt-2 bg-slate-800 w-full rounded-lg  ">
          <ul className="mb-0">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
        </div>
    </div>
  )
}

export default RegisterPage;