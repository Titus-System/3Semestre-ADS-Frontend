import { useState } from "react";
import InfoGeral from "../components/info/infoGeral";
import Transacao from "../models/transacao";
import { busca_transacoes_por_ncm } from "../services/ncmService";
import TabelaResultados from "../components/TabelaResultados";
import PainelEstatisticasVlfob from "../components/paineis/PainelEstatisticasVlfob";
import PainelEstatisticasAuxiliares from "../components/paineis/PainelEstatisticasAuxiliaresVlfob";
import { Estado, Mercadoria, Pais, Sh4 } from "../models/interfaces";
import InputNcm from "../components/input/inputNcm";
import InputEstado from "../components/input/inputEstado";
import InputPais from "../components/input/inputPais";
import InputTipo from "../components/input/inputTipo";
import InputAnos from "../components/input/InputAnos";
import PainelTendencias from "../components/paineis/PainelTendencias";
import InputSh4 from "../components/input/InputSh4";
import InfoGeralNcm from "../components/ncm/infoGeralNcm";
import PainelSh4 from "../components/paineis/PainelSh4";
import InputVias from "../components/input/InputVias";

export default function PaginaBuscaInfo() {
    const [mercadoriaSelecionada, setMercadoriaSelecionada] = useState<Mercadoria | null>(null);
    const handleInputNcm = (mercadoria: Mercadoria | null) => {
        setMercadoriaSelecionada(mercadoria)
    }

    const [sh4, setSh4] = useState<Sh4 | null>(null);

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


    const [selectedModes, setSelectedModes] = useState<number[]>([]);
    const [urf, setUrf] = useState("");
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);

    const handleModaisSelecionados = (modais: number[]) => {
        setSelectedModes(modais);
    };

    const buscarTransacoes = async () => {
        try {
            const ncm = mercadoriaSelecionada ? mercadoriaSelecionada.id_ncm : 0;
            const qtd = undefined;
            const paisDestino = paisSelecionado?.id_pais;
            const estadoDestino = estadoSelecionado?.id_estado;
            const urfSelecionada = urf ? [parseInt(urf)] : undefined;

            const modosSelecionados = selectedModes.length > 0 ? selectedModes : undefined;

            const resultados = await busca_transacoes_por_ncm(
                ncm,
                tipoProcesso || "",
                qtd,
                anosSelecionados ? anosSelecionados : undefined,
                undefined,
                paisDestino ? [paisDestino] : undefined,
                estadoDestino ? [estadoDestino] : undefined,
                modosSelecionados,
                urfSelecionada
            );

            setTransacoes(resultados);
        } catch (err) {
            console.error("Erro ao buscar transações", err);
        }
    };
    return (

        <div className="relative z-10 mx-auto from-indigo-900 to-indigo-950 min-h-screen flex items-center justify-center p-4">
            <div className="flex flex-col min-w-full space-y-6">
                <h2 className="text-center text-3xl font-bold text-white mt-10">
                    Consulta de valores e transações
                </h2>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full z-10 lg:w-1/4 space-y-4 lg:sticky top-12 self-start">
                        <InputNcm onChange={handleInputNcm} />
                        <InputSh4 onChange={(sh4) => { setSh4(sh4) }} />
                        <InputEstado onChange={handleInputEstado} />
                        <InputPais onChange={handleInputPais} />
                        <InputTipo tipoProcesso={tipoProcesso} setTipoProcesso={setTipoProcesso} />
                        <InputAnos onChange={handleInputAnos} />
                        <InputVias onModaisSelecionados={handleModaisSelecionados}/>
                    </div>
                    <div className="w-full lg:w-3/4 space-y-6">
                        <div className="flex flex-col bg-white/10 border border-white/20 backdrop-blur rounded-2xl text-white shadow-lg min-h-screen p-4 sm:p-6 w-full space-y-12">
                            {mercadoriaSelecionada && (
                                <InfoGeralNcm
                                    ncm={mercadoriaSelecionada ? mercadoriaSelecionada.id_ncm : null}
                                />
                            )}
                            {sh4 && (
                                <PainelSh4 sh4={sh4.id_sh4}/>
                            )}

                            <InfoGeral
                                anos={anosSelecionados ? anosSelecionados : undefined}
                                ncm={mercadoriaSelecionada ? [mercadoriaSelecionada.id_ncm] : undefined}
                                estado={estadoSelecionado ? [estadoSelecionado.id_estado] : undefined}
                                pais={paisSelecionado ? [paisSelecionado.id_pais] : undefined}
                                urf={urf ? [parseInt(urf)] : undefined}
                                transporte={selectedModes}
                            />
                            <PainelTendencias
                                estado={estadoSelecionado}
                                pais={paisSelecionado}
                                ncm={mercadoriaSelecionada}
                                sh4={sh4}
                            />
                            {!selectedModes.length && !urf.length && !sh4 ? (
                                <div className="gap-4 flex flex-col rounded p-4 w-full">
                                    <div className="rounded-lg">
                                        <PainelEstatisticasVlfob
                                            ncm={mercadoriaSelecionada?.id_ncm}
                                            estado={estadoSelecionado?.id_estado}
                                            pais={paisSelecionado?.id_pais}
                                        />
                                    </div>
                                    <br /><br />
                                    <div className="rounded-lg">
                                        <PainelEstatisticasAuxiliares
                                            ncm={mercadoriaSelecionada?.id_ncm}
                                            estado={estadoSelecionado?.id_estado}
                                            pais={paisSelecionado?.id_pais}
                                        />
                                    </div>
                                </div>

                            ) : (
                                <p className="text-sm italic">*Estatísticas complementares não disponíveis para os filtros selecionados</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-5xl overflow-x-auto">
                {transacoes.length > 0 ? (
                    <TabelaResultados transacoes={transacoes} tipoProcesso={tipoProcesso} />
                ) : (
                    <div>Nenhuma informação encontrada</div>
                )}
            </div>
        </div>
    );
}