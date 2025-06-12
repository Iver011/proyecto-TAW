import Link from "next/link";
import Image from "next/image";
function NavBarMain(){


    return(
    <nav className="relative text-xl text-white flex justify-between items-center px-10 py-8
     bg-black/50 backdrop-blur-md border-b border-gray-800/50">
            <div className="flex items-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-300 bg-clip-text text-transparent">
          ▲ Digital Solutions
        </div>
      </div>
 <div className="flex gap-20 items-center">
        <span className="hover:text-gray-300 transition-colors duration-300 cursor-pointer">
          Blog
        </span>
        <span className="hover:text-gray-300 transition-colors duration-300 cursor-pointer">
          Acerca de
        </span>
        <Link href={"./login"}>
          <span className="px-6 py-3 bg-gradient-to-r from-slate-600 to-cyan-600 rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 cursor-pointer font-semibold">
            Crear una Encuesta
          </span>
        </Link>
      </div>
        </nav>
    )

}export default NavBarMain;