'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";
import { Suspense, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import CreateFormBtn from "@/components/CreateFormBtn";
import { useSession } from "next-auth/react";
import { FormDTO, GetForms } from "@/actions/forms";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";
import { FaSpinner } from "react-icons/fa6";
import SignOutButton from "@/components/SignOutButton";
import DeleteFormBtn from "@/components/DeleteFormBtn";
import { useStaticSession } from "@/hooks/useStaticSession";

export default function Home() {
  /*
  const {data:session,status}=useSession();
  const [dataset,setDataset,]=useState("")
 useEffect(() => {
  fetch("http://localhost:8080/api/surveys", {
    headers: {
      Authorization: `Bearer ${session?.user?.token}`
    }
  })
  .then(async res => {
    if (!res.ok) {
      const err = await res.json().catch(() => ({})); 
      if (res.status === 401) {
        alert(err.message || "No estás autenticado.");
      } else if (res.status === 403) {
        alert(err.message || "No tienes permisos para ver esto.");
      } else {
        alert(err.message || `Error desconocido: ${res.status}`);
      }
      throw new Error("Error HTTP " + res.status);
    }
    return res.json();
  })
  .then(dataset => {
    setDataset(dataset);
  })
  .catch(error => {
    console.error("Error en fetch:", error.message);
  });
}, []);

  console.log(dataset)*/
  return (
    <div className="container pt-4">
      <Suspense>
          <CardStatsWrapper></CardStatsWrapper>
      </Suspense>
      <Separator className="my-6 relative z-10"/>
      <div className="flex justify-between z-10 relative">
        <h2 className="text-4xl font-bold col-span-2">Tus Encuestas</h2>
        <SignOutButton></SignOutButton>
        </div>
      <Separator className="my-6 relative z-10"/>
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateFormBtn/>
        <Suspense fallback={[1,2,3,4].map((el)=>(
            <FormCardSkeleton key={el} ></FormCardSkeleton>
          ))}>
            <FormCards></FormCards>
          </Suspense>
      </div>


    
          </div>
  );
}

function CardStatsWrapper(){
    return <StatsCards></StatsCards>
}

function StatsCards() {
  return <div className="relative z-10 w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
    <StatsCard 
    title="Visitas Totales" 
    icon={<LuView className="text-blue-600"></LuView>}
    helperText="Visitas de la encuesta"
    texto="20"
    className="shadow-md shadow-blue-600"></StatsCard>
        <StatsCard 
    title="Visitas Totales" 
    texto="20"
    icon={<FaWpforms className="text-yellow-600"></FaWpforms>}
    helperText="Visitas de la encuesta"
    className="shadow-md shadow-yellow-600"></StatsCard>
        <StatsCard 
    title="Tasa de Envio"   
    texto="100%"
    icon={<HiCursorClick className="text-green-600"></HiCursorClick>}
    helperText="Visitas que se convirtieron en envios"
    className="shadow-md shadow-green-600"></StatsCard>
        <StatsCard 
    title="Tasa de Rechazo" 
    texto="0%"
    icon={<TbArrowBounce className="text-red-600"></TbArrowBounce>}
    helperText="Visitas que abandonaron la encuesta"
    className="shadow-md shadow-red-600"></StatsCard>
  </div>
}

function StatsCard({
  title,
  icon,
  helperText,
  className,
  texto
}: {
  title: string;
  icon: React.ReactNode;
  helperText?: string;
  className?: string;
  texto?:string
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">
          <Skeleton>
            <span className="flex w-full justify-center">{texto}</span>
          </Skeleton>
        </div>
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
      </Card>
  );
}

function FormCardSkeleton(){
    return <Skeleton className="border-2 border-primary-/20  h-[190px] w-full">

    </Skeleton>
}


export function FormCards() {
  const [forms, setForms] = useState<FormDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Usa tu método de obtención de sesión/token aquí
  const session = useStaticSession(); // O tu hook personalizado
  const token = session?.user?.token; // Ajusta según tu estructura

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const loadForms = async () => {
      try {
        const formsData = await GetForms(token);
        setForms(formsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadForms();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-2xl" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (forms.length === 0) {
    return <div className="p-4">No hay formularios disponibles</div>;
  }

  return (
    <>
      {forms.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </>
  );
}
export type Form = {
  id: string;
  active:boolean;
  title: string;
  description?: string;
  totalResponses:number;
  userId: string;
  createdAt: string; // o `Date` si lo parseas
  updatedAt?: string;
  // otros campos según tu modelo de prisma
};

function FormCard({form}:{form:FormDTO}){
  const session=useStaticSession();
  return(
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold">{form.title}</span>
          {form.active && <Badge>Publicado:</Badge>}
          {!form.active && <Badge variant={"destructive"}>Draft:</Badge>}
          
        </CardTitle>
        <CardDescription>
          {formatDistance(form.createdAt,new Date(),{
            addSuffix: true
          })}
          {
            form.active&&<span className="flex items-center gap-2">
              <LuView className="text-muted-foreground"></LuView>
              <span>{form.totalResponses.toLocaleString()}</span>
            
            </span>
          }
        </CardDescription>
      </CardHeader>
      <CardDescription className="h-[20px] mx-5 truncate text-sm text-muted-foreground">
        {form.description || "Sin descripcion"}
      </CardDescription>
      <CardFooter>
        {<div className="flex w-full gap-10">
          <Button asChild className="w-1/2 dark:bg-slate-600 dark:hover:bg-gray-100" variant={"default"}>
          <Link href={`/dashboard/builder/${form.id}`}>
            Ver <BiRightArrowAlt></BiRightArrowAlt>
          </Link>
          </Button>
          <DeleteFormBtn id={form.id} token={session?.user?.token} ></DeleteFormBtn>
          </div>}

      </CardFooter>
    </Card>
  )
}
