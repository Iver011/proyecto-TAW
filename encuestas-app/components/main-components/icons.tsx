import Image from "next/image";

function IconsMain() {
  const icons = [
    { src: "/github.svg", alt: "GitHub", width: 50 },
    { src: "/next.svg", alt: "Next.js", width: 150 },
    { src: "/postman.svg", alt: "Postman", width: 50 },
    { src: "/spring.svg", alt: "Spring", width: 50 }
  ];

  return (
    <div className="relative bg-gradient-to-r from-slate-500 via-slate-800 to-slate-900 flex justify-center items-center py-5 border-y border-slate-700/50">
      <div className="flex gap-16 items-center justify-center flex-wrap max-w-4xl">
        {icons.map((icon, index) => (
          <div 
            key={index}
            className="relative group cursor-pointer transition-all duration-300 hover:scale-110"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6 bg-gray-800/50 rounded-lg border border-gray-700/50 backdrop-blur-sm group-hover:bg-gray-700/50 group-hover:border-gray-600/50 transition-all duration-300">
              <Image 
                src={icon.src} 
                alt={icon.alt} 
                height={40} 
                width={icon.width}
                className="filter brightness-75 group-hover:brightness-100 transition-all duration-300"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IconsMain;
