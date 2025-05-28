import { useEffect, useState } from "react";
import { Estado, Mercadoria, RankingPaises } from "../../models/interfaces";
import { paisesMaisExpImpPorNcmPorEstado } from "../../utils/rankings";
import GraficoRanking from "./GraficoRanking";
import Loading from "../loading";

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
            <Loading />
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