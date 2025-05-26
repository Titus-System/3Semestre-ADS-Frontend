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
import { buscarCrescimentoMensalVlFob } from "../../services/tendenciaServices";
import { formatarData } from "../../utils/formatarData";
import ModalCrescimentoMensal from "../modais/ModalCrescimentoMensal";

type Props = {
    ncm?: number | null;
    estado?: number | null;
    pais?: number | null;
};

export function GraficoCrescimentoMensalVlfob({ ncm, estado, pais }: Props) {
    const [dados, setDados] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [exibirModal, setExibirModal] = useState(false);
    const [fontSizeX, setFontSizeX] = useState(12);
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [intervalX, setIntervalX] = useState(23);
    const [legendFontSize, setLegendFontSize] = useState(14);

     useEffect(() => {
        const handleResize = () => {
            setFontSizeX(window.innerWidth < 387 ? 10 : window.innerWidth < 510 ? 11 : 12);
            setStrokeWidth(window.innerWidth < 400 ? 1 : 2);
            setIntervalX(window.innerWidth < 319 ? 71 : window.innerWidth < 392 ? 47 : window.innerWidth < 528 ? 35 : 23);
            setLegendFontSize(window.innerWidth < 305 ? 10 : window.innerWidth < 640 ? 12 : 14);
        };

        handleResize(); // Executa no carregamento
        window.addEventListener("resize", handleResize); // Escuta mudanças de tamanho

        return () => window.removeEventListener("resize", handleResize);
    }, []);


    useEffect(() => {
        async function fetchCrescimento() {
            setLoading(true);
            try {
                const [exp, imp] = await Promise.all([
                    buscarCrescimentoMensalVlFob("exp", ncm, estado, pais),
                    buscarCrescimentoMensalVlFob("imp", ncm, estado, pais),
                ]);

                // Combina os dados por data
                const dadosCombinados: Record<string, any> = {};

                exp.forEach((item: any) => {
                    dadosCombinados[item.ds] = {
                        ds: item.ds,
                        crescimento_exp: item.yhat,
                    };
                });

                imp.forEach((item: any) => {
                    if (!dadosCombinados[item.ds]) {
                        dadosCombinados[item.ds] = { ds: item.ds };
                    }
                    dadosCombinados[item.ds].crescimento_imp = item.yhat;
                });

                const resultadoFinal = Object.values(dadosCombinados).sort(
                    (a: any, b: any) => new Date(a.ds).getTime() - new Date(b.ds).getTime()
                );

                setDados(resultadoFinal);
            } catch (error) {
                console.error("Erro ao buscar crescimento mensal:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchCrescimento();
    }, [estado, pais, ncm]);

    if (loading) {
        return (
            <div className="p-6 bg-transparent rounded-lg shadow">
                <div className="flex justify-center items-center h-64">
                    <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </div>
        );
    };
    if (!dados || dados.length === 0)
        return <p className="text-gray-300">Nenhum dado de crescimento mensal disponível.</p>;

      const CustomLegend = ({ payload, fontSize }: LegendProps & { fontSize: number }) => {
        return (
        <div className="w-full flex justify-center mt-1">
              <ul className="flex flex-col gap-y-1 sm:flex-row sm:gap-x-3 lg:flex-col lg:gap-y-1 2xl:flex-row 2xl:gap-x-3">
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
        <div className="w-full max-w-full" style={{ width: "100%", height: 400 }}>
            <h3
                className="text-lg font-medium mb-2 text-gray-300 cursor-pointer hover:underline"
                onClick={() => setExibirModal(true)}
            >
                Crescimento Mensal
            </h3>
            {exibirModal && <ModalCrescimentoMensal onClose={() => setExibirModal(false)} />}
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dados} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        stroke="#E0E0E0"
                        dataKey="ds"
                        tick={{ fontSize: fontSizeX }}
                        tickFormatter={(ds: string) => formatarData(ds)}
                        interval={intervalX}
                    />
                    <YAxis tickFormatter={(tick) => `${tick}%`} stroke="#E0E0E0" tick={{ fontSize: 11 }}/>
                    <Tooltip
                        labelFormatter={(label) => `Data: ${formatarData(label as string)}`}
                        formatter={(value: any) => `${value.toFixed(2)}%`}
                        labelStyle={{ color: ' #1e40af', fontWeight: 'bold' }}
                    />
                    <Legend content={<CustomLegend fontSize={legendFontSize} />} />
                    <ReferenceLine
                        x="2025-01-01"
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
                    <Line
                        type="monotone"
                        dataKey="crescimento_exp"
                        stroke="rgb(18, 148, 1)"
                        name="Crescimento Exportação (%)"
                        strokeWidth={strokeWidth} dot={{ r: 1 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="crescimento_imp"
                        stroke=" rgb(255, 0, 0)"
                        name="Crescimento Importação (%)"
                        strokeWidth={strokeWidth} dot={{ r: 1 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
