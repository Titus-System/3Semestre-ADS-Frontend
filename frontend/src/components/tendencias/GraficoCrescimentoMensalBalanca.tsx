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
import { buscarCrescimentoMensalBalancaComercial } from "../../services/tendenciaServices";
import { formatarData } from "../../utils/formatarData";
import ModalCrescimentoMensal from "../modais/ModalCrescimentoMensal";

type Props = {
    ncm?: number | null
    estado?: number | null;
    pais?: number | null;
};

export function GraficoCrescimentoMensalBalanca({ ncm, estado, pais }: Props) {
    const [dados, setDados] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [exibirModal, setExibirModal] = useState(false);

    useEffect(() => {
        async function fetchCrescimento() {
            setLoading(true);
            try {
                const [balanca] = await Promise.all([
                    buscarCrescimentoMensalBalancaComercial(ncm, estado, pais)
                ]);

                // Combina os dados por data
                const dadosCombinados: Record<string, any> = {};

                balanca.forEach((item: any) => {
                    dadosCombinados[item.ds] = {
                        ds: item.ds,
                        crescimento: item.yhat,
                    };
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
        <div className="w-full max-w-full">
            <h3
                className="text-lg font-medium mb-2 text-gray-700 cursor-pointer hover:underline"
                onClick={() => setExibirModal(true)}
            >
                Crescimento Mensal
            </h3>
            {exibirModal && <ModalCrescimentoMensal onClose={() => setExibirModal(false)} />}
            <div className="h-[400px]">

                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dados} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="ds"
                            tick={{ fontSize: 11 }}
                            tickFormatter={(ds: string) => formatarData(ds)}
                            interval={23}
                            
                        />
                        <YAxis
                            tickFormatter={(tick) => `${tick}%`}
                            label={{ value: '$', angle: -90, position: 'insideLeft', offset: -10 }}
                            tick={{ fontSize: 11 }}
                        />
                        <Tooltip
                            labelFormatter={(label) => `Data: ${formatarData(label as string)}`}
                            formatter={(value: any) => `${value.toFixed(2)}%`}
                            labelStyle={{ color: ' #1e40af', fontWeight: 'bold' }}
                        />
                        <Legend 

                        />
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
                            dataKey="crescimento"
                            stroke="rgb(51, 111, 207)"
                            name="Crescimento (%)"
                            strokeWidth={2} dot={{ r: 1 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
