import Logo from '@/components/Logo'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import React from 'react'
function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className='relative z-10 flex flex-col min-h-screen min-w-full bg-background max-h-screen
    h-screen'>
       <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate via-slate-900 to-black"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-slate-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      <nav className='z-10 flex justify-between items-center border-b border-border h-[60px] px-4 py-2'>
        <Logo/>
        <ThemeSwitcher/>
      </nav>
      <main className='flex w-full flex-grow justify-center'>
        {children}
      </main>
    </div>
  )
}

export default Layout