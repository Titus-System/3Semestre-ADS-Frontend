import { useState } from "react";
import { FaShip, FaPlane, FaGlobe , FaBox, FaTrain, FaRoad, FaWater } from "react-icons/fa";

export default function Previsao(){
    const transportModes = [
        { id: "fluvial", icon: <FaWater size={30} /> },
        { id: "aéreo", icon: <FaPlane size={30} /> },
        { id: "vicinal fronteirico", icon: <FaGlobe  size={30} /> },
        { id: "postal", icon: <FaBox size={30} /> },
        { id: "maritimas", icon: <FaShip size={30} /> },
        { id: "ferroviario", icon: <FaTrain size={30} /> },
        { id: "rodoviario", icon: <FaRoad size={30} /> },
      ];
    
      const [selectedModes, setSelectedModes] = useState<string[]>([]);
    
      const toggleModeSelection = (id: string) => {
        setSelectedModes((prev) =>
          prev.includes(id) ? prev.filter((mode) => mode !== id) : [...prev, id]
        );
      };
      
      return (
        <div className="flex flex-col items-center min-h-screen bg-[#656586] p-6">
        <h1 className="text-4xl font-bold text-gray-900 mt-6 mb-10">Previsão de Tendências</h1>
        
    
        <div className="grid grid-cols-2 gap-10 items-center justify-center mt-9 mb-20">
          <div className="flex flex-col space-y-2 w-[505px] h-28">
            <label className="text-black text-xl font-semibold">informe o estado que deseja analisar: *</label>
            <input type="text" className="bg-white text-gray-900 text-md font-medium p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-16"/>
          </div>
          
          <div className="flex flex-col space-y-2 w-[505px] h-28">
            <label className="text-black text-xl font-semibold">Defina a mercadoria:</label>
            <input type="text" className="bg-white text-gray-900 text-md font-medium p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-16"/>
          </div>
          
          <div className="flex flex-col space-y-2 w-[505px] h-28">
            <label className="text-black text-xl font-semibold">Defina o local de origem/destino:</label>
            <input type="text" className="bg-white text-gray-900 text-md font-medium p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-16"/>
          </div>
          
          <div className="flex flex-col space-y-2 w-[505px] h-28">
            <label className="text-black text-xl font-semibold">Defina a URF:</label>
            <input type="text" className="bg-white text-gray-900 text-md font-medium p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-16"/>
          </div>
        </div>
    
        <div className="flex flex-col space-y-2 h-40">
      <p className="text-black text-xl font-semibold">Defina o modal de transporte</p>
      <div className="bg-white text-gray-900 text-md font-bold p-3 border border-gray-300 rounded-full shadow-md hover:bg-gray-100 flex justify-center w-[1045px] h-20 gap-20">
        {transportModes.map((mode) => (
          <button
            key={mode.id}
            className={`relative group p-3 rounded-md text-xl ${
              selectedModes.includes(mode.id)
                ? "bg-gray-900 text-white border-2 border-white"
                : "text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => toggleModeSelection(mode.id)}
          >
            {mode.icon}
            
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {mode.id.charAt(0).toUpperCase() + mode.id.slice(1)}
            </span>
          </button>
        ))}
      </div>
    </div>
    
        
          
    
    <div className="flex flex-col space-y-2 w-[505px] h-28 mt-9 mb-9">
        <a href="/paginaHanking">
        <button className="bg-gray-900 text-white p-4 text-md font-bold p-3 rounded-full shadow-md hover:bg-[#11114E] w-full h-16">
            Gerar Gráfico
        </button>
        </a>
    </div>
    </div>
    )
   
}