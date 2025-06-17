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
    LegendProps
} from "recharts";
import { formatarValor } from "../../utils/formatarValor";
import Loading from "../loading";

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
    const [intervalX, setIntervalX] = useState(23);
    const [fontSizeX, setFontSizeX] = useState(14);
    const [strokeWidth, setStrokeWidth] = useState(2.5);
    const [histNcmData, setHistNcmData] = useState<HistNCMs[] | null>(null);
    const [titulo, setTitulo] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => { 
        const handleResize = () => {
            setIntervalX(window.innerWidth < 361 ? 120 : window.innerWidth < 421 ? 60 : window.innerWidth < 584 ? 41 : window.innerWidth < 836 ? 23 : 15);
            setStrokeWidth(window.innerWidth < 470 ? 1.5 : 2.5);
            setFontSizeX(window.innerWidth < 660 ? 13 : 14);
        };

        handleResize(); // Executa no carregamento
        window.addEventListener("resize", handleResize); // Escuta mudanças de tamanho

        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
                    console.log("histNcmData: ", result)
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
    console.log("idsNcm: ", idsNcm)

    if (loading) {
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
                    margin={{ top: 6, right: 22, left: 17, bottom: 40 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data"
                        stroke="#E0E0E0"
                        tickFormatter={(value: string) => value.substring(0, 10)}
                        interval={intervalX}
                        tick={{ fontSize: 11, }}
                    />
                    <YAxis
                        stroke="#E0E0E0"
                        tickFormatter={formatarValor}
                        label={{ value: '$', angle: -90, position: 'insideLeft', offset: -10, stroke: "#E0E0E0" }}
                        tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                        labelFormatter={(label) => `${label}`}
                        formatter={(value: number) => `${value?.toLocaleString('pt-BR')}`}
                        labelClassName=''
                        labelStyle={{ color: '#1e40af', fontWeight: 'bold' }}
                    />
                    <Legend content={<CustomLegend fontSize={fontSizeX} />} wrapperStyle={{ width: '100%', display: 'flex', justifyContent: 'center' }}/>
                    {idsNcm.map((id, index) => (
                        <Line
                            key={id}
                            type="monotone"
                            dataKey={id.toString()}
                            stroke={
                                ["#82ca9d", "#3b82f6", "rgb(245, 158, 11)", "rgb(255, 111, 111)", "#9366fa"][
                                index % 5
                                ]
                            }
                            strokeWidth={strokeWidth}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
