import { useState } from "react";
import { Estado, Mercadoria, Pais, RankingPais, RankingPaises } from "../../models/interfaces"
import GraficoHistPaises from "../graficos/GraficoHistPaises";
import GraficoRankingPaises from "../graficos/GraficoRankingPaises";

type Props = {
    tipo?: 'imp' | 'exp' | null,
    anos?: number[] | null,
    estado?: Estado | null,
    ncm?: Mercadoria | null
}

export default function PainelRankingPais({ tipo, anos, estado, ncm }: Props) {
    const [abaAtiva, setAbaAtiva] = useState<'ranking' | 'historico'>('ranking');
    const [paisList, setPaisList] = useState<Pais[] | null>(null);
    const handleReceberRankingPaises = (paises: RankingPaises) => {
        console.log("Lista de países recebida:", paises);
        const idPaises = paises.slice(0, 5).map((item: RankingPais) => ({
            id_pais: item.id_pais,
            nome: item.nome_pais
        }));
        setPaisList(idPaises);
    };
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
                    <GraficoRankingPaises
                        tipo={tipo}
                        anos={anos}
                        estado={estado}
                        ncm={ncm}
                        onRankingCarregado={handleReceberRankingPaises}
                    />

                </div>
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${abaAtiva === "historico" ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <GraficoHistPaises
                        tipo={tipo ? tipo : 'exp'}
                        anos={anos ? anos : null}
                        estado={estado ? estado : null}
                        ncm={ncm ? ncm : null}
                        paises={paisList}
                    />
                </div>
            </div>
        </div>
    )
}