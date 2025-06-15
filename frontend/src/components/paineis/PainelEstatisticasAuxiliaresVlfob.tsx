import { useState, useEffect } from "react";
import { buscarAnalisesEstatisticasAuxiliaresVlfob } from "../../services/tendenciaServices";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
    AreaChart,
    ReferenceLine,
    Area, LegendProps
} from "recharts";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Hhi from "../modais/hhi";
import Sazonalidade from "../modais/sazonalidade";
import { formatarValor } from "../../utils/formatarValor";
import Loading from "../loading";

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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 445);
    const [mostrarModalHhi, setMostrarModalHhi] = useState(false);
    const [mostrarModalSazonalidade, setMostrarModalSazonalidade] = useState(false);

    const [intervalX, setIntervalX] = useState(0);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [legendFontSize, setLegendFontSize] = useState(14); 
    const [modalFontSizeHI, setModalFontSizeHI] = useState(14);
    const [modalFontSizeSazo, setModalFontSizeSazo] = useState(14);

    useEffect(() => {
    const handleResize = () => {
        setModalFontSizeSazo(window.innerWidth < 500 ? 13 : 14);
        setModalFontSizeHI(window.innerWidth < 273 ? 8 : window.innerWidth < 290 ? 9 : window.innerWidth < 304 ? 10 : window.innerWidth < 320 ? 11 : window.innerWidth < 342 ? 12 : window.innerWidth < 386 ? 13 : 14);
        setIntervalX(window.innerWidth < 560 ? 0 : window.innerWidth < 695 ? 1 : 0);
        setIsMobile(window.innerWidth < 445);
        setLegendFontSize(window.innerWidth < 265 ? 10 : window.innerWidth < 305 ? 11 : window.innerWidth < 640 ? 13 : 14);
    };
    
    handleResize(); 
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
    }, []);


        useEffect(() => {
            const handleResize = () => setIsSmallScreen(window.innerWidth < 560);
            handleResize(); 
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, []);

        // Função para scroll, sem usar useRef, acessando DOM via id
        const scrollGrafico = (direction: "left" | "right") => {
            const container = document.getElementById("grafico-scroll-container");
            if (container) {
            const scrollAmount = 250;
            container.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
            }
        };


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


    // Formatar valores para o índice HHI
    const formatarHHI = (valor: number) => {
        return Number(valor).toFixed(4);
    };

    // Renderiza o gráfico de sazonalidade
    const renderizarGraficoSazonalidade = () => {
        if (!estatisticasAuxiliares?.sazonalidade?.length) return null;

    const CustomLegend = ({ payload, fontSize }: LegendProps & { fontSize: number }) => {
        return (
        <div className="w-full flex justify-center mt-1">
              <ul className="flex flex-col gap-y-1 sm:flex-row sm:gap-3 lg:flex-col lg:gap-y-1 2xl:flex-row 2xl:gap-x-3">
                {payload?.map((entry, index) => (
                  <li key={`item-${index}`} className="flex items-center text-white" style={{ fontSize }}>
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span>{entry.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            );
          };

        return (
            <div className="w-full max-w-full mt-6">
                <h3
                    className="text-lg font-medium mb-2 text-gray-300 cursor-pointer hover:underline"
                    onClick={() => setMostrarModalSazonalidade(true)}
                >
                    Sazonalidade Mensal
                </h3>
                {mostrarModalSazonalidade && <Sazonalidade onClose={() => setMostrarModalSazonalidade(false)} />}
                {isSmallScreen ? (
                        <div className="relative">
                        <button
                            onClick={() => scrollGrafico("left")}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow z-10"
                            aria-label="Scroll Left"
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            onClick={() => scrollGrafico("right")}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow z-10"
                            aria-label="Scroll Right"
                        >
                            <FaChevronRight />
                        </button>

                        <div id="grafico-scroll-container" className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800">
                            <div className="w-[800px] h-[400px] min-w-[800px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                data={estatisticasAuxiliares.sazonalidade}
                                margin={{ top: 22, right: 12, left: 0, bottom: 8 }}
                                >
                                <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
                                <XAxis
                                    stroke="#E0E0E0"
                                    dataKey="mes"
                                    angle={-45}
                                    textAnchor="end"
                                    height={70}
                                    interval={intervalX}
                                />
                                <YAxis
                                    stroke="#E0E0E0"
                                    tickFormatter={formatarValor}
                                    label={{
                                    value: "Valor (USD)",
                                    angle: -90,
                                    stroke: "#E0E0E0",
                                    position: "insideLeft",
                                    offset: -10,
                                    }}
                                    tick={{ fontSize: 11 }}
                                />
                                <Tooltip
                                    formatter={(value: number) => formatarValor(value)}
                                    labelFormatter={(label) => `Mês: ${label}`}
                                    labelStyle={{ color: "#1e40af", fontWeight: "bold", fontSize: modalFontSizeSazo }}
                                    itemStyle={{ fontSize: modalFontSizeSazo }}
                                />
                                {/* <Legend content={<CustomLegend fontSize={16} />} /> */}
                                <Bar
                                    dataKey="exportacoes"
                                    name="Exportações"
                                    fill="rgb(35, 148, 20)"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="importacoes"
                                    name="Importações"
                                    fill="rgb(179, 15, 15)"
                                    radius={[4, 4, 0, 0]}
                                />
                                </BarChart>
                            </ResponsiveContainer>
                            </div>
                        </div>
                    <div className="mb-2 mt-6">
                        <CustomLegend
                            payload={[
                                { value: "Exportações", color: "rgb(35, 148, 20)" },
                                { value: "Importações", color: "rgb(179, 15, 15)" },
                            ]}
                            fontSize={legendFontSize}
                        />
                    </div>
                     
                </div>
                    ) : (
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={estatisticasAuxiliares.sazonalidade}
                            margin={{ top: 10, right: 12, left: 0, bottom: 40 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
                            <XAxis stroke="#E0E0E0" dataKey="mes" angle={-45} textAnchor="end" height={70} interval={intervalX}/>
                            <YAxis
                                stroke="#E0E0E0"
                                tickFormatter={formatarValor}
                                label={{ value: 'Valor (USD)', angle: -90, stroke: "#E0E0E0", position: 'insideLeft', offset: -10 }}
                                tick={{fontSize:11}}
                            />
                            <Tooltip
                                formatter={(value: number) => formatarValor(value)}
                                labelFormatter={(label) => `Mês: ${label}`}
                                labelStyle={{ color: ' #1e40af', fontWeight: 'bold' }}
                            />
                            <Legend content={<CustomLegend fontSize={16} />} />
                            <Bar dataKey="exportacoes" name="Exportações" fill="rgb(35, 148, 20)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="importacoes" name="Importações" fill="rgb(179, 15, 15)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                )}
            </div>
        );
    };

    const graficoConcentracao = (dadosConcentracao?: any) => {
        if (!dadosConcentracao?.length) return null;
        console.log("dadosConcentracao: ", dadosConcentracao)
        const CustomLegend = ({ payload, fontSize }: LegendProps & { fontSize: number }) => {
        return (
        <div className="w-full flex justify-center mt-1">
              <ul className="flex flex-col gap-1 sm:flex-row sm:gap-3 lg:flex-col lg:gap-1 2xl:flex-row 2xl:gap-3">
                {payload?.map((entry, index) => (
                  <li key={`item-${index}`} className="flex items-center text-white" style={{ fontSize }}>
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span>{entry.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            );
          };
        return (
            <div className="w-full  mt-6">
                <h3
                    className="text-lg font-medium mb-2 text-gray-300 cursor-pointer hover:underline"
                    onClick={() => setMostrarModalHhi(true)}
                >
                    Índice de Concentração (HHI)
                </h3>
                {mostrarModalHhi && <Hhi onClose={() => setMostrarModalHhi(false)} />}
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={dadosConcentracao}
                            margin={{ top: 10, right: 12, left: 0, bottom: 40 }}
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
                                stroke="#E0E0E0"
                                dataKey="ano"
                                angle={-45}
                                textAnchor="end"
                                height={70}
                                interval={"preserveStartEnd"}
                                // tickFormatter={(value) => {
                                //     const partes = value.split("-");
                                //     return `${partes[0]}-${partes[1]}`;
                                // }}
                            />
                            <YAxis
                                stroke="#E0E0E0"
                                domain={[0, 1]}
                                tickFormatter={(value) => value.toFixed(2)}
                                label={{ value: 'Índice HHI', angle: -90, stroke: "#E0E0E0", position: 'insideLeft', offset: -10 }}
                            />
                            <Tooltip
                                formatter={(value: number) => formatarHHI(value)}
                                labelFormatter={(label) => `Período: ${label}`}
                                labelStyle={{ color: '#1e40af', fontWeight: 'bold', fontSize: modalFontSizeHI }}
                                itemStyle={{ fontSize: modalFontSizeHI }}

                            />
                            <Legend content={<CustomLegend fontSize={legendFontSize} />} wrapperStyle={{ width: '100%', display: 'flex', justifyContent: 'center' }}/>

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
                            <ReferenceLine y={0.15} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: "Desconcentrado", fill: " #ced4da" }} />
                            <ReferenceLine y={0.25} stroke="#eab308" strokeDasharray="3 3" label={{ value: "Moderado", fill: " #ced4da" }} />
                            <ReferenceLine y={0.5} stroke="#dc2626" strokeDasharray="3 3" label={{ value: "Alta concentração", fill: " #ced4da" }} />
                        </AreaChart>

                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                        <span className="inline-block w-3 h-1 bg-red-600 mr-2"></span>
                        <span className="text-gray-300">HHI &lt; 0.15: Mercado não concentrado</span>
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-3 h-1 bg-red-600 mr-2"></span>
                        <span className="text-gray-300">0.15 ≤ HHI ≤ 0.25: Moderadamente concentrado</span>
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-3 h-1 bg-red-600 mr-2"></span>
                        <span className="text-gray-300">HHI &gt; 0.25: Altamente concentrado</span>
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
            <Loading/>
        );
    }

    if (error) {
        return (
            <div className="p-6 rounded-lg shadow">
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
        <div className="rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Análises Estatísticas Auxiliares</h2>

            {/* Tabs de navegação */}
            <div className={`${isMobile ? " " : "border-b border-gray-200"}`}>
                <nav className={`sm:flex -mb-px ${isMobile ? "flex-col space-y-2" : "grid grid-cols-2"}`}>
                    <button
                        onClick={() => trocarAba("sazonalidade")}
                        className={`mb-[1.5px] font-medium text-sm ${isMobile ? "px-3 py-[8.5px] shadow-md rounded-md w-full" : "py-4 px-0 sm:px-2 md:px-6"} ${abaAtiva === "sazonalidade"
                            ? isMobile ? "text-white bg-indigo-950" : "border-b-2 border-blue-500 text-blue-600" : isMobile ? "bg-indigo-600/10 text-white" : "text-white hover:text-gray-400 hover:border-gray-300"
                            }`}
                    >
                        Sazonalidade
                    </button>
                    <button
                        onClick={() => trocarAba("concentracao_pais")}
                        className={`mb-[1.5px] font-medium text-sm ${isMobile ? "px-3 py-[8.5px] shadow-md rounded-md w-full" : "py-4 px-0 sm:px-2 md:px-6"} ${abaAtiva === "concentracao_pais"
                            ? isMobile ? "text-white bg-indigo-950" : "border-b-2 border-blue-500 text-blue-600" : isMobile ? "bg-indigo-600/10 text-white" : "text-white hover:text-gray-400 hover:border-gray-300"
                            }`}
                    >
                        Concentração por país
                    </button>
                    <button
                        onClick={() => trocarAba("concentracao_estado")}
                            className={`mb-[1.5px] font-medium text-sm ${isMobile ? "px-3 py-[8.5px] shadow-md rounded-md w-full" : "py-4 px-0 sm:px-2 md:px-6"} ${abaAtiva === "concentracao_estado"
                            ? isMobile ? "text-white bg-indigo-950" : "border-b-2 border-blue-500 text-blue-600" : isMobile ? "bg-indigo-600/10 text-white" : "text-white hover:text-gray-400 hover:border-gray-300"
                            }`}
                    >
                        Concentração por estado
                    </button>
                    <button
                        onClick={() => trocarAba("concentracao_ncm")}
                        className={`mb-[1.5px] font-medium text-sm ${isMobile ? "px-3 py-[8.5px] shadow-md rounded-md w-full" : "py-4 px-0 sm:px-2 md:px-6"} ${abaAtiva === "concentracao_ncm"
                            ? isMobile ? "text-white bg-indigo-950" : "border-b-2 border-blue-500 text-blue-600" : isMobile ? "bg-indigo-600/10 text-white" : "text-white hover:text-gray-400 hover:border-gray-300"
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