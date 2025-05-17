import React, { useState, useEffect } from "react";
import { Estado, Mercadoria, Pais, RankingEstado, RankingEstados, RankingNcm, RankingNcms, RankingPais, RankingPaises } from "../models/interfaces";
import InputNcm from "../components/input/inputNcm";
import InputEstado from "../components/input/inputEstado";
import InputPais from "../components/input/inputPais";
import InputAnos from "../components/input/InputAnos";
import InputTipo from "../components/input/inputTipo";
import GraficoBalancaComercial from "../components/graficos/GraficoBalancaComercial";
import GraficoRankingEstados from "../components/graficos/GraficoRankingEstados";
import GraficoRankingPaises from "../components/graficos/GraficoRankingPaises";
import GraficoRankingNcm from "../components/graficos/GraficoRankingNcm";
import GraficoHistEstados from "../components/graficos/GraficoHistEstados";
import GraficoHistPaises from "../components/graficos/GraficoHistPaises";
import GraficoHistNcms from "../components/graficos/GraficoHistNcms";
import GraficoSetoresDistribuicao from "../components/graficos/GraficoSetoresDistribuicao";


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


    const [paisList, setPaisList] = useState<Pais[] | null>(null);
    const handleReceberRankingPaises = (paises: RankingPaises) => {
        console.log("Lista de países recebida:", paises);
        const idPaises = paises.slice(0, 5).map((item: RankingPais) => ({
            id_pais: item.id_pais,
            nome: item.nome_pais
        }));
        setPaisList(idPaises);
    };

    const [estadoList, setEstadoList] = useState<Estado[] | null>(null);
    const handleReceberRankingEstados = (estados: RankingEstados) => {
        const listaEstados = estados.slice(0, 5).map((item: RankingEstado) => ({
            id_estado: item.id_estado,
            nome: item.nome_estado,
            sigla: item.sigla_estado
        }));
        setEstadoList(listaEstados);
    }

    const [ncmList, setNcmList] = useState<Mercadoria[] | null>(null);
    const handleReceberRankingNcm = (ncms: RankingNcms) => {
        const idncms = ncms.slice(0, 5).map((item: RankingNcm) => ({
            id_ncm: item.ncm,
            descricao: item.produto_descricao
        }));
        setNcmList(idncms);
    }

    return (
        <div className="relative z-10 mx-auto from-indigo-900 to-indigo-950 min-h-screen flex items-center justify-center p-4">
            <div className="flex flex-col min-w-full space-y-6">
                <h2 className="text-center text-3xl font-bold text-white mt-10">
                    Comparações gerais de Estados e Países
                </h2>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full z-10 lg:w-1/4 space-y-4 lg:sticky top-12 self-start">
                        <InputNcm onChange={handleInputNcm} />
                        <InputEstado onChange={handleInputEstado} />
                        <InputPais onChange={handleInputPais} />
                        <InputTipo tipoProcesso={tipoProcesso} setTipoProcesso={setTipoProcesso} />
                        <InputAnos onChange={handleInputAnos} />
                        {/* <BotaoBuscar onClick={() => setIniciarRankeamento(true)} isLoading={buscaIsLoading} /> */}
                    </div>
                    <div className="w-full lg:w-3/4 space-y-6">
                        <div className="bg-indigo-950 min-h-screen p-4 sm:p-6 rounded-2xl shadow-xl w-full space-y-6 text-white">
                            <GraficoBalancaComercial
                                anos={anosSelecionados}
                                estado={estadoSelecionado}
                                pais={paisSelecionado}
                                ncm={mercadoriaSelecionada}
                            />
                            <GraficoRankingEstados
                                tipo={tipoProcesso}
                                anos={anosSelecionados}
                                pais={paisSelecionado}
                                ncm={mercadoriaSelecionada}
                                onRankingCarregado={handleReceberRankingEstados}
                            />

                            <GraficoHistEstados
                                tipo={tipoProcesso}
                                estados={estadoList ? estadoList : null}
                                pais={paisSelecionado}
                                ncm={mercadoriaSelecionada}
                            />

                            <GraficoRankingPaises
                                tipo={tipoProcesso}
                                anos={anosSelecionados}
                                estado={estadoSelecionado}
                                ncm={mercadoriaSelecionada}
                                onRankingCarregado={handleReceberRankingPaises}
                            />
                            <GraficoHistPaises
                                tipo={tipoProcesso}
                                anos={anosSelecionados}
                                estado={estadoSelecionado}
                                ncm={mercadoriaSelecionada}
                                paises={paisList}
                            />

                            <GraficoRankingNcm
                                tipo={tipoProcesso}
                                anos={anosSelecionados}
                                pais={paisSelecionado}
                                estado={estadoSelecionado}
                                onRankingCarregado={handleReceberRankingNcm}
                            />

                            <GraficoHistNcms
                                tipo={tipoProcesso ? tipoProcesso : 'exp'}
                                anos={anosSelecionados}
                                pais={paisSelecionado}
                                estado={estadoSelecionado}
                                ncms={ncmList}
                            />

                            <GraficoSetoresDistribuicao
                                tipo={tipoProcesso ? tipoProcesso : 'exp'}
                                anos={anosSelecionados}
                                pais={paisSelecionado}
                                estado={estadoSelecionado}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
