import { useState } from "react";
import GraficoBalancaComercial from "../graficos/GraficoBalancaComercial";
import GraficoHistValorAgregado from "../graficos/GraficoHistValorAgregado";
import { Estado, Mercadoria, Pais } from "../../models/interfaces";
import GraficoHistGeral from "../graficos/GraficoHistGeral";

type Props = {
    estado?: Estado | null,
    pais?: Pais | null,
    ncm?: Mercadoria | null
}

export default function PainelVlFobVa({ estado, pais, ncm }: Props) {
    const [abaAtiva, setAbaAtiva] = useState("balanca");
    return (
        <div className="w-full p-5 max-w-full">
            <div className="flex border-b mb-4">
                <button
                    onClick={() => setAbaAtiva("balanca")}
                    className={`py-2 px-4 text-sm font-medium ${abaAtiva === "balanca"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-white hover:text-blue-600"
                        }`}
                >
                    Balança Comercial
                </button>
                <button
                    onClick={() => setAbaAtiva("valor")}
                    className={`py-2 px-4 text-sm font-medium ${abaAtiva === "valor"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-white hover:text-blue-600"
                        }`}
                >
                    Valor Agregado
                </button>
            </div>

            <div className="relative h-[500px]">
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${abaAtiva === "balanca" ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <GraficoBalancaComercial
                        estado={estado}
                        pais={pais}
                        ncm={ncm}
                    />
                </div>
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${abaAtiva === "valor" ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <GraficoHistValorAgregado
                        estado={estado}
                        pais={pais}
                        ncm={ncm}
                    />
                </div>
                
            </div>
        </div>
    );
}