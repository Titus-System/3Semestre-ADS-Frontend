import { useEffect, useState } from "react";
import { Estado, Mercadoria, NcmHist, Pais } from "../../models/interfaces";
import { buscarNcmHist } from "../../services/ncmService";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { formatarValor } from "../../utils/formatarValor";

type Props = {
    tipo: 'exp' | 'imp' | null
    ncms: Mercadoria[] | null;
    anos: number[] | null;
    estado: Estado | null;
    pais: Pais | null
};

interface HistNCMs {
    data: string;
    dados: {
        descricao: string;
        id_ncm: number;
        total_kg_liquido: number;
        total_registros: number;
        total_valor_agregado: number;
        total_valor_fob: number;
    }[];
}[];

function formataTitulo(tipo?: string | null, pais?: Pais | null, estado?: Estado | null) {
    let titulo = `Histórico dos NCMs que foram mais ${tipo ? tipo : 'exp'}ortados`
    if (estado) {
        titulo = `${titulo} por ${estado.sigla}`
    }
    if (pais) {
        if (tipo == 'imp') {
            titulo = `${titulo} de ${pais.nome}`
        } else {
            titulo = `${titulo} para ${pais.nome}`
        }
    }
    return titulo
}

async function callBuscarNcmHist(
    tipo: "exp" | "imp" | null,
    ncmList: number[],
    anos: number[] | null,
    pais: number | null,
    estado: number | null
) {
    const dados = await buscarNcmHist(
        tipo ? tipo : "exp",
        ncmList,
        anos ? anos : [],
        [],
        pais ? [pais] : [],
        estado ? [estado] : [],
        [],
        []
    );
    const dadosConvertidos = dados.map((item: NcmHist) => ({
        ...item,
        total_valor_fob: Number(item.total_valor_fob),
        total_kg_liquido: Number(item.total_kg_liquido),
        total_valor_agregado: Number(item.total_valor_agregado),
    }));
    return dadosConvertidos;
}

async function formatarDadosNcmHist(dados: any[]): Promise<HistNCMs[]> {
    const dadosAgrupados: Record<string, any[]> = {};

    dados.forEach((item) => {
        const ano = item.ano;
        const mes = item.mes;
        const data = `${ano}-${String(mes).padStart(2, "0")}-01`;

        if (!dadosAgrupados[data]) {
            dadosAgrupados[data] = [];
        }

        dadosAgrupados[data].push({
            descricao: item.descricao,
            id_ncm: item.id_ncm,
            total_kg_liquido: item.total_kg_liquido,
            total_registros: item.total_registros,
            total_valor_agregado: item.total_valor_agregado,
            total_valor_fob: item.total_valor_fob,
        });
    });

    const dadosFormatados: HistNCMs[] = Object.keys(dadosAgrupados)
        .sort()
        .map((data) => ({
            data,
            dados: dadosAgrupados[data],
        }));

    return dadosFormatados;
}

export default function GraficoHistNcms({ tipo, ncms, anos, estado, pais }: Props) {
    const [histNcmData, setHistNcmData] = useState<HistNCMs[] | null>(null);
    const [titulo, setTitulo] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        if (ncms && Array.isArray(ncms)) {
            const ncmsList = ncms.slice(0, 5).map((item: Mercadoria) => item.id_ncm);

            const fetchHistNcm = async () => {
                try {
                    const result = await formatarDadosNcmHist(
                        await callBuscarNcmHist(tipo, ncmsList, anos, pais ? pais.id_pais : null, estado ? estado.id_estado : null)
                    );
                    setHistNcmData(result);
                } catch (error) {
                    console.error("Erro ao obter histNcm:", error);
                }
            };

            if (ncmsList.length > 0) {
                fetchHistNcm();
            }
        } else {
            console.error("rankingNcm não é um array ou não foi encontrado.");
        }
        setTitulo(formataTitulo(tipo, pais, estado));
        setLoading(false);
    }, [tipo, ncms, anos, estado, pais]);


    const [mostrarAgregado, setMostrarAgregado] = useState(false);

    const dadosGrafico = histNcmData?.map((item) => {
        const ponto: any = { data: item.data };
        item.dados.forEach((ncm) => {
            if (mostrarAgregado) {
                ponto[ncm.id_ncm] = ncm.total_valor_agregado
            } else {
                ponto[ncm.id_ncm] = ncm.total_valor_fob;
            }
        });
        return ponto;
    }) || [];

    const idsNcm = histNcmData?.[0]?.dados.map((ncm) => ncm.id_ncm) || [];


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


    return (
        <div className="bg-white rounded p-4 w-full max-w-full overflow-x-auto">
            <h3 className="text-center text-indigo-900 font-semibold mb-2">
                {titulo}
            </h3>
            <div className="flex justify-between items-center mb-2">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setMostrarAgregado(false)}
                        className={`px-4 py-1 rounded-md text-sm border transition ${!mostrarAgregado
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-indigo-600 border-indigo-300 hover:border-indigo-600'
                            }`}
                    >
                        {`Valor FOB ${tipo}`}
                    </button>
                    <button
                        onClick={() => setMostrarAgregado(true)}
                        className={`px-4 py-1 rounded-md text-sm border transition ${mostrarAgregado
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-indigo-600 border-indigo-300 hover:border-indigo-600'
                            }`}
                    >
                        {`Valor Agregado ${tipo}`}
                    </button>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={dadosGrafico}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data"
                        tickFormatter={(value: string) => value.substring(0, 10)}
                        tick={{ fontSize: 11, }}
                    />
                    <YAxis
                        tickFormatter={formatarValor}
                        label={{ value: '$', angle: -90, position: 'insideLeft', offset: -10 }}
                        tick={{fontSize:11}}
                    />
                    <Tooltip
                        labelFormatter={(label) => `${label}`}
                        formatter={(value: number) => `${value?.toLocaleString('pt-BR')}`}
                        labelClassName=''
                        labelStyle={{ color: '#1e40af', fontWeight: 'bold' }}
                    />
                    <Legend />
                    {idsNcm.map((id, index) => (
                        <Line
                            key={id}
                            type="monotone"
                            dataKey={id.toString()}
                            stroke={
                                ["rgb(41, 62, 247)", " #82ca9d", "rgb(6, 175, 48)", "rgb(241, 125, 30)", "rgb(31, 30, 78)"][
                                index % 5
                                ]
                            }
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
