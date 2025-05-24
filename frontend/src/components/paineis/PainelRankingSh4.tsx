import { useState } from "react";
import { Estado, Pais, Sh4 } from "../../models/interfaces";
import GraficoRankingSh4 from "../graficos/GraficoRankingSh4";
import GraficoHistSh4s from "../graficos/GraficoHistSh4s";

type Props = {
    tipo?: 'imp' | 'exp' | null,
    anos?: number[] | null,
    estado?: Estado | null,
    pais?: Pais | null
}

export default function PainelRankingSh4({ tipo, anos, estado, pais }: Props) {
    const [abaAtiva, setAbaAtiva] = useState<'ranking' | 'historico'>('ranking');
    const [sh4List, setSh4List] = useState<Sh4[] | null>(null);
    const handleReceberRankingNcm = (sh4: any) => {
        const idsh4 = sh4.slice(0, 5).map((item: any) => ({
            id_sh4: item.id_sh4,
            descricao: item.sh4_descricao
        }));
        setSh4List(idsh4);
    }
    return (
        <div className="rounded-2xl shadow-xl p-4">
            <div className="flex border-b mb-4">
                <button
                    onClick={() => setAbaAtiva("ranking")}
                    className={`py-2 px-4 text-sm font-medium ${abaAtiva === "ranking"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-white hover:text-blue-600"
                        }`}
                >
                    Ranking
                </button>
                <button
                    onClick={() => setAbaAtiva("historico")}
                    className={`py-2 px-4 text-sm font-medium ${abaAtiva === "historico"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-white hover:text-blue-600"
                        }`}
                >
                    Histórico
                </button>
            </div>
            <div className="relative h-[500px]">
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${abaAtiva === "ranking" ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <GraficoRankingSh4
                        tipo={tipo ? tipo : 'exp'}
                        anos={anos ? anos : undefined}
                        pais={pais ? pais : undefined}
                        estado={estado ? estado : undefined}
                        onRankingCarregado={handleReceberRankingNcm}
                    />

                </div>
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${abaAtiva === "historico" ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <GraficoHistSh4s
                        tipo={tipo ? tipo : 'exp'}
                        pais={pais ? pais : null}
                        estado={estado ? estado : null}
                        sh4s = {sh4List}
                        anos = {anos ? anos : null}
                    />
                </div>
            </div>
        </div>
    )
}