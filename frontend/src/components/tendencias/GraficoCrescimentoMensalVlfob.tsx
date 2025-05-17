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
} from "recharts";
import { buscarCrescimentoMensalVlFob } from "../../services/tendenciaServices";
import { formatarData } from "../../utils/formatarData";

type Props = {
    ncm?: number | null;
    estado?: number | null;
    pais?: number | null;
};

export function GraficoCrescimentoMensalVlfob({ ncm, estado, pais }: Props) {
    const [dados, setDados] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
    }, [estado, pais]);

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
    };
    if (!dados || dados.length === 0)
        return <p>Nenhum dado de crescimento mensal disponível.</p>;

    return (
        <div className="rounded-lg p-5 w-full max-w-full" style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dados}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="ds"
                        tick={{ fontSize: 11 }}
                        tickFormatter={(ds: string) => formatarData(ds)}
                    />
                    <YAxis tickFormatter={(tick) => `${tick}%`} />
                    <Tooltip
                        labelFormatter={(label) => `Data: ${formatarData(label as string)}`}
                        formatter={(value: any) => `${value.toFixed(2)}%`}
                        labelStyle={{ color: ' #1e40af', fontWeight: 'bold' }}
                    />
                    <Legend />
                    <ReferenceLine
                        x="2025-01-01"
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
                    <Line
                        type="monotone"
                        dataKey="crescimento_exp"
                        stroke="rgb(18, 148, 1)"
                        name="Crescimento Exportação (%)"
                        strokeWidth={2} dot={{ r: 1 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="crescimento_imp"
                        stroke=" rgb(255, 0, 0)"
                        name="Crescimento Importação (%)"
                        strokeWidth={2} dot={{ r: 1 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
