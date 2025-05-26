import { JSX, useEffect, useState } from "react";
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
export default function InputVias({ onModaisSelecionados }: SelecionaModalTransporteProps) {
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
        <div className="grid gap-2">
            <label htmlFor="Defina a via de transporte: " className="text-sm text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Defina a via de transporte:
            </label>
            {/* Dropdown para telas menores */}

            <div className="relative">
                <div className="flex items-center">
                    <div className="relative w-full">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {/* Globe Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                <path d="M2 12h20"></path>
                            </svg>
                        </div>
                        <select
                            className="w-full h-12 pl-10 pr-10 py-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-300"
                            onChange={(e) => toggleModeSelection(parseInt(e.target.value))}
                        >
                            <option value="">Selecione um modal</option>
                            {transportModes.map((mode) => (
                                <option key={mode.codigo} value={mode.codigo}>
                                    {mode.id.charAt(0).toUpperCase() + mode.id.slice(1)}
                                </option>
                            ))}
                        </select>
                        {/* <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m7 15 5 5 5-5"></path>
                                <path d="m7 9 5-5 5 5"></path>
                            </svg>
                        </div> */}

                    </div>
                </div>
            </div>
        </div>
    );
}