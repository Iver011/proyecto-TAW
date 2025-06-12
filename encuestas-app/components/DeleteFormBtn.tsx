import { MdOutlineDelete } from "react-icons/md";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Form } from "./ui/form";
import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { Session } from "next-auth";
import { useState } from "react";
import { DeleteForm } from "@/actions/forms";
import { toast } from "sonner";

function DeleteFormBtn({id,token}:{id:string,token:string|undefined}){
const [open,setOpen]=useState(false);
const handleDelete=async()=>{
    try{
        await DeleteForm(Number(id),token||"")
        toast.info("Encuesta eliminada",{
            description:"La encuesta se elimino de manera definitiva"
        })
        setOpen(false)
    }
    catch(err){
        console.error("Error al eliminar el formulario",err)
        alert("error al eliminar encuesta")
    }
}    

    return(<div className="w-full">
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="w-full" asChild>
                 <Button className="bg-red-900 w-full flex  rounded rounded-lg
                            hover:bg-red-700 hover:cursor-pointer">
            Borrar <MdOutlineDelete></MdOutlineDelete>
        </Button>
            </DialogTrigger>
            <DialogContent className="gap-10">
                <DialogHeader>
                    <DialogTitle>
                        ¿Esta Seguro que quiere eliminar esta encuesta?
                    </DialogTitle> 
                </DialogHeader>
                <DialogFooter className="flex justify-center w-full items-center">
                <Button onClick={handleDelete}
                 className="w-1/2 hover:bg-red-900">Si, Eliminar esta encuesta <FaCheck />

</Button>
                <Button  onClick={()=>setOpen(false)}
                className="w-1/2 hover:bg-card hover:text-gray-100">No, volver<MdCancel /></Button>
            </DialogFooter>
            </DialogContent>
            
        </Dialog>
       </div>
    )

}export default DeleteFormBtn;