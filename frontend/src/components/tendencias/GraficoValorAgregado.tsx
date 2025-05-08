import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine
} from 'recharts';

interface DadoPrevisao {
    ds: string;
    yhat: number;
}

interface Props {
    dados: DadoPrevisao[];
    tipo?: string;
    estado?: string;
    pais?: string
}

function formatarData(iso: string) {
    const date = new Date(Date.UTC(
        parseInt(iso.substring(0, 4)), // Ano
        parseInt(iso.substring(5, 7)), // Mês (0 é janeiro, 11 é dezembro)
        parseInt(iso.substring(8, 10)) // Dia
    ));
    const mes = date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
    const ano = date.getFullYear();
    return `${mes.charAt(0).toUpperCase()}${mes.slice(1)}/${ano}`;
}

function formatarTitulo(tipo?:string, estado?:string, pais?:string){
    let complemento = ``
    if (estado) {
        complemento = `${estado}`
    } else {
        complemento = `Brasil`
    }
    if (pais) {
        complemento = `${complemento} em relação ao país ${pais}`
    }
    return `Valor Agregado médio de ${tipo}: ${complemento}`
}


export default function GraficoValorAgregado({ dados, tipo, estado, pais }: Props) {    
    const tituloGrafico = formatarTitulo(estado, pais)
    const LIMIAR_PREVISAO = new Date("2025-01-01");

    const dadosComMes = dados?.map((item) => ({
        ...item,
        mes: formatarData(item.ds),
        historico: new Date(item.ds) < LIMIAR_PREVISAO ? item.yhat : null,
        previsao: new Date(item.ds) >= LIMIAR_PREVISAO ? item.yhat : null
    }));

    const pontoDivisao = dadosComMes?.find((d) => d.previsao !== null);

    return (
        <div className="bg-white rounded-lg p-4 shadow-md w-full h-[400px]">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{tituloGrafico}</h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={dadosComMes?.filter(d => d.historico !== null || d.previsao !== null)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="ds"
                        tickFormatter={(ds: string) => formatarData(ds)}
                        interval={11}
                        tick={{ fontSize: 12 }}

                    />
                    <YAxis
                        tickFormatter={(value) => `${(value / 1e9)}`}
                        label={{ value: '$ (Bilhões)', angle: -90, position: 'insideLeft', offset: 10 }}
                    />
                    <Tooltip formatter={(value: number) => `$ ${value?.toLocaleString('pt-BR')}`} />
                    <Legend />

                    {/* Linha Histórica */}
                    <Line
                        type="monotone"
                        dataKey="historico"
                        name={tipo}
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ r: 2 }}
                        connectNulls={false}
                    />

                    {/* Linha de Previsão */}
                    <Line
                        type="monotone"
                        dataKey="previsao"
                        name="Previsão (SARIMA)"
                        stroke="#f97316"
                        strokeWidth={3}
                        strokeDasharray="6 4"
                        dot={{ r: 1 }}
                        connectNulls={false}
                    />

                    {/* Linha vertical divisória */}
                    {pontoDivisao && (
                        <ReferenceLine
                            x={pontoDivisao.mes}
                            stroke="#9ca3af"
                            strokeDasharray="3 3"
                            label={{
                                value: 'Início da Previsão',
                                angle: -90,
                                position: 'insideTopRight',
                                fill: '#6b7280',
                                fontSize: 12,
                                offset: 10,
                            }}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
