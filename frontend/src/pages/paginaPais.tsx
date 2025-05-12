import { useEffect, useState } from "react";
import BotaoBuscar from "../components/buttons/BotaoBuscar";
import InputAnos from "../components/input/InputAnos";
import InputEstado from "../components/input/inputEstado";
import InputNcm from "../components/input/inputNcm";
import InputPais from "../components/input/inputPais";
import InputTipo from "../components/input/inputTipo";
import { Estado, Mercadoria, Pais, RankingDados } from "../models/interfaces";
import GraficoBalancaComercial from "../components/tendencias/GraficoBalancaComercial";
import { buscarTendenciaBalancaComercial, buscarTendenciaVlFob } from "../services/tendenciaServices";
import GraficoRanking from "../components/rankings/GraficoRanking";
import GraficoSetores from "../components/rankings/GraficoSetores";
import { buscarDados } from "../utils/rankings";
import GraficoHistEstados from "../components/rankings/GraficoHistEstados";

interface Data {
    ds: string
    yhat: number
}
export default function PaginaPais() {
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
    const [rankingNcm, setRankingNcm] = useState<any>(null);
    const [dadosSetores, setDadosSetores] = useState<any>(null);
    const buscarRankings = async () => {
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
        setRankingNcm(dados.rankingNcm);
        setDadosSetores(dados.infoSetores);
        setBuscaIsLoading(false);
    };

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

    const buscarAction = async () => {
        setBuscaIsLoading(true);
        await buscarVlFob();
        await buscarRankings();
        await buscarVlFobTopEstados();
        setBuscaIsLoading(false);
    }

    useEffect(() => {
        const buscarDados = async () => {
            setBuscaIsLoading(true);
            await buscarVlFob();
            await buscarRankings();
            setBuscaIsLoading(false)
        };
        buscarDados();
    }, [paisSelecionado, estadoSelecionado, tipoProcesso, mercadoriaSelecionada]);

    useEffect(() => {
        const buscarDados = async () => {
            setBuscaIsLoading(true);
            buscarVlFobTopEstados();
            setBuscaIsLoading(false);
        };
        buscarDados();
    }, [rankingEstados])

    return (
        <div className="relative z-10 from-indigo-900 to-indigo-950 min-h-screen flex items-center justify-center p-4">
            <div className="flex flex-col min-w-full space-y-6">
                <h2 className="text-center text-3xl font-bold text-white mt-10">
                    Informações detalhadas por país
                </h2>
                {buscaIsLoading ? (
                    <>
                        <div className="flex flex-col items-center justify-center text-center text-lg font-bold text-white mt-10">
                            <div className="h-5 w-5 mb-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            <span>Buscando...</span>
                        </div>
                    </>
                ) : (null)}

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full z-10 lg:w-1/4 space-y-4 lg:sticky top-12 self-start">
                        <InputPais onChange={handleInputPais} />
                        <InputEstado onChange={handleInputEstado} />
                        <InputNcm onChange={handleInputNcm} />
                        <InputTipo tipoProcesso={tipoProcesso} setTipoProcesso={setTipoProcesso} />
                        <InputAnos onChange={handleInputAnos} />
                        <BotaoBuscar onClick={() => buscarAction()} isLoading={buscaIsLoading} />
                    </div>
                    <div className="w-full lg:w-3/4 space-y-6">
                    
                        <div className="bg-indigo-950 min-h-screen p-4 sm:p-6 rounded-2xl shadow-xl w-full space-y-6 text-white">
                            <GraficoBalancaComercial
                                dadosExportacao={dadosExportacao}
                                dadosImportacao={dadosImportacao}
                                dadosBalanca={dadosBalanca}
                            />
                            <GraficoRanking
                                titulo={rankingEstados ? {
                                    tipoProcesso: tipoProcesso,
                                    ncmDescricao: mercadoriaSelecionada?.descricao ?? null,
                                    siglaEstado: null,
                                    nomePais: paisSelecionado?.nome ?? null
                                } : `Nenhum estado ${tipoProcesso}ortador para os filtros selecionados`}
                                ranking={rankingEstados ? rankingEstados : []}
                            />
                            <GraficoHistEstados histEstados={histTopEstados} isLoading={buscaIsLoading}/>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}