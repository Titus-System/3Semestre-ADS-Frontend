import { useEffect, useState } from "react";
import { Estado, Mercadoria, RankingPaises } from "../../models/interfaces";
import { paisesMaisExpImpPorNcmPorEstado } from "../../utils/rankings";
import GraficoRanking from "./GraficoRanking";

type Props = {
    tipo?: string | null
    anos?: number[] | null;
    estado?: Estado | null;
    ncm?: Mercadoria | null;
    onRankingCarregado?: (ranking: RankingPaises) => void;
}

function formataTitulo(tipo?: string | null, estado?: Estado | null, ncm?: Mercadoria | null) {
    let titulo = `Ranking dos países que ${estado ? estado.sigla : 'Brasil'} mais ${tipo ? `${tipo}portou` : 'exportou'}`
    if (ncm) { titulo = `${titulo} ${ncm.descricao}` }
    return titulo
}

async function buscarDados(
    tipo?: string | null,
    anos?: number[] | null,
    estado?: Estado | null,
    ncm?: Mercadoria | null,
    cresc?: boolean | null
) {
    if (tipo !== "exp" && tipo !== "imp") {
        tipo = null;
    }
    const rankingPaises = await paisesMaisExpImpPorNcmPorEstado(tipo, anos ? anos : null, ncm ? ncm.id_ncm : null, estado ? estado.id_estado : null, cresc ? cresc : false);
    return rankingPaises
}

export default function GraficoRankingPaises({ tipo, anos, estado, ncm, onRankingCarregado }: Props) {
    const [rankingPaises, setRankingPaises] = useState<RankingPaises>();
    const [titulo, setTitulo] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const executarBusca = async () => {
            setIsLoading(true);
            const dados: RankingPaises = await buscarDados(tipo, anos, estado, ncm);
            setRankingPaises(dados);
            setTitulo(formataTitulo(tipo, estado, ncm));
            if (onRankingCarregado) {
                onRankingCarregado(dados); 
            }
            setIsLoading(false);
        };
        executarBusca();
    }, [tipo, anos, estado, ncm]);


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
            <GraficoRanking
                titulo={titulo}
                ranking={rankingPaises}
            />
        </div>
    )
}