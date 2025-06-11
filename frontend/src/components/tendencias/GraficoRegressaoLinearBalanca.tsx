import { useEffect, useState } from "react";
import { buscarRegressaoLinearBalanca } from "../../services/tendenciaServices";
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis, LegendProps } from "recharts";
import { formatarData } from "../../utils/formatarData";
import ModalRegressaoLinear from "../modais/ModalRegressaoLinear";
import { formatarValor } from "../../utils/formatarValor";
import Loading from "../loading";

type Props = {
    ncm?: number | null;
    estado?: number | null;
    pais?: number | null;
};

export default function GraficoRegressaoLinearBalanca({ ncm, estado, pais }: Props) {
    const [dados, setDados] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [exibirModal, setExibirModal] = useState(false);
    const [fontSizeX, setFontSizeX] = useState(12);
    const [legendFontSize, setLegendFontSize] = useState(14);
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [intervalX, setIntervalX] = useState(23);

    useEffect(() => {
        const handleResize = () => {
            setFontSizeX(window.innerWidth < 387 ? 10 : window.innerWidth < 510 ? 11 : 12);
            setLegendFontSize(window.innerWidth < 305 ? 10 : window.innerWidth < 640 ? 12 : 14);
            setStrokeWidth(window.innerWidth < 400 ? 1 : 2);
            setIntervalX(window.innerWidth < 315 ? 60 : window.innerWidth < 370 ? 42 : window.innerWidth < 482 ? 35 : 23);
        };

        handleResize(); // Executa no carregamento
        window.addEventListener("resize", handleResize); // Escuta mudanças de tamanho

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [balanca] = await Promise.all([
                    buscarRegressaoLinearBalanca(ncm, estado, pais)
                ]);
                const dadosTratados = balanca.dados.map((item: any) => {
                    return {
                        ds: item.ds,
                        y_real: item.y_real,
                        y_regressao: item.y_regressao,
                    };
                });
                setDados(dadosTratados);
            } catch (error) {
                console.error("Erro ao buscar dados de regressão linear:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [estado, pais, ncm]);

    if (loading) {
        return (
            <Loading/>
        );
    };
    if (!dados || dados.length === 0) return <p>Nenhum dado disponível.</p>;

    const CustomLegend = ({ payload, fontSize }: LegendProps & { fontSize: number }) => {
            return (
            <div className="w-full flex justify-center">
                  <ul className="flex flex-col gap-y-1 sm:flex-row sm:gap-x-3 lg:flex-col lg:gap-y-1 2xl:flex-row 2xl:gap-x-3">
                    {payload?.map((entry, index) => (
                      <li key={`item-${index}`} className="flex items-center" style={{ fontSize }}>
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
        <div className="w-full max-w-full">
            <h3
                className="text-lg font-medium mb-2 text-gray-300 cursor-pointer hover:underline"
                onClick={() => setExibirModal(true)}
            >
                Regressão Linear
            </h3>
            {exibirModal && <ModalRegressaoLinear onClose={() => setExibirModal(false)} />}
            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dados} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            stroke="#E0E0E0"
                            dataKey="ds"
                            // angle={-45}
                            height={55}
                            type="category"
                            tickFormatter={(ds: string) => formatarData(ds)}
                            interval={intervalX}
                            tick={{ fontSize: fontSizeX }}
                        />
                        <YAxis
                        stroke="#E0E0E0"
                        tickFormatter={formatarValor}
                        label={{ value: '$', angle: -90, position: 'insideLeft', stroke: "#E0E0E0", offset: -10 }}
                        tick={{fontSize:11}}
                        />
                        <Tooltip
                            labelFormatter={(label) => `Data: ${formatarData(label as string)}`}
                            formatter={(value: number) => `$ ${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`}
                            labelStyle={{ color: ' #1e40af', fontWeight: 'bold' }}
                        />
                        <Legend content={<CustomLegend fontSize={legendFontSize} />} />
                        <ReferenceLine
                            x="2025-05-01"
                            stroke="red"
                            strokeDasharray="3 3"
                            label={{
                                value: "Projeção",
                                position: "top",
                                angle: 0,
                                fontSize: 12,
                                fill: "red"
                            }}
                        />
                        <Line type="monotone" dataKey="y_real" stroke="rgb(124, 207, 255)" name="Balança Comercial Real" strokeWidth={strokeWidth} dot={{ r: 1 }} />
                        <Line type="monotone" dataKey="y_regressao" stroke="rgb(143, 141, 255)" name="Balança (Regressão)" strokeWidth={strokeWidth} dot={{ r: 2 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}