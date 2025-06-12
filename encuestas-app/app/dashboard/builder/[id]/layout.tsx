import React from 'react'

function layout({children}: {children: React.ReactNode}) {
  return (
    <div className='relative z-10 flex w-full flex-grow mx-auto'>{children}</div>
  )
}

export default layout