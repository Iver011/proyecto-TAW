'use client'
import Image from "next/image";
import { useState } from "react";

function CardMain({ card, text }: { card: string, text: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative flex w-full max-w-[500px] h-[270px] bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-xl p-8 gap-6 border border-gray-700/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-slate-500/10 via-slate-500/10 to-cyan-500/10 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
      
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/50 via-slate-500/50 to-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
      
      <div className="relative z-10 flex items-center gap-6 w-full">
        <h2 className="flex-1 text-2xl font-bold text-white leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
          {text}
        </h2>
        
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-lg transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
          <div className="relative">
            <Image 
              src={card} 
              alt={text}
              width={200} 
              height={150}
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>
      </div>
      
      {/* Partículas decorativas */}
      <div className={`absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full transition-all duration-1000 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>
      <div className={`absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full transition-all duration-1000 delay-200 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>
    </div>
  )
}

export default CardMain;
