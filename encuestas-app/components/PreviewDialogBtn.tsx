import React from 'react'
import { Button } from './ui/button'
import { MdPreview } from 'react-icons/md'
import useDesigner from '@/hooks/useDesigner'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { FormElements } from './FormElements'

function PreviewDialogBtn() {
  const {elements}=useDesigner()
    const dummySubmitValue = () => {}

  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button variant={"outline"} className='gap-2 hover:cursor-pointer'>
        <MdPreview className='h-6 w-6'></MdPreview>Avance</Button>
        </DialogTrigger>
        <DialogContent className='w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0'>
          <DialogTitle className='p-4 g-4'>Vista Previa</DialogTitle>
          <div className="px-4 py-2 border-b">
            <p className='text-lg font-bold text-muted-foreground'>
              FormPreview
            </p>
            <p className="text-sm text-muted-foreground">
              Asi es como tu encuesta se vera para los usuarios.
            </p>
          </div>
          <div className="bg-accent flex flex-col flex-grow items-center justify-center p-4
          bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)] overflow-y-auto">
            <div className="max-w-[620px] flex flex-col gap-4 flew-grow bg-background h-full w-full 
              rounded-3xl p-8 overflow-y-auto">
                {
                  elements.map(element=>{
                    const FormComponent=FormElements[element.type].formComponent;
                    return<FormComponent key={element.id} elementInstance={element}
                    submitValue={dummySubmitValue}
                    />
                      
                  })
                }
              </div>
          </div>
        </DialogContent>
    </Dialog>
  )
}

export default PreviewDialogBtn