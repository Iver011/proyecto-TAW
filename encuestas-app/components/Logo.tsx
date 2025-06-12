import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
function Logo() {
  return (
    <Link href={"/"} className=' font-bold text-3xl bg-gradient-to-r from-gray-800 to-gray-300 text-transparent
    bg-clip-text hover:cursor-pointer h-full'>
                    ▲ Digital Solutions

                    
    </Link>
  )
}

export default Logo