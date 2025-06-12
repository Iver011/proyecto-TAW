import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";

import React from 'react'
import { Button } from './ui/button'
import Link from "next/link";

function SignOutButton() {
  return (
    <Link href={"./"}>
    <Button onClick={()=>signOut()}
    variant={"outline"} className='hover:cursor-pointer 
    hover:bg-red-800 gap-4 text-white bg-red-700 from-indigo-400 to-cyan-400
    dark:hover:bg-red-600'>
        <FaSignOutAlt className='h-4 w-4'></FaSignOutAlt>
        Cerrar Sesion
    </Button>
    </Link>
  )
}

export default SignOutButton