import { useEffect, useState } from "react";
import { Estado, Mercadoria, Pais } from "../../models/interfaces";
import { buscarTendenciaVlFob } from "../../services/tendenciaServices";
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatarData } from "../../utils/formatarData";

type Props = {
    tipo?: 'exp' | 'imp' | null
    estados: Estado[] | null;
    pais?: Pais | null;
    ncm?: Mercadoria | null;
}

interface HistoricoEstado {
    estado: string,
    hist: {
        ds: string,
        yhat: number
    }[]
}

type HistoricoEstados = HistoricoEstado[] | null;


async function buscarHistVlFob({ tipo, estados, pais, ncm }: Props) {
    if (!estados) {
        return null
    }
    const histEstados: HistoricoEstados = []
    const limite = Math.min(estados.length, 5);
    for (let i = 0; i < limite; i++) {
        const hist = await buscarTendenciaVlFob(
            tipo ? tipo : "exp",
            estados[i].id_estado,
            pais?.id_pais,
            ncm?.id_ncm
        );
        histEstados.push({
            estado: estados[i].sigla,
            hist: hist
        });
    }
    return histEstados;
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

async function buscarHistEstados({ tipo, estados, pais, ncm }: Props) {
    const histEstados: HistoricoEstados = await buscarHistVlFob({ tipo, estados, pais, ncm });
    return transformarDados(histEstados);
}

const cores = [
    "#10b981", "#3b82f6", "#f59e0b", "#ef4444",
    "#8b5cf6", "#ec4899", "#14b8a6", "#f97316",
];

function formataTitulo(tipo?: string | null, pais?: Pais | null, ncm?: Mercadoria | null) {
    let titulo = `Histórico dos estados que mais ${tipo ? tipo : 'exp'}ortaram`
    if (ncm) { titulo = `${titulo} ${ncm.descricao}` }
    if (pais) {
        if (tipo == 'imp') {
            titulo = `${titulo} de ${pais.nome}`
        } else {
            titulo = `${titulo} para ${pais.nome}`
        }
    }
    return titulo
}


export default function GraficoHistEstados({ tipo, estados, pais, ncm }: Props) {
    const [dados, setDados] = useState<any[]>();
    const [titulo, setTitulo] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const buscarDados = async () => {
            setIsLoading(true);
            const hist = await buscarHistEstados({ tipo, estados, pais, ncm });
            if (hist) {
                setDados(hist)
            }
            setTitulo(formataTitulo(tipo, pais, ncm))
            setIsLoading(false);
        };
        buscarDados();
    }, [tipo, estados, pais, ncm])

    if (isLoading) {
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

    return (
        <div className="bg-white rounded p-4 w-full max-w-full overflow-x-auto">
            <h3 className="text-center text-indigo-900 font-semibold mb-2">
                {titulo}
            </h3>


            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={dados}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
                        label={{
                            value: '$ (Bilhões)',
                            angle: -90,
                            position: 'insideLeft',
                            offset: 10
                        }}
                    />
                    <Tooltip
                        labelFormatter={(label) => `Data: ${formatarData(label as string)}`}
                        formatter={(value: number) =>
                            `$ ${value.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}`
                        }
                        labelClassName=""
                        labelStyle={{ color: '#1e40af', fontWeight: 'bold' }}
                    />
                    <Legend />
                    <ReferenceLine
                        x="2025-01-01"
                        stroke="red"
                        strokeDasharray="3 3"
                        label={{
                            value: 'Projeção',
                            position: 'top',
                            angle: 0,
                            fontSize: 12,
                            fill: 'red'
                        }}
                    />

                    {/* Mapeando os nomes dos estados a partir do primeiro item */}
                    {dados && dados.length > 0 &&
                        Object.keys(dados[0])
                            .filter((key) => key !== 'ds')
                            .map((estado, index) => (
                                <Line
                                    key={estado}
                                    type="monotone"
                                    dataKey={estado}
                                    name={estado}
                                    stroke={cores[index % cores.length]}
                                    strokeWidth={2}
                                    dot={{ r: 1 }}
                                />
                            ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

}