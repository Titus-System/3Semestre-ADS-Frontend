import { useState } from "react";
import { Estado, Mercadoria, Pais } from "../models/interfaces";
import InputNcm from "../components/input/inputNcm";
import InputEstado from "../components/input/inputEstado";
import InputPais from "../components/input/inputPais";
import InputAnos from "../components/input/InputAnos";
import InputTipo from "../components/input/inputTipo";
import GraficoSetoresDistribuicao from "../components/graficos/GraficoSetoresDistribuicao";
import PainelRankingEstados from "../components/paineis/PainelRankingEstados";
import PainelRankingPais from "../components/paineis/PainelRankingPais";
import PainelRankingNcm from "../components/paineis/PainelRankingNcm";
import PainelRankingSh4 from "../components/paineis/PainelRankingSh4";


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


    return (
        <div className="relative z-10 mx-auto from-indigo-900 to-indigo-950 min-h-screen flex items-center justify-center p-4">
            <div className="flex flex-col min-w-full space-y-6">
                <h2 className="text-center text-3xl font-bold text-white mt-10">
                    Rankeamentos
                </h2>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full z-10 lg:w-1/4 space-y-4 lg:sticky top-12 self-start">
                        <InputNcm onChange={handleInputNcm} />
                        <InputEstado onChange={handleInputEstado} />
                        <InputPais onChange={handleInputPais} />
                        <InputTipo tipoProcesso={tipoProcesso} setTipoProcesso={setTipoProcesso} />
                        <InputAnos onChange={handleInputAnos} />
                    </div>
                    <div className="w-full lg:w-3/4 space-y-6">
                        <div className="flex flex-col bg-white/10 border border-white/20 backdrop-blur rounded-2xl text-white shadow-lg min-h-screen p-4 sm:p-6 w-full space-y-12">
                            <div className="">
                                <h3 className="text-left pl-4 text-xl font-bold mt-2 mb-0">Rankeamento de estados</h3>
                                <PainelRankingEstados
                                    tipo={tipoProcesso}
                                    anos={anosSelecionados}
                                    pais={paisSelecionado}
                                    ncm={mercadoriaSelecionada}
                                />
                            </div>
                            <div className="">
                                <h3 className="text-left pl-4 text-xl font-bold mt-2 mb-0">Rankeamento de países</h3>
                                <PainelRankingPais
                                    tipo={tipoProcesso}
                                    anos={anosSelecionados}
                                    estado={estadoSelecionado}
                                    ncm={mercadoriaSelecionada}
                                />
                            </div>
                            <div className="">
                                <h3 className="text-left pl-4 text-xl font-bold mt-2 mb-0">Rankeamento de NCM</h3>
                                <PainelRankingNcm
                                    tipo={tipoProcesso}
                                    anos={anosSelecionados}
                                    estado={estadoSelecionado}
                                    pais={paisSelecionado}
                                />
                            </div>
                            <div className="">
                                <h3 className="text-left pl-4 text-xl font-bold mt-2 mb-0">Rankeamento de SH4</h3>
                                <PainelRankingSh4
                                    tipo={tipoProcesso}
                                    anos={anosSelecionados}
                                    estado={estadoSelecionado}
                                    pais={paisSelecionado}
                                />
                            </div>
                            <div className="">
                                <h3 className="text-left pl-4 text-xl font-bold mt-2 mb-0">Rankeamento de setores</h3>
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
        </div>
    );
}
