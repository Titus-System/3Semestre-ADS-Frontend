import { useEffect, useState } from "react";
import { Estado, Mercadoria, Pais, RankingEstados } from "../../models/interfaces";
import GraficoRanking from "./GraficoRanking";
import { estadosMaisExpImpPorNcm } from "../../utils/rankings";


type Props = {
    tipo?: string | null
    anos?: number[] | null;
    estado?: Estado | null;
    pais?: Pais | null;
    ncm?: Mercadoria | null;
    onRankingCarregado?: (ranking: RankingEstados) => void;
}

function formataTitulo(tipo?: string | null, pais?: Pais | null, ncm?: Mercadoria | null) {
    let titulo = `Ranking dos estados que mais ${tipo ? tipo : 'exp'}ortaram`
    if (ncm) { titulo = `${titulo} ${ncm.descricao}` }
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
    ncm?: Mercadoria | null,
    cresc?: boolean | null
) {
    if (tipo !== "exp" && tipo !== "imp") {
        tipo = null;
    }
    const rankingEstadosPorNcm = await estadosMaisExpImpPorNcm(tipo, anos ? anos : null, ncm ? ncm.id_ncm : null, pais ? pais.id_pais : null, cresc ? cresc : false);
    return rankingEstadosPorNcm
}

export default function GraficoRankingEstados({ tipo, anos, pais, ncm, onRankingCarregado }: Props) {
    const [rankingEstados, setRankingEstados] = useState<RankingEstados>();
    const [titulo, setTitulo] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const executarBusca = async () => {
            setIsLoading(true);
            const dados: RankingEstados = await buscarDados(tipo, anos, pais, ncm);
            setRankingEstados(dados);
            setTitulo(formataTitulo(tipo, pais, ncm));
            if (onRankingCarregado) {
                onRankingCarregado(dados);
            }
            setIsLoading(false);
        };
        executarBusca();
    }, [tipo, anos, pais, ncm]);


    if (isLoading) {
        return (
            <div className="p-6 rounded-lg shadow">
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
            <GraficoRanking
                titulo={titulo}
                ranking={rankingEstados}
            />
        </div>
    );
}