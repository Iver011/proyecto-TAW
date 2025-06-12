import { FaGithub, FaGolang, FaInstagram } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

function FooterMain() {
  return (
    <footer className="relative bg-gradient-to-t from-black to-gray-900 border-t border-gray-800/50 pt-16 pb-8">
      <div className="max-w-8xl mx-auto px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              ▲ Digital Solutions
            </div>
            <p className="text-gray-400 text-md leading-relaxed">
              Creamos herramientas que ayudan a las empresas a crecer y tener éxito en el mundo digital.
            </p>
          </div>
          
          <div className="space-y-4 mx-20">
            <h3 className="text-white font-semibold">Producto</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-white transition-colors cursor-pointer">Encuestas</li>
              <li className="hover:text-white transition-colors cursor-pointer">Analytics</li>
              <li className="hover:text-white transition-colors cursor-pointer">Plantillas</li>
            </ul>
          </div>
          
          <div className="space-y-4 mx-20">
            <h3 className="text-white font-semibold">Empresa</h3>
            <ul     className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-white transition-colors cursor-pointer">Acerca de</li>
              <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
              <li className="hover:text-white transition-colors cursor-pointer">Contacto</li>
            </ul>
          </div>
          
          <div className="space-y-4 mx-20">
            <h3 className="text-white font-semibold">Soporte</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-white transition-colors cursor-pointer">Documentación</li>
              <li className="hover:text-white transition-colors cursor-pointer">Ayuda</li>
              <li className="hover:text-white transition-colors cursor-pointer">Estado</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 Iver Pedro Mamani Cordero
          </p>
          <div className="flex gap-6 text-gray-500 text-sm">
            <span className="hover:text-white transition-colors cursor-pointer">
                <FaGithub className="w-[30px] h-[30px]"></FaGithub>
            </span>
            <span className=" hover:text-white transition-colors cursor-pointer">
                <MdEmail className="w-[30px] h-[30px]"></MdEmail>
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
                <FaInstagram className="w-[30px] h-[30px]"></FaInstagram>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default FooterMain;