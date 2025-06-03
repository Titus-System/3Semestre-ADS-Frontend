import { useEffect, useState } from "react";
import Loading from "../loading";
import GraficoRanking from "./GraficoRanking";
import { Estado, Mercadoria, Pais } from "../../models/interfaces";
import { buscarRankingVias } from "../../services/viaServices";


type Props = {
    tipo?: string | null
    anos?: number[] | null;
    estado?: Estado | null;
    pais?: Pais | null;
    ncm?: Mercadoria | null;
    urf?: any | null;
    cresc?: boolean | null;
    onRankingCarregado?: (ranking: RankingVias) => void;
}


function formataTitulo(tipo?: string | null, estado?: Estado|null, pais?: Pais | null, ncm?: Mercadoria | null) {
    let titulo = `Ranking das vias mais utilizadas para ${tipo ? tipo : 'exp'}ortação`
    if (ncm) { titulo = `${titulo} de ${ncm.descricao}` }
    if (estado) {
        if (tipo == 'imp') {
            titulo = `${titulo} por ${estado.nome}`
        } else {
            titulo = `${titulo} de ${estado.nome}`
        }
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
    estado?: Estado | null,
    pais?: Pais | null,
    ncm?: Mercadoria | null,
    urf?: any | null,
    cresc?: boolean | null
) {
    if (tipo !== "exp" && tipo !== "imp") {
        tipo = null;
    }
    const rankingVias = await buscarRankingVias(tipo, anos, ncm?.id_ncm, estado?.id_estado, pais?.id_pais, urf, cresc);
    return rankingVias;
}


export default function GraficoRankingVias({tipo, anos, estado, pais, ncm, urf, cresc, onRankingCarregado}:Props) {
    const [rankingVias, setRankingVias] = useState<RankingVias>();
    const [titulo, setTitulo] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    useEffect(() => {
        const executarBusca = async () => {
            setIsLoading(true);
            const dados: RankingVias = await buscarDados(tipo, anos, estado,  pais, ncm, urf, cresc);
            setRankingVias(dados);
            setTitulo(formataTitulo(tipo, estado, pais, ncm));
            if (onRankingCarregado) {
                onRankingCarregado(dados);
            }
            setIsLoading(false);
        };
        executarBusca();
    }, [tipo, anos, estado, pais, ncm, urf]);

    
    if (isLoading) {
        return (
            <Loading/>
        );
    };

    return (
        <div>
            <GraficoRanking
                titulo={titulo}
                ranking={rankingVias}
            />
        </div>
    );
}