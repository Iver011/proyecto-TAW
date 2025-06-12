export default function NoiseBackground() {
  return (
    <div className="relative h-screen bg-white">
      {/* Textura de ruido MUY VISIBLE para pruebas */}
      <div 
        className="absolute inset-0 opacity-20" // Opacidad aumentada para pruebas
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)' fill='black'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          pointerEvents: 'none' // Permite interactuar con elementos debajo
        }}
      />
      
      {/* Contenido */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-4xl font-bold bg-white/50 p-4 rounded-lg">
          Textura visible ahora
        </h1>
      </div>
    </div>
  )
}