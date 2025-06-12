'use client'

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect } from 'react'
import Image from 'next/image';

function ErrorPage({error}: {error: Error}) {
    useEffect(()=>{
        console.error(error);


    },[error])

  return (
    <div className='flex w-full h-full flex-col items-center justify-center'>
        <Image src="\error.svg" width={250} height={250} alt={''}></Image>
        <h2 className='text-destructive text-4xl'>Algo malo esta ocurriendo !!!</h2>
        <Button asChild>
            <Link href={"/"}> Volver al Inicio</Link>
        </Button>
    </div>
  )
}

export default ErrorPage;