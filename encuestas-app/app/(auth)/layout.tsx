'use client'
import Logo from '@/components/Logo'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import React, { Children } from 'react'

function layout({children}:{children:React.ReactNode}) {
  return (
    <div>
    <nav className='fixed  border-none w-full bg-slate-600/50
          self-start flex justify-between items-center border-b 
          border-border h-[80px] px-4 py-5 z-10 dark:bg-black/20
          '>
        <Logo/>
        <div className=' flex gap-4 items-center'></div>
        <ThemeSwitcher />
      </nav>
      {children}
      </div>
  )
}

export default layout