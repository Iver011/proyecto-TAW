'use client'
import { FaRegEye,FaIdCard,FaRegEyeSlash   } from "react-icons/fa6";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Logo from "@/components/Logo";
import { signIn } from "next-auth/react";

function page(){
    const [errors, setErrors] = useState<string[]>([]);
    const [username, setUsername] = useState("test@test.com");
    const [password, setPassword] = useState("123123");
    const router = useRouter();

    const [showPassword,setShowPassword]=useState(false)
   
    const changeVisibility = () => {
        setShowPassword((prev) => {
          console.log("Valor anterior:", prev); // Veremos el valor actual antes de cambiarlo
          return !prev; // Invertimos el valor
        });
      };
     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors([]);
            console.log(username,password)
        const responseNextAuth = await signIn("credentials", {
          username,
          password,
          redirect: false,
        });

        if (responseNextAuth?.error) {
          setErrors(responseNextAuth.error.split(","));
          return;
        } 
        
        router.push("/dashboard");
        router.refresh();
      };
      console.log(errors)

    return(
       <div className="relative
       flex flex-col w-screen h-screen items-center justify-center">
        <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-300 via-slate-500 to-slate-700
            dark:from-slate-500 dark:via-slate-950 dark:to-black "></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 dark:bg-blue-500/20 rounded-full blur-3xl 
        animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-slate-600/20
        dark:bg-slate-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
        <div className="bg-white/10 z-10 flex flex-col items-center justify-center p-10 gap-5 w-1/4 h-3/5 rounded-lg">
            <form className="w-full h-full" onSubmit={handleSubmit}>  

                <div className="flex w-full justify-between items-center" >
                <h3 className="text-3xl font-bold">Iniciar Sesion
                </h3>
                <FaIdCard className="w-10 h-10"/>
                </div>
                <div className="w-full flex flex-col gap-2 mt-6">
                    <span className="mt-4 text-lg">Correo Electronico</span>
                
                <input className="border-b border-gray-500  w-full h-full p-3
                focus:outline-none focus:ring-0 " type="text" placeholder="Email"
                value={username} onChange={(event)=>{setUsername(event.target.value)}}></input>
                </div>
                <div className="mt-4 flex flex-col gap-2 text-lg"><span className="">Contraseña</span>
                <div className="border-b border-gray-500 flex justify-between p-3" >
                <input className="focus:outline-none focus:ring-0 focus:border-none w-3/4"  type={showPassword?"text":"password"} placeholder="Contraseña"
                value={password} onChange={(event)=>{setPassword(event.target.value)}}></input>
                
                <span className="hover:cursor-pointer" onClick={changeVisibility} >
        {showPassword ? <FaRegEyeSlash className="w-5 h-5" /> : <FaRegEye className="w-5 h-5"/>} {/* Cambia el icono */}
      </span>
                </div>
                </div>
                {
          errors.length>0&&(
            <div>
              {errors.map((error)=>(
                <li key={error}>{error}</li>
              )
                
              )}
            </div>
          )
        }
                <div className="flex flex-col">
                
                <button className="text-white bg-slate-800 p-3 w-full rounded-lg dark:text-foreground
                  hover:cursor-pointer dark:hover:bg-gray-200 dark:hover:text-slate-800 mt-8 " type="submit">Ingresar</button>
                </div>
            </form>
            <div className="flex gap-x-4 mb-4">
                <p>¿Aun no tienes una cuenta?</p>
                <Link href={"./register"}>
                <p className="hover:underline dark:text-teal-500">Registrarse</p>
                </Link>
                
            </div>
        </div>


       </div>
    );}
export default page;