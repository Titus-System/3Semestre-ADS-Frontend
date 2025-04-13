import { useState } from "react";
import {
    FaShip,
    FaPlane,
    FaGlobe,
    FaBox,
    FaTrain,
    FaRoad,
    FaWater,
} from "react-icons/fa";

export default function ComparacaoEstados() {
    const transportModes = [
        { id: "fluvial", icon: <FaWater size={20} /> },
        { id: "aéreo", icon: <FaPlane size={20} /> },
        { id: "vicinal fronteirico", icon: <FaGlobe size={20} /> },
        { id: "postal", icon: <FaBox size={20} /> },
        { id: "maritimas", icon: <FaShip size={20} /> },
        { id: "ferroviario", icon: <FaTrain size={20} /> },
        { id: "rodoviario", icon: <FaRoad size={20} /> },
    ];

    const [selectedModes, setSelectedModes] = useState<string[]>([]);

    const toggleModeSelection = (id: string) => {
        setSelectedModes((prev) =>
            prev.includes(id)
                ? prev.filter((mode) => mode !== id)
                : [...prev, id]
        );
    };

    const analysisPeriod = [
        { id: 2014, icon: "2014" },
        { id: 2015, icon: "2015" },
        { id: 2016, icon: "2016" },
        { id: 2017, icon: "2017" },
        { id: 2018, icon: "2018" },
        { id: 2019, icon: "2019" },
        { id: 2020, icon: "2020" },
        { id: 2021, icon: "2021" },
        { id: 2022, icon: "2022" },
        { id: 2023, icon: "2023" },
        { id: 2024, icon: "2024" },
    ];

    const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);

    const togglePeriodSelection = (id: number) => {
        setSelectedPeriods((prev) =>
            prev.includes(id)
                ? prev.filter((period) => period !== id)
                : [...prev, id]
        );
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-[#656586] p-4 sm:p-6">
            <div className="w-full max-w-[1200px] mx-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-6 mb-4 text-center">
                    Comparaçao dos Estados
                </h1>

                <div className="grid grid-cols-1  lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex flex-col w-full ">
                        <label className="text-black text-sm sm:text-lg font-semibold text-left">
                            Defina a mercadoria:
                        </label>
                        <input
                            type="text"
                            className="bg-white text-gray-900 text-sm sm:text-md font-medium p-2 sm:p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 w-full"
                        />
                    </div>

                    <div className="flex flex-col w-full space-y-2">
                        <label className="text-black text-sm sm:text-lg font-semibold text-left">
                            Tipo de processo:
                        </label>
                        <div className="inline-flex rounded-full shadow-md border border-gray-300 overflow-hidden w-full h-10 sm:h-12 ml auto">
                            <button
                                onClick={(e) => {
                                    const isActive = e.currentTarget.classList.contains("bg-[#11114E]");
                                    const siblings = e.currentTarget.parentElement?.children;
                                    if (siblings) {
                                        Array.from(siblings).forEach((btn) =>
                                            btn.classList.remove(
                                                "bg-[#11114E]",
                                                "text-white",
                                                "border-2",
                                                "border-white"
                                            )
                                        );
                                    }
                                    if (!isActive) {
                                        e.currentTarget.classList.add(
                                            "bg-[#11114E]",
                                            "text-white",
                                            "border-2",
                                            "border-white"
                                        );
                                    }
                                }}
                                className="bg-white text-[#11114E] text-sm sm:text-md font-bold transition-all w-1/2 hover:bg-[#11114E] hover:text-white rounded-l-full focus:outline-none border-2 border-transparent"
                            >
                                Exportação
                            </button>
                            <button
                                onClick={(e) => {
                                    const isActive = e.currentTarget.classList.contains("bg-[#11114E]");
                                    const siblings = e.currentTarget.parentElement?.children;
                                    if (siblings) {
                                        Array.from(siblings).forEach((btn) =>
                                            btn.classList.remove(
                                                "bg-[#11114E]",
                                                "text-white",
                                                "border-2",
                                                "border-white"
                                            )
                                        );
                                    }
                                    if (!isActive) {
                                        e.currentTarget.classList.add(
                                            "bg-[#11114E]",
                                            "text-white",
                                            "border-2",
                                            "border-white"
                                        );
                                    }
                                }}
                                className="bg-white text-[#11114E] text-sm sm:text-md font-bold transition-all w-1/2 hover:bg-[#11114E] hover:text-white rounded-r-full focus:outline-none border-2 border-transparent"
                            >
                                Importação
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-2 w-full mt-8">
                    <p className="text-black text-sm sm:text-lg font-semibold text-left">
                        Defina o modal de transporte
                    </p>
                    <div className="bg-white text-gray-900 text-sm sm:text-md font-bold p-2 sm:p-3 border border-gray-300 rounded-full shadow-md hover:bg-gray-100 flex justify-center gap-8 sm:gap-10 md:gap-20 flex-wrap overflow-x-auto w-full">
                        {transportModes.map((mode) => (
                            <button
                                key={mode.id}
                                className={`p-1 sm:p-2 rounded-md text-sm sm:text-lg relative group ${
                                    selectedModes.includes(mode.id)
                                        ? "bg-[#11114E] text-white border-2 border-white"
                                        : "text-[#11114E] hover:bg-[#11114E] hover:text-white"
                                }`}
                                onClick={() => toggleModeSelection(mode.id)}
                            >
                                {mode.icon}
                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {mode.id.charAt(0).toUpperCase() + mode.id.slice(1)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col space-y-2 w-full mt-8">
                    <p className="text-black text-sm sm:text-lg font-semibold text-left">
                        Defina o período de análise
                    </p>
                    <div className="bg-white text-gray-900 text-sm sm:text-md font-bold p-2 sm:p-3 border border-gray-300 rounded-full shadow-md hover:bg-gray-100 flex justify-center gap-2 sm:gap-4 overflow-x-auto w-full">
                        {analysisPeriod.map((period) => (
                            <button
                                key={period.id}
                                className={`p-1 sm:p-2 rounded-md text-sm sm:text-lg transition-all duration-200 ${
                                    selectedPeriods.includes(period.id)
                                        ? "bg-[#11114E] text-white border-2 border-white"
                                        : "text-[#11114E] hover:bg-[#11114E] hover:text-white"
                                }`}
                                onClick={() => togglePeriodSelection(period.id)}
                            >
                                {period.icon}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col space-y-4 w-full mt-8">
                    <button className="bg-gray-900 text-white text-sm sm:text-md font-bold p-2 sm:p-3 rounded-full shadow-md hover:bg-[#11114E] w-[200px] sm:w-1/4 mx-auto">
                        Gerar Gráfico
                    </button>
                </div>
            </div>
        </div>
    );
}