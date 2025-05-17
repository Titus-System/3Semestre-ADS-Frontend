import { useState, useEffect } from "react";
import { buscarAnalisesEstatisticasAuxiliaresVlfob } from "../../services/tendenciaServices";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
    AreaChart,
    ReferenceLine,
    Area
} from "recharts";

type Props = {
    ncm?: number | null;
    estado?: number | null;
    pais?: number | null;
};

export default function PainelEstatisticasAuxiliares({ ncm, estado, pais }: Props) {
    const [estatisticasAuxiliares, setEstatisticasAuxiliares] = useState<any>(null);
    const [abaAtiva, setAbaAtiva] = useState<string>("sazonalidade");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function carregarDados() {
            try {
                setLoading(true);
                const dados = await buscarAnalisesEstatisticasAuxiliaresVlfob(ncm, estado, pais);
                setEstatisticasAuxiliares(dados);
                console.log("estatisticas aux: ", estatisticasAuxiliares)
                setError(null);
            } catch (erro) {
                console.error("Erro ao carregar dados:", erro);
                setError("Não foi possível carregar os dados estatísticos. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        }

        carregarDados();
    }, [ncm, estado, pais]);

    // Função para trocar entre abas
    const trocarAba = (aba: string) => {
        setAbaAtiva(aba);
    };

    // Formatar valores para exibição
    const formatarValor = (valor: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(valor);
    };

    // Formatar valores para o índice HHI
    const formatarHHI = (valor: number) => {
        return Number(valor).toFixed(4);
    };

    // Renderiza o gráfico de sazonalidade
    const renderizarGraficoSazonalidade = () => {
        if (!estatisticasAuxiliares?.sazonalidade?.length) return null;

        return (
            <div className="w-full mt-6">
                <h3 className="text-lg font-medium mb-2 text-gray-700">Sazonalidade Mensal</h3>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={estatisticasAuxiliares.sazonalidade}
                            margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="mes" angle={-45} textAnchor="end" height={70} />
                            <YAxis
                                tickFormatter={(value) => `$${(value / 1e9).toFixed(1)}B`}
                                label={{ value: 'Valor (USD)', angle: -90, position: 'insideLeft', offset: 0 }}
                            />
                            <Tooltip
                                formatter={(value: number) => formatarValor(value)}
                                labelFormatter={(label) => `Mês: ${label}`}
                                labelStyle={{ color: ' #1e40af', fontWeight: 'bold' }}
                            />
                            <Legend />
                            <Bar dataKey="exportacoes" name="Exportações" fill="rgb(15, 116, 2)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="importacoes" name="Importações" fill="rgb(179, 15, 15)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    const graficoConcentracao = (dadosConcentracao?: any) => {
        if (!dadosConcentracao?.length) return null;
        console.log("dadosConcentracao: ", dadosConcentracao)
        return (
            <div className="w-full  mt-6">
                <h3 className="text-lg font-medium mb-2 text-gray-700">Índice de Concentração (HHI)</h3>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={dadosConcentracao}
                            margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                        >
                            <defs>
                                <linearGradient id="exportGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.5} />
                                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.1} />
                                </linearGradient>

                                <linearGradient id="importGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.5} />
                                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis
                                dataKey="mes"
                                angle={-45}
                                textAnchor="end"
                                height={70}
                                interval={"preserveStartEnd"}
                                tickFormatter={(value) => {
                                    const partes = value.split("-");
                                    return `${partes[0]}-${partes[1]}`;
                                }}
                            />
                            <YAxis
                                domain={[0, 1]}
                                tickFormatter={(value) => value.toFixed(2)}
                                label={{ value: 'Índice HHI', angle: -90, position: 'insideLeft', offset: 10 }}
                            />
                            <Tooltip
                                formatter={(value: number) => formatarHHI(value)}
                                labelFormatter={(label) => `Período: ${label}`}
                                labelStyle={{ color: '#1e40af', fontWeight: 'bold' }}
                            />
                            <Legend />

                            <Area
                                type="monotone"
                                dataKey="hhi_exportacao"
                                name="HHI Exportações"
                                stroke="#7c3aed"
                                fill="url(#exportGradient)"
                                strokeWidth={2}
                                dot={{ r: 1 }}
                            />

                            <Area
                                type="monotone"
                                dataKey="hhi_importacao"
                                name="HHI Importações"
                                stroke="#ef4444"
                                fill="url(#importGradient)"
                                strokeWidth={2}
                                dot={{ r: 1 }}
                            />

                            {/* Faixas de referência */}
                            <ReferenceLine y={0.15} stroke="#94a3b8" strokeDasharray="3 3" label="Desconcentrado" />
                            <ReferenceLine y={0.25} stroke="#eab308" strokeDasharray="3 3" label="Moderado" />
                            <ReferenceLine y={0.5} stroke="#dc2626" strokeDasharray="3 3" label="Alta concentração" />
                        </AreaChart>

                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                        <span className="inline-block w-3 h-1 bg-red-600 mr-2"></span>
                        <span>HHI &lt; 0.15: Mercado não concentrado</span>
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-3 h-1 bg-red-600 mr-2"></span>
                        <span>0.15 ≤ HHI ≤ 0.25: Moderadamente concentrado</span>
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-3 h-1 bg-red-600 mr-2"></span>
                        <span>HHI &gt; 0.25: Altamente concentrado</span>
                    </div>
                </div>
            </div>
        );
    }

    const renderizarGraficoConcentracaoPais = () => {
        return graficoConcentracao(estatisticasAuxiliares?.concentracao_pais)
    };

    const renderizarGraficoConcentracaoEstado = () => {
        return graficoConcentracao(estatisticasAuxiliares?.concentracao_estado)
    }

    const renderizarGraficoConcentracaoNcm = () => {
        return graficoConcentracao(estatisticasAuxiliares?.concentracao_ncm)
    }

    // Renderiza o conteúdo da aba selecionada
    const renderizarConteudoAba = () => {
        switch (abaAtiva) {
            case "sazonalidade":
                return renderizarGraficoSazonalidade();
            case "concentracao_pais":
                return renderizarGraficoConcentracaoPais();
            case "concentracao_estado":
                return renderizarGraficoConcentracaoEstado();
            case "concentracao_ncm":
                return renderizarGraficoConcentracaoNcm();
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex justify-center items-center h-64">
                    <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-white rounded-lg shadow">
                <div className="text-center text-red-600 p-4">
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Análises Estatísticas Auxiliares</h2>

            {/* Tabs de navegação */}
            <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                    <button
                        onClick={() => trocarAba("sazonalidade")}
                        className={`py-4 px-6 font-medium text-sm ${abaAtiva === "sazonalidade"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        Sazonalidade
                    </button>
                    <button
                        onClick={() => trocarAba("concentracao_pais")}
                        className={`py-4 px-6 font-medium text-sm ${abaAtiva === "concentracao_pais"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        Concentração por país
                    </button>
                    <button
                        onClick={() => trocarAba("concentracao_estado")}
                        className={`py-4 px-6 font-medium text-sm ${abaAtiva === "concentracao_estado"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        Concentração por estado
                    </button>
                    <button
                        onClick={() => trocarAba("concentracao_ncm")}
                        className={`py-4 px-6 font-medium text-sm ${abaAtiva === "concentracao_ncm"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        Concentração por NCM
                    </button>
                </nav>
            </div>

            {/* Conteúdo da aba selecionada */}
            <div className="mt-4">
                {estatisticasAuxiliares ? renderizarConteudoAba() : (
                    <p className="text-gray-500 text-center p-12">Nenhum dado disponível</p>
                )}
            </div>
        </div>
    );
}