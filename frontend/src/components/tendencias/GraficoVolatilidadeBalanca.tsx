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
    ReferenceLine
} from "recharts";
import { buscarVolatilidadeBalancaComercial } from "../../services/tendenciaServices";
import { formatarData } from "../../utils/formatarData";

type Props = {
    ncm?: number | null
    estado?: number | null;
    pais?: number | null;
};

export default function GraficoVolatilidadeBalanca({ ncm, estado, pais }: Props) {
    const [volatilidade, setVolatilidade] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);

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
    if (!volatilidade || volatilidade.length === 0)
        return <p>Nenhum dado de volatilidade disponível.</p>;

    return (
        <div className="rounded-lg p-5 w-full max-w-full" style={{ width: "100%", height: 400 }}>
            <p className="text-black">desvio padrão móvel em 6 meses do valor FOB</p>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={volatilidade}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ds"
                        type="category"
                        tickFormatter={(ds: string) => formatarData(ds)}
                        interval={11}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        tickFormatter={(value) => `${(value / 1e9)}`}
                        label={{ value: '$ (Bilhões)', angle: -90, position: 'insideLeft', offset: 10 }}
                    />
                    <Tooltip labelStyle={{ color: ' #1e40af', fontWeight: 'bold' }} />
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
                    <Line type="monotone" dataKey="volatilidade" stroke="rgb(51, 111, 207)" name="Volatilidade Balança Comercial" strokeWidth={2} dot={{ r: 1 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
