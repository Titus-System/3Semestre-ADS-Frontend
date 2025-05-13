import React, { useState, useEffect } from "react";
import { DadosSetores, Estado, Mercadoria, Pais, RankingEstados, RankingNcm, RankingPais, RankingPaises } from "../models/interfaces";
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
import GraficoBalancaComercial from "../components/tendencias/GraficoBalancaComercial";
import { buscarTendenciaBalancaComercial, buscarTendenciaVlFob } from "../services/tendenciaServices";
import GraficoHistEstados from "../components/rankings/GraficoHistEstados";
import GraficoHistNcm from "../components/ncm/GraficoHistRankingNcm";
import GraficoHistPais from "../components/rankings/GraficoHistPais";
import { ResponsiveContainer, Tooltip, Treemap } from "recharts";

// Tipagens
interface RankingDados {
    rankingEstados: RankingEstados,
    rankingPaises: RankingPaises,
    rankingNcm: RankingNcm,
    infoSetores: DadosSetores
}

interface Data {
    ds: string
    yhat: number
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

    const [dadosExportacao, setDadosExportacao] = useState<Data[]>([])
    const [dadosImportacao, setDadosImportacao] = useState<Data[]>([])
    const [dadosBalanca, setDadosBalanca] = useState<Data[]>([])
    const buscarVlFob = async () => {
        setBuscaIsLoading(true)
        setTimeout(async () => {
            console.log("Buscando dados para:", {
                estado: estadoSelecionado?.id_estado,
                pais: paisSelecionado?.id_pais
            })
            try {
                const [dadosExp, dadosImp, dadosBal] = await Promise.all([
                    buscarTendenciaVlFob("exp", estadoSelecionado?.id_estado, paisSelecionado?.id_pais),
                    buscarTendenciaVlFob("imp", estadoSelecionado?.id_estado, paisSelecionado?.id_pais),
                    buscarTendenciaBalancaComercial(estadoSelecionado?.id_estado, paisSelecionado?.id_pais),
                ])

                setDadosExportacao(dadosExp)
                setDadosImportacao(dadosImp)
                setDadosBalanca(dadosBal)
            } catch (error) {
                console.error("Erro ao buscar dados:", error)
            }
            setBuscaIsLoading(false)
        })
    }

    const [rankingEstados, setRankingEstados] = useState<any>(null);
    const [rankingPaises, setRankingPaises] = useState<any>(null);
    const [rankingNcm, setRankingNcm] = useState<any>(null);
    const [dadosSetores, setDadosSetores] = useState<any>(null);

    const [histTopEstados, setHistTopEstados] = useState<any>();
    const buscarVlFobTopEstados = async () => {
        const histEstados = [];
        const limite = Math.min(rankingEstados.length, 5); // JavaScript usa Math.min
        for (let i = 0; i < limite; i++) {
            const hist = await buscarTendenciaVlFob(
                tipoProcesso ? tipoProcesso : "exp",
                rankingEstados[i].id_estado,
                paisSelecionado?.id_pais
            );
            histEstados.push({
                estado: rankingEstados[i].sigla_estado,
                hist: hist
            });
        }
        console.log("rankingEstados:", rankingEstados)
        console.log("histtopEstados:", histEstados)
        setHistTopEstados(histEstados);
    };

    useEffect(() => {
        const executarBusca = async () => {
            setBuscaIsLoading(true);
            await buscarVlFob();
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

    useEffect(() => {
        const buscarDados = async () => {
            setBuscaIsLoading(true);
            await buscarVlFobTopEstados();
            setBuscaIsLoading(false);
        };
        buscarDados();
    }, [rankingEstados])


    const [paisList, setPaisList] = useState<number[]|null>(null);
    useEffect (() => {
        const listarIdPaises = () => {
            const idPaises = rankingPaises ? rankingPaises.slice(0, 5).map((item: RankingPais) => item.id_pais) : null;
            setPaisList(idPaises);
        };
        listarIdPaises();
    },[rankingPaises])
    

    
    return (
        <div className="relative z-10 from-indigo-900 to-indigo-950 min-h-screen flex items-center justify-center p-4">
            <div className="flex flex-col min-w-full space-y-6">
                <h2 className="text-center text-3xl font-bold text-white mt-10">
                    Comparações gerais de Estados e Países
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
                            <div className="bg-white rounded pt-4 w-full max-w-full overflow-x-auto">
                                <h3 className="text-center text-indigo-900 font-semibold mb-2">
                                    {`Balança Comercial ${estadoSelecionado ? ` de ${estadoSelecionado.nome}` : `do Brasil`}
                                        ${paisSelecionado ? ` com ${paisSelecionado.nome}` : ``}`}
                                </h3>
                                <GraficoBalancaComercial
                                    dadosExportacao={dadosExportacao}
                                    dadosImportacao={dadosImportacao}
                                    dadosBalanca={dadosBalanca}
                                />
                            </div>
                            <GraficoRanking
                                titulo={rankingEstados ? {
                                    tipoProcesso: tipoProcesso,
                                    ncmDescricao: mercadoriaSelecionada?.descricao ?? null,
                                    siglaEstado: null,
                                    nomePais: paisSelecionado?.nome ?? null
                                } : `Nenhum estado ${tipoProcesso}ortador para os filtros selecionados`}
                                ranking={rankingEstados ? rankingEstados : []}
                            />
                            <GraficoHistEstados histEstados={histTopEstados} isLoading={buscaIsLoading} />
                            <GraficoRanking
                                titulo={{
                                    tipoProcesso: tipoProcesso,
                                    ncmDescricao: mercadoriaSelecionada?.descricao ?? null,
                                    siglaEstado: estadoSelecionado?.sigla ?? null,
                                    nomePais: null
                                }}
                                ranking={rankingPaises ? rankingPaises : []}
                            />
                            <GraficoHistPais
                                tipo = {tipoProcesso}
                                paises = {paisList}
                                estado = {estadoSelecionado ? estadoSelecionado.id_estado : null}
                                ncm = {mercadoriaSelecionada ? mercadoriaSelecionada.id_ncm : null}
                                anos={anosSelecionados}
                            />
                            <GraficoSetores dadosSetores={dadosSetores} tipo={tipoProcesso ? tipoProcesso : 'exp'} estado={estadoSelecionado?.sigla} pais={paisSelecionado?.nome} />
                            <GraficoRanking
                                titulo={rankingNcm ? {
                                    tipoProcesso: tipoProcesso,
                                    ncmDescricao: null,
                                    siglaEstado: estadoSelecionado?.sigla ?? null,
                                    nomePais: paisSelecionado?.nome ?? null
                                } : `Nenhum NCM ${tipoProcesso}ortado para os filtros de estado e país selecionados`}
                                ranking={rankingNcm ? rankingNcm : []}
                            />
                            <GraficoHistNcm 
                                tipo = {tipoProcesso ? tipoProcesso : 'exp'}
                                rankingNcm={rankingNcm} 
                                anos={anosSelecionados} 
                                estado={estadoSelecionado ? estadoSelecionado.id_estado : null} 
                                pais={paisSelecionado ? paisSelecionado.id_pais : null} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
