import { useState } from "react";
import GraficoHistEstados from "../graficos/GraficoHistEstados";
import GraficoRankingEstados from "../graficos/GraficoRankingEstados";
import { Estado, Mercadoria, Pais, RankingEstado, RankingEstados } from "../../models/interfaces";

type Props = {
    tipo?: 'imp' | 'exp' | null,
    anos?: number[] | null,
    pais?: Pais | null,
    ncm?: Mercadoria | null
}

export default function PainelRankingEstados({ tipo, anos, pais, ncm }: Props) {
    const [abaAtiva, setAbaAtiva] = useState<'ranking' | 'historico'>('ranking');
    const [estadoList, setEstadoList] = useState<Estado[] | null>(null);
    const handleReceberRankingEstados = (estados: RankingEstados) => {
        const listaEstados = estados.slice(0, 5).map((item: RankingEstado) => ({
            id_estado: item.id_estado,
            nome: item.nome_estado,
            sigla: item.sigla_estado
        }));
        setEstadoList(listaEstados);
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
                    <GraficoRankingEstados
                        tipo={tipo}
                        anos={anos}
                        pais={pais}
                        ncm={ncm}
                        onRankingCarregado={handleReceberRankingEstados}
                    />
                </div>
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${abaAtiva === "historico" ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <GraficoHistEstados
                        tipo={tipo}
                        estados={estadoList ? estadoList : null}
                        pais={pais}
                        ncm={ncm}
                    />
                </div>
            </div>
        </div>
    );
}