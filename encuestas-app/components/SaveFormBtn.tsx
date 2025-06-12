'use client';

import React, { useTransition } from 'react';
import { Button } from './ui/button';
import { HiSaveAs } from 'react-icons/hi';
import useDesigner from '@/hooks/useDesigner';
import { toast } from 'sonner';
import { syncQuestions } from '@/actions/forms';

function SaveFormBtn({id}:{id:number}) {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();

  console.log("el id es el mismo? ",id)
  const handleSave = () => {
    startTransition(async () => {
      try {
        console.log(elements)
        await syncQuestions(id, elements);
        
        toast.success('Preguntas sincronizadas correctamente');
      } catch (err: any) {
        toast.error('Error al sincronizar preguntas: ' + err.message);
      }
    });
  };

  return (
    <Button onClick={handleSave} variant="outline" className="gap-2 hover:cursor-pointer">
      <HiSaveAs className="h-4 w-4" />
      {loading ? 'Guardando...' : 'Guardar'}
    </Button>
  );
}

export default SaveFormBtn;
