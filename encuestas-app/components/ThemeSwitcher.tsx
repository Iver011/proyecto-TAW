'use client'

import { useTheme } from 'next-themes'
import React,{useState,useEffect} from 'react'
import { TabsList,Tabs,TabsTrigger } from './ui/tabs'
import { DockIcon, MoonIcon, SunIcon } from 'lucide-react'

function ThemeSwitcher() {
    const {theme,setTheme} = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(()=>{
        setMounted(true)
    },[])
    if (!mounted) return null;
  return (
    <Tabs defaultValue={theme}>
        <TabsList className='border'>
            <TabsTrigger value='light'
            onClick={()=> setTheme("light")}>
                <SunIcon className='h-[2rem] w[2rem]'></SunIcon>
            </TabsTrigger>
             <TabsTrigger value='dark'
            onClick={()=> setTheme("dark")}>
                <MoonIcon className='h-[2rem] w[2rem] rotate-90 transition-all dark:rotate-0'></MoonIcon>
            </TabsTrigger>
             <TabsTrigger value='system'
            onClick={()=> setTheme("system")}>
                <DockIcon className='h-[2rem] w[2rem]'></DockIcon>
            </TabsTrigger>
        </TabsList>
    </Tabs>
  )
}

export default ThemeSwitcher