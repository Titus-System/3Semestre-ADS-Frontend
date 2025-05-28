import { useState, useEffect } from "react";
import { GraficoCrescimentoMensalVlfob } from "../tendencias/GraficoCrescimentoMensalVlfob";
import { GraficoRegressaoLinearVlfob } from "../tendencias/GraficoRegressaoLinearVlFob";
import { GraficoVolatilidadeVlfob } from "../tendencias/GraficoVolatilidadeVlfob";

type Props = {
    ncm?: number | null;
    estado?: number | null;
    pais?: number | null;
};


export default function PainelEstatisticasVlfob({ ncm, estado, pais }: Props) {
    const [abaAtiva, setAbaAtiva] = useState("regressao");

    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
    const handleResize = () => {
        setIsSmallScreen(window.innerWidth <= 380);
    };

    handleResize(); // Verifica no primeiro render
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="w-full rounded-lg shadow-md p-3 sm:p-5 w-full max-w-full">
            <h3 className="text-xl text-white font-semibold mb-4">Análises estatísticas de Valor FOB</h3>

            {/* Abas */}
            <div className="flex border-b mb-4">
                <div className={`${isSmallScreen ? "flex flex-row" : ""}`}>
                <button
                    onClick={() => setAbaAtiva("regressao")}
                    className={`py-2 ${isSmallScreen ? "px-1" : "px-2 sm:px-4"} ${isSmallScreen ? "text-xs" : "text-sm"} font-medium ${abaAtiva === "regressao"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-white hover:text-gray-400"
                        }`}
                >
                    Regressão Linear
                </button>
                <button
                    onClick={() => setAbaAtiva("volatilidade")}
                    className={`py-2 ${isSmallScreen ? "px-1" : "px-2 sm:px-4"} ${isSmallScreen ? "text-xs" : "text-sm"} font-medium ${abaAtiva === "volatilidade"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-white hover:text-gray-400"
                        }`}
                >
                    Volatilidade
                </button>
                </div>
                <button
                    onClick={() => setAbaAtiva("crescimento")}
                    className={`py-2 ${isSmallScreen ? "px-1" : "px-2 sm:px-4"} ${isSmallScreen ? "text-xs" : "text-sm"} font-medium ${abaAtiva === "crescimento"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-white hover:text-gray-400"
                        }`}
                >
                    Crescimento Mensal
                </button>
            </div>

            {/* Conteúdo da Aba */}
            <div className="relative h-[400px]">
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${abaAtiva === "regressao" ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <GraficoRegressaoLinearVlfob
                        ncm={ncm}
                        estado={estado}
                        pais={pais}
                    />
                </div>
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${abaAtiva === "volatilidade" ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <GraficoVolatilidadeVlfob
                        ncm={ncm}
                        estado={estado}
                        pais={pais}
                    />
                </div>
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${abaAtiva === "crescimento" ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <GraficoCrescimentoMensalVlfob
                        ncm={ncm}
                        estado={estado}
                        pais={pais}
                    />
                </div>
            </div>
        </div>
    )
}