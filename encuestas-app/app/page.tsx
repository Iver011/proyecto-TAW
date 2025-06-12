'use client'
import CardMain from '@/components/main-components/card';
import FooterMain from '@/components/main-components/footer';
import IconsMain from '@/components/main-components/icons';
import InfoMain from '@/components/main-components/info';
import NavBarMain from '@/components/main-components/navBar';
import React, { useEffect } from 'react'

function Page() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      createWave(e.clientX, e.clientY);
    };

    const createWave = (x: number, y: number) => {
      const wave = document.createElement('div');
      wave.className = 'fixed pointer-events-none z-10 border-2 border-white/30 rounded-full animate-ping';
      wave.style.left = (x - 150) + 'px';
      wave.style.top = (y - 150) + 'px';
      wave.style.width = '300px';
      wave.style.height = '300px';
      wave.style.animationDuration = '2s';
      
      document.body.appendChild(wave);
      
      setTimeout(() => {
        wave.remove();
      }, 2000);
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="relative bg-slate text-white overflow-x-hidden">
      {/* Fondo con gradientes animados */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate via-slate-900 to-black"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-slate-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10">
        <NavBarMain />
        <InfoMain />
        <IconsMain />
        <div className='min-h-screen flex flex-col justify-center items-center p-4 relative'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 place-items-center max-w-6xl'>
            <CardMain card='/i1.png' text='Social Media Marketing' />
            <CardMain card='/i2.png' text='Analisis y Evaluacion de Resultados' />
            <CardMain card='/i3.png' text='Creacion de Contenido Personalizado' />
            <CardMain card='/i4.png' text='Busqueda y optimizacion de tus encuestas' />
          </div>
        </div>
        <FooterMain />
      </div>
    </div>
  )
}

export default Page;
