import { useState } from "react";
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
    return (
        <div className="w-full rounded-lg shadow-md p-5 w-full max-w-full">
            <h3 className="text-xl text-black font-semibold mb-4">Análises estatísticas de Valor FOB</h3>

            {/* Abas */}
            <div className="flex border-b mb-4">
                <button
                    onClick={() => setAbaAtiva("regressao")}
                    className={`py-2 px-4 text-sm font-medium ${abaAtiva === "regressao"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                        }`}
                >
                    Regressão Linear
                </button>
                <button
                    onClick={() => setAbaAtiva("volatilidade")}
                    className={`py-2 px-4 text-sm font-medium ${abaAtiva === "volatilidade"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                        }`}
                >
                    Volatilidade
                </button>
                <button
                    onClick={() => setAbaAtiva("crescimento")}
                    className={`py-2 px-4 text-sm font-medium ${abaAtiva === "crescimento"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-600 hover:text-blue-600"
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