import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function formatarData(iso: string) {
    const date = new Date(Date.UTC(
        parseInt(iso.substring(0, 4)),
        parseInt(iso.substring(5, 7)),
        parseInt(iso.substring(8, 10))
    ));
    const mes = date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
    const ano = date.getFullYear();
    return `${mes.charAt(0).toUpperCase()}${mes.slice(1)}/${ano}`;
}

function transformarDados(histEstados: HistoricoEstados) {
    if (!histEstados) return [];

    const dataMap: { [ds: string]: any } = {};

    histEstados.forEach(({ estado, hist }) => {
        hist.forEach(({ ds, yhat }) => {
            if (!dataMap[ds]) {
                dataMap[ds] = { ds };
            }
            dataMap[ds][estado] = yhat;
        });
    });

    // Converte o mapa para um array e ordena pelas datas
    return Object.values(dataMap).sort((a, b) => new Date(a.ds).getTime() - new Date(b.ds).getTime());
}

interface HistoricoEstado {
    estado: string,
    hist: {
        ds: string,
        yhat: number
    }[]
}

type HistoricoEstados = HistoricoEstado[] | null;

type Props = {
    histEstados: HistoricoEstados,
    isLoading:boolean
}

const cores = [
    "#10b981", "#3b82f6", "#f59e0b", "#ef4444",
    "#8b5cf6", "#ec4899", "#14b8a6", "#f97316",
];

export default function GraficoHistEstados({ histEstados, isLoading }: Props) {
    const dados = transformarDados(histEstados);
    console.log("dados:", dados)
    return (
        <div className="bg-white rounded p-4 w-full max-w-full overflow-x-auto">
            <h3 className="text-center text-indigo-900 font-semibold mb-2">
                Histórico dos principais estados
            </h3>
            {isLoading ? (
                <>
                    <div className="flex flex-col items-center justify-center text-center text-lg text-indigo-900 font-bold mt-10">
                        <div className="h-5 w-5 mb-4 animate-spin rounded-full border-2 border-indigo-900 border-t-transparent"></div>
                        <span>Buscando...</span>
                    </div>
                </>
            ) : (null)}
            {histEstados &&

                <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        data={dados}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="ds"
                            type="category"
                            tickFormatter={(ds: string) => formatarData(ds)}
                            interval={11}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            tickFormatter={(value) => `${(value / 1e9).toFixed(2)}`}
                            label={{ value: '$ (Bilhões)', angle: -90, position: 'insideLeft', offset: 10 }}
                        />
                        <Tooltip
                            labelFormatter={(label) => `Data: ${formatarData(label as string)}`}
                            formatter={(value: number) => `$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            labelClassName=''
                            labelStyle={{ color: '#1e40af', fontWeight: 'bold' }}
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
                        {Array.isArray(histEstados) && histEstados.length > 0 && histEstados.map((estado, index) => (
                            <Line
                                key={estado.estado} // <- aqui você já tem uma key, mas...
                                type="monotone"
                                dataKey={estado.estado}
                                // data={estado.hist}
                                name={estado.estado}
                                stroke={cores[index % cores.length]}
                                strokeWidth={2}
                                dot={{ r: 1 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            }
        </div>
    );
}