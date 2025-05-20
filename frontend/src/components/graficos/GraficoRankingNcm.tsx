import { useEffect, useState } from "react";
import { Estado, Mercadoria, Pais, RankingNcm, RankingNcms } from "../../models/interfaces";
import { ncmMaisExpImpPorEstadoPorPais } from "../../utils/rankings";
import GraficoRanking from "./GraficoRanking";
import { buscarRankingNcm } from "../../services/ncmService";

type Props = {
    tipo?: string | null
    anos?: number[] | null;
    estado?: Estado | null;
    pais?: Pais | null;
    ncm?: Mercadoria | null;
    onRankingCarregado?: (ranking: RankingNcms) => void;
}

function formataTitulo(tipo?: string | null, pais?: Pais | null, estado?: Estado | null) {
    let titulo = `Ranking dos NCMs que foram mais ${tipo ? tipo : 'exp'}ortados`
    if (estado) {
        titulo = `${titulo} por ${estado.sigla}`
    }
    if (pais) {
        if (tipo == 'imp') {
            titulo = `${titulo} de ${pais.nome}`
        } else {
            titulo = `${titulo} para ${pais.nome}`
        }
    }
    return titulo
}

function formataTituloVa (tipo?: string | null, pais?: Pais | null, estado?: Estado | null) {
        let titulo = `Ranking dos NCMs de maior Valor Agregado que foram mais ${tipo ? tipo : 'exp'}ortados`
    if (estado) {
        titulo = `${titulo} por ${estado.sigla}`
    }
    if (pais) {
        if (tipo == 'imp') {
            titulo = `${titulo} de ${pais.nome}`
        } else {
            titulo = `${titulo} para ${pais.nome}`
        }
    }
    return titulo
}


async function buscarDados(
    tipo?: string | null,
    anos?: number[] | null,
    pais?: Pais | null,
    estado?: Estado | null,
    cresc?: boolean | null
) {
    if (tipo !== "exp" && tipo !== "imp") {
        tipo = null;
    }
    const rankingNcmVlfob = await ncmMaisExpImpPorEstadoPorPais(tipo, anos ? anos : null, pais ? pais.id_pais : null, estado ? estado.id_estado : null, cresc ? cresc : false);
    const rankingNcmVa = await buscarRankingNcm(
        tipo ? tipo : 'exp', 10,
        pais ? [pais.id_pais] : [],
        estado ? [estado?.id_estado] : [],
        anos ? anos : [],
        undefined, undefined, undefined, 'valor_agregado',
        cresc ? 1 : 0
    )
    const rankingVa = rankingNcmVa.map((item: RankingNcm) => ({
        ...item,
        total_valor_fob: Number(item.total_valor_fob),
        total_kg_liquido: Number(item.total_kg_liquido),
        total_valor_agregado: Number(item.total_valor_agregado)
    }));
    return {
        rankingVlfob: rankingNcmVlfob,
        rankingVa: rankingVa
    }
}


export default function GraficoRankingNcm({ tipo, anos, pais, estado, onRankingCarregado }: Props) {
    const [rankingNcmsVlfob, setRankingNcmsVlfob] = useState<RankingNcms>();
    const [rankingNcmsVa, setRankingNcmsVa] = useState<any>();
    const [titulo, setTitulo] = useState<string>("");
    const [tituloVa, setTituloVa] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [abaAtiva, setAbaAtiva] = useState<string>("vlfob")

    useEffect(() => {
        const executarBusca = async () => {
            setIsLoading(true);
            const dados = await buscarDados(tipo, anos, pais, estado);
            setRankingNcmsVlfob(dados.rankingVlfob);
            setRankingNcmsVa(dados.rankingVa)

            if (onRankingCarregado) {
                onRankingCarregado(dados.rankingVlfob);
            }
            setTitulo(formataTitulo(tipo, pais, estado))
            setTituloVa(formataTituloVa(tipo, pais, estado))
            setIsLoading(false);
        };
        executarBusca();
    }, [tipo, anos, pais, estado]);


    if (isLoading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex justify-center items-center h-64">
                    <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setAbaAtiva('vlfob')}
                        className={`px-4 py-1 rounded-md text-sm border transition ${abaAtiva == 'vlfob'
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-indigo-600 border-indigo-300 hover:border-indigo-600'
                            }`}
                    >
                        {`Valor FOB ${tipo ? tipo : "exp"}`}
                    </button>
                    <button
                        onClick={() => setAbaAtiva('va')}
                        className={`px-4 py-1 rounded-md text-sm border transition ${abaAtiva == 'va'
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-indigo-600 border-indigo-300 hover:border-indigo-600'
                            }`}
                    >
                        {`Valor Agregado ${tipo ? tipo : 'exp'}`}
                    </button>
                </div>
            </div>
            <div className="relative h-[500px]">
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${abaAtiva === "vlfob" ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <GraficoRanking
                        titulo={titulo}
                        ranking={rankingNcmsVlfob}
                    />
                </div>
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${abaAtiva === "va" ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <GraficoRanking
                        titulo={tituloVa}
                        ranking={rankingNcmsVa}
                        valor_agregado={true}
                    />
                </div>
            </div>
        </div>
    )
}