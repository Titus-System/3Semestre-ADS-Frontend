import { useEffect, useState } from "react";
import { Estado, Mercadoria, Pais } from "../../models/interfaces";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, LegendProps } from "recharts";
import { formatarValor } from "../../utils/formatarValor";
import Loading from "../loading";
import { buscarHistoricoEstado } from "../../services/estadoService";

type Props = {
    tipo?: 'exp' | 'imp' | null
    estados: Estado[] | null;
    pais?: Pais | null;
    ncm?: Mercadoria | null;
}

interface HistEstados {
    data: string;
    dados: {
        sigla: string;
        total_kg_liquido: number;
        total_registros: number;
        total_valor_agregado: number;
        total_valor_fob: number;
    }[];
}[];


async function formatarDadosHist(dados: any[]): Promise<HistEstados[]> {
    const dadosAgrupados: Record<string, any[]> = {};

    dados.forEach((item) => {
        const ano = item.ano;
        const mes = item.mes;
        const data = `${ano}-${String(mes).padStart(2, "0")}-01`;

        if (!dadosAgrupados[data]) {
            dadosAgrupados[data] = [];
        }

        dadosAgrupados[data].push({
            nome_estado: item.nome_estado,
            sigla: item.sigla,
            total_kg_liquido: item.kg_liquido_total,
            total_valor_agregado: item.valor_agregado_total,
            total_valor_fob: item.valor_fob_total,
        });
    });

    const dadosFormatados: HistEstados[] = Object.keys(dadosAgrupados)
        .sort()
        .map((data) => ({
            data,
            dados: dadosAgrupados[data],
        }));

    return dadosFormatados;
}

async function buscarHistEstados({ tipo, estados, pais, ncm }: Props) {
    if (!estados || estados.length < 1) {
        return null
    }
    const ids_estados = estados.map((item) => item.id_estado);
    const dados = await buscarHistoricoEstado(
        tipo ? tipo : "exp",
        ids_estados,
        ncm ? [ncm.id_ncm] : [],
        undefined,
        undefined,
        pais ? [pais.id_pais] : [],
    );

    const dadosConvertidos = dados.map((item: any) => ({
        ...item,
        valor_fob_total: Number(item.valor_fob_total),
        kg_liquido_total: Number(item.kg_liquido_total),
        valor_agregado_total: Number(item.valor_agregado_total),
    }));
    return dadosConvertidos;
}


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
            const hist = await formatarDadosHist(
                await buscarHistEstados({ tipo, estados, pais, ncm })
            );

            if (hist) {
                setDados(hist)
            }
            setTitulo(formataTitulo(tipo, pais, ncm))
            setIsLoading(false);
        };
        buscarDados();
    }, [tipo, estados, pais, ncm]);

    const dadosGrafico = dados?.map((item) => {
        const ponto: any = { data: item.data };
        item.dados.forEach((estado:any) => {
            ponto[estado.sigla] = estado.total_valor_fob;
        });
        return ponto;
    }) || [];

    const estadoSiglas = dados?.[0]?.dados.map((estado:any) => estado.sigla) || [];
    console.log("dados: ", dados);

    if (isLoading) {
        return (
            <Loading />
        );
    };

    const CustomLegend = ({ payload, fontSize }: LegendProps & { fontSize: number }) => {
        return (
            <div className="w-full flex justify-center mt-1">
                <ul className="flex flex-row gap-3">
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
        <div className="bg-transparent rounded p-4 w-full max-w-full overflow-x-auto">
            <h3 className="text-center text-gray-300 font-semibold mb-2">
                {titulo}
            </h3>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={dadosGrafico}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data"
                        stroke="#E0E0E0"
                        tickFormatter={(value: string) => value.substring(0, 10)}
                        tick={{ fontSize: 11, }}
                    />
                    <YAxis
                        stroke="#E0E0E0"
                        tickFormatter={formatarValor}
                        label={{ value: '$', angle: -90, position: 'insideLeft', offset: -10, stroke: "#E0E0E0" }}
                        tick={{fontSize:11}}
                    />
                    <Tooltip
                        labelFormatter={(label) => `${label}`}
                        formatter={(value: number) => `${value?.toLocaleString('pt-BR')}`}
                        labelClassName=''
                        labelStyle={{ color: '#1e40af', fontWeight: 'bold' }}
                    />
                    <Legend content={<CustomLegend fontSize={16} />} />
                    {estadoSiglas.map((sigla: string, index: number) => (
                        <Line
                            key={sigla}
                            type="monotone"
                            dataKey={sigla}
                            stroke={
                                ["#82ca9d", " #3b82f6", "rgb(245, 158, 11)", "rgb(255, 111, 111)", "#9366fa"][
                                index % 5
                                ]
                            }
                            strokeWidth={2.5}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

}