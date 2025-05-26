import { useEffect, useState } from "react";
import { Estado, Mercadoria, Pais, RankingEstados } from "../../models/interfaces";
import GraficoRanking from "./GraficoRanking";
import { estadosMaisExpImpPorNcm } from "../../utils/rankings";
import Loading from "../loading";


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
            <Loading/>
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