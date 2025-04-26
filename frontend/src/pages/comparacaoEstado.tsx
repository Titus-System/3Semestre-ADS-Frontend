import { useState, useEffect } from "react";
import { FaShip, FaPlane, FaGlobe, FaBox, FaTrain, FaRoad, FaWater, FaBroadcastTower } from "react-icons/fa";
import { IoBoat } from "react-icons/io5";
import { GiPipes } from "react-icons/gi";
import { BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer } from "recharts";
import geoData from "../assets/br_states.json";
import type { FeatureCollection } from "geojson";
import codigos_consulta from "../assets/codigos_consulta.json"
import { busca_top_estados } from "../services/estadoService";

import "../index.css"


const Categorias = () => {
    const [categorias, setCategorias] = useState(Object.keys(codigos_consulta));
}
// Extrai nomes dos estados
const estados = (geoData as FeatureCollection).features.map(
    (feature) => feature.properties?.Estado || "Desconhecido"
);

export default function ComparacaoEstados() {
    const transportModes = [
        { id: "fluvial", icon: <FaWater size={30} />, codigo: 2 },
        { id: "aéreo", icon: <FaPlane size={30} />, codigo: 4 },
        { id: "vicinal fronteirico", icon: <FaGlobe size={30} />, codigo: 15 },
        { id: "postal", icon: <FaBox size={30} />, codigo: 5 },
        { id: "maritimas", icon: <FaShip size={30} />, codigo: 1 },
        { id: "ferroviario", icon: <FaTrain size={30} />, codigo: 6 },
        { id: "rodoviario", icon: <FaRoad size={30} />, codigo: 7 },
        { id: "lacustre", icon: <IoBoat size={30} />, codigo: 3 },
        { id: "rede de transmissão", icon: <FaBroadcastTower size={30} />, codigo: 8 },
        { id: "dutos", icon: <GiPipes className="text-gray-800 w-8 h-8" />, codigo: 14 },
    ];

    const [selectedModes, setSelectedModes] = useState<number[]>([]);
    const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
    const [mercadoria, setMercadoria] = useState("");
    const [tipoProcesso, setTipoProcesso] = useState<"exp" | "imp" | null>(null);
    const [graficoData, setGraficoData] = useState<any[]>([]);
    const [exibirGrafico, setExibirGrafico] = useState(false);

    const toggleModeSelection = (id: number) => {
        setSelectedModes((prev) =>
            prev.includes(id) ? prev.filter((mode) => mode !== id) : [...prev, id]
        );
    };

    const togglePeriodSelection = (id: number) => {
        setSelectedPeriods((prev) =>
            prev.includes(id) ? prev.filter((period) => period !== id) : [...prev, id]
        );
    };

    const analysisPeriod = Array.from({ length: 11 }, (_, i) => ({
        id: 2014 + i,
        label: `${2014 + i}`,
    }));

    const handleTipoProcessoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTipoProcesso(event.target.value as "exp" | "imp");
    };

    const anoMaisProximo = selectedPeriods.length > 0
        ? selectedPeriods.some((ano) => ano >= 2023)
            ? 2022
            : selectedPeriods.reduce((prev, curr) =>
                Math.abs(curr - 2022) < Math.abs(prev - 2022) ? curr : prev
            )
        : 2022;

    const busca_top_estado = async () => {
        const anosSelecionados = selectedPeriods.length > 0
            ? selectedPeriods.map(Number)
            : Array.from({ length: 2024 - 2014 + 1 }, (_, i) => 2014 + i);

        const ncmDigitado = mercadoria.trim();
        const viasSelecionadas = selectedModes.length > 0 ? selectedModes : undefined;
        const tipoSelecionado = tipoProcesso || "exp"; // fallback se não selecionado

        try {
            const respostaApi = await busca_top_estados(
                tipoSelecionado, // Tipos de processo
                27, // Quantidade de estados
                anosSelecionados, // Anos selecionados
                undefined, // Meses não utilizados
                ncmDigitado ? [Number(ncmDigitado)] : undefined, // NCM digitado
                undefined, // Países não utilizados
                viasSelecionadas, // Vias selecionadas
                undefined, // URFs não utilizados
                undefined, // Municípios não utilizados
                0 // Crescente
            );

            console.log("🔎 Resultado da função buscarRankingEstados:", respostaApi);

            if (!respostaApi || respostaApi.length === 0) {
                console.warn("⚠️ Resposta vazia da função buscarRankingEstados.");
                return;
            }

            // Processando os dados da resposta para o gráfico de comparação
            const dadosGrafico = respostaApi[0].dados

            console.log("grafico data:", dadosGrafico)
            // Atualiza o estado com os dados para renderizar no gráfico
            setGraficoData(dadosGrafico);

        } catch (erro) {
            console.error("❌ Erro ao buscar ranking de estados:", erro);
        }
    };

    const handleClickGerarGrafico = async () => {
        await busca_top_estado();
        setExibirGrafico(true);
    }

    const maxValor = graficoData.length > 0
        ? Math.max(...graficoData.map(item => item.total_valor_fob))
        : 0;

    return (
        <div className="flex flex-col items-center min-h-screen bg-[#656586] p-4 sm:p-6">
            <div className="w-full max-w-[1200px] mx-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-6 mb-4 text-center">
                    Comparação dos Estados
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex flex-col space-y-2 w-full">
                        <label className="text-black text-xl font-semibold">Defina a mercadoria:</label>
                        <input
                            type="text"
                            value={mercadoria}
                            onChange={(e) => setMercadoria(e.target.value)}
                            className="bg-white text-gray-900 text-md font-medium p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-16"
                        />
                    </div>

                    <div className="flex flex-col w-full space-y-2">
                        <label className="text-black text-xl font-semibold">Tipo de processo:</label>
                        <div className="inline-flex rounded-md shadow-sm">
                            <button
                                onClick={() => setTipoProcesso("exp")}
                                className={`p-3 border border-gray-300 rounded-l-full w-1/2 h-16 font-bold ${tipoProcesso === "exp"
                                    ? "bg-gray-900 text-white"
                                    : "bg-white text-gray-900 hover:bg-gray-300"
                                    }`}
                            >
                                Exportação
                            </button>
                            <button
                                onClick={() => setTipoProcesso("imp")}
                                className={`p-3 border border-gray-300 border-l-0 rounded-r-full w-1/2 h-16 font-bold ${tipoProcesso === "imp"
                                    ? "bg-gray-900 text-white"
                                    : "bg-white text-gray-900 hover:bg-gray-300"
                                    }`}
                            >
                                Importação
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal de Transporte */}
                <div className="flex flex-col space-y-4 h-auto w-full max-w-7xl mt-6">
                    <p className="text-black text-xl font-semibold text-center">Defina o modal de transporte</p>

                    {/* Dropdown para telas menores */}
                    <div className="block md:hidden">
                        <select
                            className="bg-white text-gray-900 text-md font-medium p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-16 w-full appearance-none pr-10"
                            onChange={(e) => toggleModeSelection(parseInt(e.target.value))}
                        >
                            <option value="">Selecione um modal</option>
                            {transportModes.map((mode) => (
                                <option key={mode.codigo} value={mode.codigo}>
                                    {mode.id.charAt(0).toUpperCase() + mode.id.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Botões para telas maiores */}
                    <div className="hidden md:flex bg-white text-gray-900 font-bold p-3 border border-gray-300 rounded-full shadow-md justify-center w-full gap-3">
                        {transportModes.map((mode) => {
                            const isSelected = selectedModes.includes(mode.codigo);
                            return (
                                <button
                                    key={mode.codigo}
                                    className={`relative group p-3 rounded-full text-xl transition-all duration-200 ${isSelected
                                        ? "bg-gray-900 text-white border-2 border-white"
                                        : "text-gray-700 hover:bg-gray-200"
                                        }`}
                                    onClick={() => toggleModeSelection(mode.codigo)}
                                >
                                    {mode.icon}
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                        {mode.id.charAt(0).toUpperCase() + mode.id.slice(1)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Período de Análise */}
                <div className="flex flex-col space-y-2 h-auto w-full max-w-7xl mt-6">
                    <p className="text-black text-xl font-semibold text-center">Defina o período de análise</p>

                    {/* Dropdown para telas menores */}
                    <div className="block md:hidden">
                        <select
                            className="bg-white text-gray-900 text-md font-medium p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-16 w-full"
                            onChange={(e) => togglePeriodSelection(parseInt(e.target.value))}
                        >
                            <option value="">Selecione o período</option>
                            {analysisPeriod.map((period) => (
                                <option key={period.id} value={period.id}>
                                    {period.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Botões para telas maiores */}
                    <div className="hidden md:flex bg-white text-gray-900 font-bold p-3 border border-gray-300 rounded-full shadow-md flex-wrap justify-center w-full gap-3">
                        {analysisPeriod.map((period) => {
                            const isSelected = selectedPeriods.includes(period.id);
                            return (
                                <button
                                    key={period.id}
                                    className={`px-1 py-2 rounded-full transition-all duration-200 ${isSelected
                                        ? "bg-gray-900 text-white border-2 border-white"
                                        : "text-gray-700 hover:bg-gray-200"
                                        }`}
                                    onClick={() => togglePeriodSelection(period.id)}
                                >
                                    {period.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex flex-col space-y-4 w-full mt-8">
                <button className="bg-gray-900 text-white text-sm sm:text-md font-bold p-2 sm:p-3 rounded-full shadow-md hover:bg-[#11114E] w-[200px] sm:w-1/4 mx-auto"
                    onClick={handleClickGerarGrafico}
                >
                    Gerar Gráfico
                </button>
            </div>

            {exibirGrafico && graficoData.length > 0 ? (
                <div className="bg-indigo-950 p-7 rounded-2xl shadow-xl w-full space-y-6 text-white mt-6">
                    <div className="bg-white p-7 rounded-2xl shadow-xl w-full space-y-10 text-white mt-6">
                        <h2 className="text-center text-xl font-bold text-indigo-950">
                            Gráfico de Comparação de Valores entre os Estados
                        </h2>
                        <div className="mt-8 w-full mx-auto">
                            {/* Gráfico para telas maiores */}
                            <div className="hidden md:block">
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={graficoData} margin={{ left: 70 }}>
                                        <XAxis dataKey="sigla_estado" tick={{ fill: "#11114E" }} />
                                        <YAxis tick={{ fill: "#11114E" }} domain={[0, Math.ceil(maxValor * 1.1)]} tickFormatter={(value) => { return Math.round(value).toString() }} />
                                        <ChartTooltip />
                                        <Bar dataKey="total_valor_fob" fill="#11114E" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Gráfico para telas menores */}
                            <div className="block md:hidden">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={graficoData} margin={{ left: 50 }}>
                                        <XAxis dataKey="sigla_estado" tick={{ fill: "#11114E" }} />
                                        <YAxis tick={{ fill: "#11114E" }} domain={[0, Math.ceil(maxValor * 1.1)]} tickFormatter={(value) => { return Math.round(value).toString() }} />
                                        <ChartTooltip />
                                        <Bar dataKey="total_valor_fob" fill="#11114E" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

        </div>
    );
}
