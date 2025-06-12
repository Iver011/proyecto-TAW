import React, { startTransition, useTransition } from 'react'
import { Button } from './ui/button'
import { MdOutlinePublish } from 'react-icons/md'
import { AlertDialog,AlertDialogContent,AlertDialogDescription,
  AlertDialogCancel,AlertDialogFooter,AlertDialogTitle,
  AlertDialogTrigger,AlertDialogAction,AlertDialogHeader
 } from './ui/alert-dialog'
import { FaIcons } from 'react-icons/fa6'
import { toast } from 'sonner'
import { PublishForm } from '@/actions/forms'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
function PublishFormBtn({id}:{id:number}) {
  const [loading,startTransition]=useTransition();
  const router=useRouter();
  async function publishForm(){
    try{
        await PublishForm(id)
        toast.info("Publicado ",{
                      description: "Tu encuesta esta publicada",      
                      
                  })
        router.refresh()

    }catch(error){
      toast.error("Error al publicar ",{
                      description: "Algo salio mal",      
                      
                  })
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
    <Button variant={"outline"} className='hover:cursor-pointer gap-4 text-white bg-gradient-to-r from-indigo-400 to-cyan-400'>
        <MdOutlinePublish className='h-4 w-4'></MdOutlinePublish>
        Publicar
    </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogTitle>
        Estas Seguro ?
      </AlertDialogTitle>
      <AlertDialogHeader>
      <AlertDialogDescription>
Esta acción no se puede deshacer. Después de publicar, no podrá editar este formulario.        <br></br>
        <span className='font-medium'>
          Al publicar este formulario, lo pondrá a disposición del público y podrá recopilar envíos.</span>
      </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Link href={`/dashboard`}>
        <AlertDialogAction disabled={loading} onClick={(e)=>{
          e.preventDefault();
          startTransition(publishForm)
        }}>
          
          Proceder {loading && <FaIcons className='animate-spin'/>}
        </AlertDialogAction>
        </Link>
      </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
  )
}

export default PublishFormBtn