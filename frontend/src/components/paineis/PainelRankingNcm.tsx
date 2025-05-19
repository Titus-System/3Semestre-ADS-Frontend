import { useState } from "react";
import GraficoHistNcms from "../graficos/GraficoHistNcms";
import GraficoRankingNcm from "../graficos/GraficoRankingNcm";
import { Estado, Mercadoria, Pais, RankingNcm, RankingNcms } from "../../models/interfaces";

type Props = {
    tipo?: 'imp' | 'exp' | null,
    anos?: number[] | null,
    estado?: Estado | null,
    pais?: Pais | null
}

export default function PainelRankingNcm({ tipo, anos, estado, pais }: Props) {
    const [abaAtiva, setAbaAtiva] = useState<'ranking' | 'historico'>('ranking');
    const [ncmList, setNcmList] = useState<Mercadoria[] | null>(null);
    const handleReceberRankingNcm = (ncms: RankingNcms) => {
        const idncms = ncms.slice(0, 5).map((item: RankingNcm) => ({
            id_ncm: item.ncm,
            descricao: item.produto_descricao
        }));
        setNcmList(idncms);
    }
    return (
        <div className="rounded-2xl shadow-xl p-4">
            <div className="flex border-b mb-4">
                <button
                    onClick={() => setAbaAtiva("ranking")}
                    className={`py-2 px-4 text-sm font-medium ${abaAtiva === "ranking"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                        }`}
                >
                    Ranking
                </button>
                <button
                    onClick={() => setAbaAtiva("historico")}
                    className={`py-2 px-4 text-sm font-medium ${abaAtiva === "historico"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-600 hover:text-blue-600"
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
                    <GraficoRankingNcm
                        tipo={tipo}
                        anos={anos}
                        pais={pais}
                        estado={estado}
                        onRankingCarregado={handleReceberRankingNcm}
                    />

                </div>
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${abaAtiva === "historico" ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <GraficoHistNcms
                        tipo={tipo ? tipo : 'exp'}
                        anos={anos ? anos : null}
                        pais={pais ? pais : null}
                        estado={estado ? estado : null}
                        ncms={ncmList}
                    />
                </div>
            </div>




        </div>
    )
}