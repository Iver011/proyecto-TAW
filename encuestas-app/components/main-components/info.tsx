import Image from "next/image";

function InfoMain() {
  return (
    <div className="relative bg-gradient-to-br from-slate-800 via-black to-gray-900 flex justify-center items-center pt-20 pb-20 overflow-hidden">
     <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-slate-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-16 max-w-7xl mx-auto px-4">
        <div className="text-white max-w-lg flex flex-col justify-center items-start gap-8"> 
          <h1 className="font-bold text-4xl lg:text-5xl leading-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Crea y personaliza encuestas al momento
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            Nuestra agencia de marketing digital ayuda a las empresas a crecer y tener éxito 
            en línea a través de una variedad de servicios que incluyen SEO, PPC, marketing en
            redes sociales y creación de contenido.
          </p>
          
          {/* Botón CTA adicional */}
          <button className="mt-4 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 font-semibold">
            Comenzar Ahora
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
          <Image 
            src="/illustration.svg" 
            alt="Ilustración" 
            width={500} 
            height={415}
            className="relative z-10 drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  )
}

export default InfoMain;
