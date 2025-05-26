import { useEffect, useState } from "react";
import { Estado, Pais } from "../../models/interfaces";
import { buscaRankingSh4 } from "../../services/shService";
import Loading from "../loading";
import GraficoRanking from "./GraficoRanking";

type Props = {
    tipo?: 'exp' | 'imp'
    anos?: number[];
    estado?: Estado;
    pais?: Pais;
    onRankingCarregado?: (ranking: any) => void;
}

function formataTitulo(tipo?: string | null, pais?: Pais | null, estado?: Estado | null) {
    let titulo = `Ranking dos SH4s que foram mais ${tipo ? tipo : 'exp'}ortados`
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

function formataTituloVa(tipo?: string | null, pais?: Pais | null, estado?: Estado | null) {
    let titulo = `Ranking dos SH4s de maior Valor Agregado que foram mais ${tipo ? tipo : 'exp'}ortados`
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

export default function GraficoRankingSh4({ tipo, anos, estado, pais, onRankingCarregado }: Props) {
    const [rankingSh4Vlfob, setRankingSh4Vlfob] = useState<any>();
    const [rankingSh4Va, setRankingSh4Va] = useState<any>();
    const [titulo, setTitulo] = useState<string>("");
    const [tituloVa, setTituloVa] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [abaAtiva, setAbaAtiva] = useState<string>("vlfob")

    useEffect(() => {
        const executarBusca = async () => {
            setIsLoading(true);
            const rankingVlfob = await buscaRankingSh4(tipo ? tipo : 'exp', 10, anos, estado ? [estado.id_estado] : undefined, pais ? [pais.id_pais] : undefined, 'valor_fob', 0);
            const rankingVlfobFormatado = rankingVlfob.map((item: any) => ({
                ...item,
                total_valor_fob: Number(item.total_valor_fob),
                total_kg_liquido: Number(item.total_kg_liquido),
                total_valor_agregado: Number(item.total_valor_agregado)
            }));

            const rankingVa = await buscaRankingSh4(tipo ? tipo : 'exp', 10, anos, estado ? [estado.id_estado] : undefined, pais ? [pais.id_pais] : undefined, 'valor_agregado', 0);
            const rankingVaFormatado = rankingVa.map((item: any) => ({
                ...item,
                total_valor_fob: Number(item.total_valor_fob),
                total_kg_liquido: Number(item.total_kg_liquido),
                total_valor_agregado: Number(item.total_valor_agregado)
            }));

            setRankingSh4Vlfob(rankingVlfobFormatado);
            setRankingSh4Va(rankingVaFormatado)

            if (onRankingCarregado) {
                onRankingCarregado(rankingVlfobFormatado);
            }
            setTitulo(formataTitulo(tipo, pais, estado))
            setTituloVa(formataTituloVa(tipo, pais, estado))
            setIsLoading(false);
        };
        executarBusca();
    }, [tipo, anos, pais, estado]);


    if (isLoading) {
        return (
            <Loading />
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
                        ranking={rankingSh4Vlfob}
                    />
                </div>
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${abaAtiva === "va" ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <GraficoRanking
                        titulo={tituloVa}
                        ranking={rankingSh4Va}
                        valor_agregado={true}
                    />
                </div>
            </div>
        </div>
    )
}
