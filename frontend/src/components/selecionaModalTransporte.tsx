import { useState, useEffect, JSX } from "react";
import { FaBox, FaBroadcastTower, FaRoad, FaShip, FaTrain } from "react-icons/fa";
import { FaGlobe, FaWater } from "react-icons/fa";
import { FaPlane } from "react-icons/fa";
import { GiPipes } from "react-icons/gi";
import { IoBoat } from "react-icons/io5";

interface ModalTransporte {
    id: string;
    icon: JSX.Element;
    codigo: number;
}

interface SelecionaModalTransporteProps {
    onModaisSelecionados: (modais: number[]) => void;
}

export default function SelecionaModalTransporte({ onModaisSelecionados }: SelecionaModalTransporteProps) {
    const transportModes: ModalTransporte[] = [
        { id: "fluvial", icon: <FaWater size={30} />, codigo: 2 },
        { id: "aéreo", icon: <FaPlane size={30} />, codigo: 4 },
        { id: "vicinal fronteirico", icon: <FaGlobe size={30} />, codigo: 15 },
        { id: "postal", icon: <FaBox size={30} />, codigo: 5 },
        { id: "maritimas", icon: <FaShip size={30} />, codigo: 1 },
        { id: "ferroviario", icon: <FaTrain size={30} />, codigo: 6 },
        { id: "rodoviario", icon: <FaRoad size={30} />, codigo: 7 },
        { id: "lacustre", icon: <IoBoat size={30} />, codigo: 3 },
        { id: "rede de transmissão", icon: <FaBroadcastTower size={30} />, codigo: 8 },
        { id: "dutos", icon: <GiPipes className="text-gray-800 w-8 h-8" />, codigo: 14 },
    ];
      
    const [selectedModes, setSelectedModes] = useState<number[]>([]);

    const toggleModeSelection = (id: number) => {
        setSelectedModes((prev: number[]) =>
            prev.includes(id) ? prev.filter((mode) => mode !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        onModaisSelecionados(selectedModes);
    }, [selectedModes, onModaisSelecionados]);

    return (
        <div className="flex flex-col space-y-4">
            {/* Dropdown para telas menores */}
            <div className="block md:hidden">
                <select
                    className="bg-white text-gray-900 text-md font-medium p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-16 w-full appearance-none pr-10"
                    style={{
                        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>')`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '1.5rem',
                    }}
                    onChange={(e) => toggleModeSelection(parseInt(e.target.value))}
                >
                    <option value="">Selecione um modal</option>
                    {transportModes.map((mode) => (
                        <option key={mode.codigo} value={mode.codigo}>
                            {mode.id.charAt(0).toUpperCase() + mode.id.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Botões para telas maiores */}
            <div className="hidden md:flex bg-white text-gray-900 font-bold p-3 border border-gray-300 rounded-full shadow-md flex-wrap justify-center w-full gap-10">
                {transportModes.map((mode) => {
                    const isSelected = selectedModes.includes(mode.codigo);
                    return (
                        <button
                            key={mode.codigo}
                            className={`relative group p-4 rounded-full text-xl transition-all duration-200 ${
                                isSelected
                                    ? "bg-gray-900 text-white border-2 border-white"
                                    : "text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => toggleModeSelection(mode.codigo)}
                        >
                            {mode.icon}
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                {mode.id.charAt(0).toUpperCase() + mode.id.slice(1)}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}