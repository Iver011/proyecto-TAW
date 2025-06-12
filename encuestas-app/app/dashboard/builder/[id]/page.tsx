'use client'
import FormBuilder from '@/components/FormBuilder'
import React from 'react'
import {use} from "react";

function BuilderPage({params}: {params: Promise<{id:number}>}) {
  const {id}=use(params);
  console.log(id)

  return (
    <div className='flex w-full'><FormBuilder surveyId={id} title=''></FormBuilder></div>
  )
}

export default BuilderPage

