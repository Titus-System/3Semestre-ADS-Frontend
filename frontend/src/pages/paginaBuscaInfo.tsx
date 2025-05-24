import { useState } from "react";
import InfoGeral from "../components/info/infoGeral";
import Transacao from "../models/transacao";
import PesquisaMercadoria from "../components/pesquisaMercadoria";
import PesquisaEstado from "../components/pesquisaEstado";
import SelecionaTipoProcesso from "../components/SelecionaTipoProcesso";
import PesquisaPais from "../components/pesquisaPais";
import SelecionaModalTransporte from "../components/selecionaModalTransporte";
import SelecionaPeriodo from "../components/selecionaPeriodo";
import { busca_transacoes_por_ncm } from "../services/ncmService";
import TabelaResultados from "../components/TabelaResultados";
import PainelEstatisticasVlfob from "../components/paineis/PainelEstatisticasVlfob";
import PainelEstatisticasAuxiliares from "../components/paineis/PainelEstatisticasAuxiliaresVlfob";
import GraficoHistGeral from "../components/graficos/GraficoHistGeral";
import PainelSh4 from "../components/paineis/PainelSh4";

export default function PaginaBuscaInfo() {
    const [selectedModes, setSelectedModes] = useState<number[]>([]);
    const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
    const [mercadoria, setMercadoria] = useState("");
    const [estado, setEstado] = useState("");
    const [tipoProcesso, setTipoProcesso] = useState<"exp" | "imp" | null>('exp');
    const [paisSelecionadoId, setPaisSelecionadoId] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [urf, setUrf] = useState("");
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);

    const handleModaisSelecionados = (modais: number[]) => {
        setSelectedModes(modais);
    };

    const handlePeriodosSelecionados = (periodos: number[]) => {
        setSelectedPeriods(periodos);
    };

    const handlePaisSelecionado = (paisId: string) => {
        console.log("País selecionado - ID:", paisId);
        setPaisSelecionadoId(paisId);
    };

    const handleEstadoSelecionado = (estadoId: string) => {
        console.log("Estado selecionado - ID:", estadoId);
        setEstado(estadoId);
    };

    const handleMercadoriaSelecionada = (ncm: string) => {
        console.log("Mercadoria selecionada - NCM:", ncm);
        setMercadoria(ncm);
    };

    const buscarTransacoes = async () => {
        try {
            const ncm = parseInt(mercadoria);
            const qtd = quantidade ? parseInt(quantidade) : undefined;
            const paisDestino = paisSelecionadoId ? [parseInt(paisSelecionadoId)] : undefined;
            const estadoDestino = estado ? [parseInt(estado)] : undefined;
            const urfSelecionada = urf ? [parseInt(urf)] : undefined;

            const modosSelecionados = selectedModes.length > 0 ? selectedModes : undefined;

            const resultados = await busca_transacoes_por_ncm(
                ncm,
                tipoProcesso || "",
                qtd,
                selectedPeriods,
                undefined,
                paisDestino,
                estadoDestino,
                modosSelecionados,
                urfSelecionada
            );

            setTransacoes(resultados);
        } catch (err) {
            console.error("Erro ao buscar transações", err);
        }
    };
    return (

        <div className="flex flex-col items-center min-h-screen bg-transparent p-6 relative z-10">
            <h1 className="text-4xl font-bold text-white mt-6 mb-4 text-center">Consulta de valores e transações</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center justify-center mt-9 mb-9 w-full max-w-5xl">
                <PesquisaMercadoria
                    label="Defina a mercadoria:"
                    onChange={handleMercadoriaSelecionada}
                    placeholder="Digite o nome da mercadoria"
                />

                <PesquisaEstado
                    label="Defina o estado:"
                    onChange={handleEstadoSelecionado}
                    placeholder="Digite o nome do estado"
                />

                <div className="flex flex-col space-y-2">
                    <PesquisaPais
                        label="Defina o país de origem/destino:"
                        onChange={handlePaisSelecionado}
                        placeholder="Digite o nome do país"
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="text-white text-xl font-semibold">Defina a URF:</label>
                    <input
                        type="text"
                        value={urf}
                        onChange={(e) => setUrf(e.target.value)}
                        placeholder="Digite o código da URF"
                        className="bg-white text-gray-900 text-md font-medium p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-16 w-full"
                    />
                </div>
            </div>

            <div className="p-4">
                <h1 className="text-2xl font-bold text-white mb-4">Selecione os Modais de Transporte</h1>
                <SelecionaModalTransporte onModaisSelecionados={handleModaisSelecionados} />
            </div>

            <div className="flex flex-col space-y-4 h-auto w-full max-w-5xl mt-6">
                <SelecionaPeriodo onPeriodosSelecionados={handlePeriodosSelecionados} />
            </div>

            {/* Botão Final */}
            <div className="flex flex-col space-y-2 w-full max-w-md h-28 mt-9 mb-9">
                <button
                    className="w-full h-16 rounded-full mt-16 px-10 py-4 bg-[#0A0A37] text-white hover:bg-[#34538D] text-xl font-semibold"
                    onClick={buscarTransacoes}
                >
                    Buscar Transações
                </button>
            </div>

            <InfoGeral
                anos={selectedPeriods}
                ncm={mercadoria ? [parseInt(mercadoria)] : undefined}
                estado={estado ? [parseInt(estado)] : undefined}
                pais={paisSelecionadoId ? [parseInt(paisSelecionadoId)] : undefined}
                urf={urf ? [parseInt(urf)] : undefined}
                transporte={selectedModes}
            />
            <div className="w-full p-4 flex flex-row gap-4">
                <GraficoHistGeral
                    ncm={[parseInt(mercadoria)]}
                    estado={estado ? [parseInt(estado)] : undefined}
                    pais={paisSelecionadoId ? [parseInt(paisSelecionadoId)] : undefined}
                    urf={urf ? [parseInt(urf)] : undefined}
                    transporte={selectedModes}
                />
            </div>
            {!selectedModes.length && !urf.length ? (
                <div className="gap-4 flex rounded p-4 w-full">
                    <div className="bg-white flex-1 rounded-lg">
                        <PainelEstatisticasVlfob
                            ncm={Number(mercadoria)}
                            estado={Number(estado)}
                            pais={Number(paisSelecionadoId)}
                        />
                    </div>
                    <br /><br />
                    <div className="bg-white flex-1 rounded-lg">
                        <PainelEstatisticasAuxiliares
                            ncm={Number(mercadoria)}
                            estado={Number(estado)}
                            pais={Number(paisSelecionadoId)}
                        />
                    </div>
                </div>

            ) : (
                <p className="text-sm italic">*Estatísticas complementares não disponíveis para os filtros selecionados</p>
            )}
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