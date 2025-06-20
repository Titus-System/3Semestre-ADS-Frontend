import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    LegendProps
} from "recharts";
import { buscarVolatilidadeBalancaComercial } from "../../services/tendenciaServices";
import { formatarData } from "../../utils/formatarData";
import ModalVolatilidade from "../modais/ModalVolatilidade";
import { formatarValor } from "../../utils/formatarValor";
import Loading from "../loading";

type Props = {
    ncm?: number | null
    estado?: number | null;
    pais?: number | null;
};

export default function GraficoVolatilidadeBalanca({ ncm, estado, pais }: Props) {
    const [volatilidade, setVolatilidade] = useState<any[]>([]);
    const [exibirModal, setExibirModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fontSizeX, setFontSizeX] = useState(12);
    const [intervalX, setIntervalX] = useState(23);
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [legendFontSize, setLegendFontSize] = useState(14);
    const [modalFontSize, setModalFontSize] = useState(14);

    useEffect(() => {
        const handleResize = () => {
            setModalFontSize(window.innerWidth < 338 ? 7 : window.innerWidth < 360 ? 8 : window.innerWidth < 388 ? 9 : window.innerWidth < 415 ? 10 : window.innerWidth < 440 ? 11 : window.innerWidth < 465 ? 12 : window.innerWidth < 500 ? 13 : 14);
            setFontSizeX(window.innerWidth < 370 ? 10 : window.innerWidth < 580 ? 11 : 12);
            setIntervalX(window.innerWidth < 323 ? 71 : window.innerWidth < 540 ? 46 : 23);
            setStrokeWidth(window.innerWidth < 400 ? 1 : 2);
            setLegendFontSize(window.innerWidth < 265 ? 10 : window.innerWidth < 305 ? 11 : window.innerWidth < 640 ? 13 : 14);
        };

        handleResize(); // Executa no carregamento
        window.addEventListener("resize", handleResize); // Escuta mudanças de tamanho

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        async function fetchVolatilidade() {
            setLoading(true);
            try {
                const [balanca] = await Promise.all([
                    buscarVolatilidadeBalancaComercial(ncm, estado, pais)
                ]);

                // Combina os dados por data
                const dadosCombinados: Record<string, any> = {};

                balanca.forEach((item: any) => {
                    dadosCombinados[item.ds] = { ds: item.ds, volatilidade: item.yhat };
                });
                const resultadoFinal = Object.values(dadosCombinados).sort(
                    (a: any, b: any) => new Date(a.ds).getTime() - new Date(b.ds).getTime()
                );

                setVolatilidade(resultadoFinal);
            } catch (error) {
                console.error("Erro ao buscar volatilidade:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchVolatilidade();
    }, [estado, pais, ncm]);

    if (loading) {
        return (
            <Loading/>
        );
    };
    if (!volatilidade || volatilidade.length === 0)
        return <p>Nenhum dado de volatilidade disponível.</p>;

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
        <div className="w-full max-w-full" style={{ width: "100%", height: 400 }}>
            <h3
                className="text-lg font-medium mb-2 text-gray-300 cursor-pointer hover:underline"
                onClick={() => setExibirModal(true)}
            >
                Volatilidade
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={volatilidade} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ds"
                        height={55}
                        stroke="#E0E0E0"
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
                    <Tooltip labelStyle={{ color: ' #1e40af', fontWeight: 'bold', fontSize: modalFontSize }} itemStyle={{ fontSize: modalFontSize }} />
                    <Legend content={<CustomLegend fontSize={legendFontSize} />} wrapperStyle={{ width: '100%', display: 'flex', justifyContent: 'center' }} />
                    <ReferenceLine
                        x="2025-05-01"
                        stroke="red"
                        strokeDasharray="3 3"
                        label={{
                            value: "Projeção",
                            position: "top",
                            angle: 0,
                            fontSize: 12,
                            fill: "red",
                            fontWeight: 700
                        }}
                        strokeWidth={2}
                    />
                    <Line type="monotone" dataKey="volatilidade" stroke="rgb(124, 207, 255)" name="Volatilidade Balança Comercial" strokeWidth={strokeWidth} dot={{ r: 1 }} />
                </LineChart>
            </ResponsiveContainer>
            {exibirModal && <ModalVolatilidade onClose={() => setExibirModal(false)} />}
        </div>
    );
}
