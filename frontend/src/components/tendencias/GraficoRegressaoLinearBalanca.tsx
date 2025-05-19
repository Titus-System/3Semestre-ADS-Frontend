import { useEffect, useState } from "react";
import { buscarRegressaoLinearBalanca } from "../../services/tendenciaServices";
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatarData } from "../../utils/formatarData";
import ModalRegressaoLinear from "../modais/ModalRegressaoLinear";

type Props = {
    ncm?: number | null;
    estado?: number | null;
    pais?: number | null;
};

export default function GraficoRegressaoLinearBalanca({ ncm, estado, pais }: Props) {
    const [dados, setDados] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [exibirModal, setExibirModal] = useState(false);

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
    if (!dados || dados.length === 0) return <p>Nenhum dado disponível.</p>;

    return (
        <div className="w-full max-w-full">
            <h3
                className="text-lg font-medium mb-2 text-gray-700 cursor-pointer hover:underline"
                onClick={() => setExibirModal(true)}
            >
                Regressão Linear
            </h3>
            {exibirModal && <ModalRegressaoLinear onClose={() => setExibirModal(false)} />}
            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dados} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="ds"
                            type="category"
                            tickFormatter={(ds: string) => formatarData(ds)}
                            interval={11}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            tickFormatter={(value) => `${(value / 1e9)}`}
                            label={{ value: '$ (Bilhões)', angle: -90, position: 'insideLeft', offset: 10 }}
                        />
                        <Tooltip
                            labelFormatter={(label) => `Data: ${formatarData(label as string)}`}
                            formatter={(value: number) => `$ ${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`}
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
                        <Line type="monotone" dataKey="y_real" stroke="rgb(51, 111, 207)" name="Balança Comercial Real" strokeWidth={2} dot={{ r: 1 }} />
                        <Line type="monotone" dataKey="y_regressao" stroke="rgb(102, 158, 231)" name="Balança (Regressão)" strokeWidth={2} dot={{ r: 2 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}