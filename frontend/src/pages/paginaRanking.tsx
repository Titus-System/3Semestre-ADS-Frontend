import React, { useState, useEffect } from "react";
import { DadosSetores, Estado, Mercadoria, Pais, RankingEstados, RankingNcm, RankingPaises } from "../models/interfaces";
import InputNcm from "../components/input/inputNcm";
import InputEstado from "../components/input/inputEstado";
import InputPais from "../components/input/inputPais";
import InputAnos from "../components/input/InputAnos";
import BotaoBuscar from "../components/buttons/BotaoBuscar";
import InputTipo from "../components/input/inputTipo";
import { estadosMaisExpImpPorNcm, ncmMaisExpImpPorEstadoPorPais, paisesMaisExpImpPorNcmPorEstado } from "../utils/rankings";
import GraficoRanking from "../components/rankings/GraficoRanking";
import { buscaInfoSetores } from "../services/setoresService";
import GraficoSetores from "../components/rankings/GraficoSetores";

// Tipagens
interface RankingDados {
    rankingEstados: RankingEstados,
    rankingPaises: RankingPaises,
    rankingNcm: RankingNcm,
    infoSetores: DadosSetores
}

async function buscarDados(
    anosSelecionados: number[] | null,
    ncmSelecionado: number | null,
    idEstadoSelecionado: number | null,
    idPaisSelecionado: number | null,
    tipoSelecionado: string | null,
    cresc: boolean = false,
    siglaEstadoSelecionado: string | null
) {
    if (tipoSelecionado !== "exp" && tipoSelecionado !== "imp") {
        tipoSelecionado = null;
    }
    const rankingEstadosPorNcm = await estadosMaisExpImpPorNcm(tipoSelecionado, anosSelecionados, ncmSelecionado, idPaisSelecionado, cresc);
    const rankingPaisPorNcmPorEstado = await paisesMaisExpImpPorNcmPorEstado(tipoSelecionado, anosSelecionados, ncmSelecionado, idEstadoSelecionado, cresc);
    const rankingNcmPorEstadoPorPais = await ncmMaisExpImpPorEstadoPorPais(tipoSelecionado, anosSelecionados, idPaisSelecionado, idEstadoSelecionado, cresc);
    const infoSetores = await buscaInfoSetores(anosSelecionados, idPaisSelecionado, siglaEstadoSelecionado)
    const dados: RankingDados = {
        rankingEstados: rankingEstadosPorNcm,
        rankingPaises: rankingPaisPorNcmPorEstado,
        rankingNcm: rankingNcmPorEstadoPorPais,
        infoSetores: infoSetores
    }
    return dados
}

export default function PaginaRanking() {
    const [mercadoriaSelecionada, setMercadoriaSelecionada] = useState<Mercadoria | null>(null);
    const handleInputNcm = (mercadoria: Mercadoria | null) => {
        setMercadoriaSelecionada(mercadoria)
    }
    const [estadoSelecionado, setEstadoselecionado] = useState<Estado | null>(null);
    const handleInputEstado = (estado: Estado | null) => {
        setEstadoselecionado(estado)
    }
    const [paisSelecionado, setPaisSelecionado] = useState<Pais | null>(null);
    const handleInputPais = (pais: Pais | null) => {
        setPaisSelecionado(pais)
    }
    const [anosSelecionados, setAnosSelecionados] = useState<number[] | null>([]);
    const handleInputAnos = (anos: number[] | null) => {
        setAnosSelecionados(anos);
    };
    const [tipoProcesso, setTipoProcesso] = useState<"exp" | "imp" | null>(null);
    const [ordemSelecionada, setOrdemSelecionada] = useState<boolean>(false);
    const [buscaIsLoading, setBuscaIsLoading] = useState<boolean>(false);
    const [iniciarRankeamento, setIniciarRankeamento] = useState<boolean>(true);

    const [rankingEstados, setRankingEstados] = useState<any>(null);
    const [rankingPaises, setRankingPaises] = useState<any>(null);
    const [rankingNcm, setRankingNcm] = useState<any>(null);
    const [dadosSetores, setDadosSetores] = useState<any>(null);

    useEffect(() => {
        const executarBusca = async () => {
            setBuscaIsLoading(true);
            const dados: RankingDados = await buscarDados(
                anosSelecionados,
                mercadoriaSelecionada ? mercadoriaSelecionada.id_ncm : null,
                estadoSelecionado ? estadoSelecionado.id_estado : null,
                paisSelecionado ? paisSelecionado.id_pais : null,
                tipoProcesso,
                ordemSelecionada,
                estadoSelecionado ? estadoSelecionado.sigla : null
            );
            setRankingEstados(dados.rankingEstados);
            setRankingPaises(dados.rankingPaises);
            setRankingNcm(dados.rankingNcm);
            setDadosSetores(dados.infoSetores);
            setBuscaIsLoading(false);
        };
        executarBusca();
    }, [iniciarRankeamento, anosSelecionados, mercadoriaSelecionada, paisSelecionado, tipoProcesso, estadoSelecionado]);

    return (
        <div className="relative z-10 from-indigo-900 to-indigo-950 min-h-screen flex items-center justify-center p-4">
            <div className="flex flex-col min-w-full space-y-6">
                <h2 className="text-center text-3xl font-bold text-white mt-10">
                    Comparação de Estados e Países
                </h2>
                {/* Layout com filtros à esquerda e conteúdo à direita */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full z-10 lg:w-1/4 space-y-4 lg:sticky top-12 self-start">
                        <InputNcm onChange={handleInputNcm} />
                        <InputEstado onChange={handleInputEstado} />
                        <InputPais onChange={handleInputPais} />
                        <InputTipo tipoProcesso={tipoProcesso} setTipoProcesso={setTipoProcesso} />
                        <InputAnos onChange={handleInputAnos} />
                        <BotaoBuscar onClick={() => setIniciarRankeamento(true)} isLoading={buscaIsLoading} />
                    </div>
                    <div className="w-full lg:w-3/4 space-y-6">
                        <div className="bg-indigo-950 min-h-screen p-4 sm:p-6 rounded-2xl shadow-xl w-full space-y-6 text-white">
                            <GraficoRanking
                                titulo={rankingEstados ? {
                                    tipoProcesso: tipoProcesso,
                                    ncmDescricao: mercadoriaSelecionada?.descricao ?? null,
                                    siglaEstado: null,
                                    nomePais: paisSelecionado?.nome ?? null
                                }: `Nenhum estado ${tipoProcesso}ortador para os filtros selecionados`}
                                ranking={rankingEstados ? rankingEstados : []}
                            />
                            <GraficoRanking
                                titulo={{
                                    tipoProcesso: tipoProcesso,
                                    ncmDescricao: mercadoriaSelecionada?.descricao ?? null,
                                    siglaEstado: estadoSelecionado?.sigla ?? null ,
                                    nomePais: null
                                }}
                                ranking={rankingPaises ? rankingPaises : []}
                            />
                            <GraficoRanking
                                titulo={rankingNcm ? {
                                    tipoProcesso: tipoProcesso,
                                    ncmDescricao: null,
                                    siglaEstado: estadoSelecionado?.sigla ?? null,
                                    nomePais: paisSelecionado?.nome ?? null
                                } : `Nenhum NCM ${tipoProcesso}ortado para os filtros de estado e país selecionados`}
                                ranking={rankingNcm ? rankingNcm : []}
                            />
                            <GraficoSetores dadosSetores={dadosSetores} tipo={tipoProcesso ? tipoProcesso : 'exp'} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
