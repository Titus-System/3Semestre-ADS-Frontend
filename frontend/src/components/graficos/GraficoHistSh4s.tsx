import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Loading from "../loading";
import { useEffect, useState } from "react";
import { Estado, Pais, Sh4 } from "../../models/interfaces";
import { formatarValor } from "../../utils/formatarValor";
import { buscaHistSh4 } from "../../services/shService";


type Props = {
    tipo: 'exp' | 'imp' | null
    sh4s: Sh4[] | null;
    anos: number[] | null;
    estado: Estado | null;
    pais: Pais | null
};


function formataTitulo(tipo?: string | null, pais?: Pais | null, estado?: Estado | null) {
    let titulo = `Histórico dos SH4s que foram mais ${tipo ? tipo : 'exp'}ortados`
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

async function callBuscarSh4Hist(
    tipo: "exp" | "imp" | null,
    sh4List: string[],
    pais: number | null,
    estado: number | null,
    anos?: number[]
) {
    const dados = await buscaHistSh4(
        tipo ? tipo : "exp",
        sh4List,
        pais ? [pais] : undefined,
        estado ? [estado] : undefined,
        anos ? anos :undefined
    );
    const dadosConvertidos = dados.map((item: any) => ({
        ...item,
        total_valor_fob: Number(item.total_valor_fob),
        total_kg_liquido: Number(item.total_kg_liquido),
        total_valor_agregado: Number(item.total_valor_agregado),
    }));
    return dadosConvertidos;
}

async function formatarDadosSh4Hist(dados: any[]): Promise<any[]> {
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
            id_sh4: item.id_sh4,
            total_kg_liquido: item.total_kg_liquido,
            total_registros: item.total_registros,
            total_valor_agregado: item.total_valor_agregado,
            total_valor_fob: item.total_valor_fob,
        });
    });

    const dadosFormatados: any[] = Object.keys(dadosAgrupados)
        .sort()
        .map((data) => ({
            data,
            dados: dadosAgrupados[data],
        }));

    return dadosFormatados;
}


export default function GraficoHistSh4({tipo, sh4s, anos, estado, pais}:Props) {
    const [histSh4Data, setHistSh4Data] = useState<any[] | null>(null);
    const [titulo, setTitulo] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        if (sh4s && Array.isArray(sh4s)) {
            const sh4sList = sh4s.slice(0, 5).map((item: Sh4) => item.id_sh4);

            const fetchHistNcm = async () => {
                try {
                    const result = await formatarDadosSh4Hist(
                        await callBuscarSh4Hist(tipo, sh4sList, pais ? pais.id_pais : null, estado ? estado.id_estado : null)
                    );
                    console.log("histSh4Data: ", result)    
                    setHistSh4Data(result);
                } catch (error) {
                    console.error("Erro ao obter histNcm:", error);
                }
            };

            if (sh4sList.length > 0) {
                fetchHistNcm();
            }
        } else {
            console.error("rankingNcm não é um array ou não foi encontrado.");
        }
        setTitulo(formataTitulo(tipo, pais, estado));
        setLoading(false);
    }, [tipo, sh4s, anos, estado, pais]);


    const [mostrarAgregado, setMostrarAgregado] = useState(false);

    const dadosGrafico = histSh4Data?.map((item) => {
        const ponto: any = { data: item.data };
        item.dados.forEach((sh4:any) => {
            if (mostrarAgregado) {
                ponto[sh4.id_sh4] = sh4.total_valor_agregado
            } else {
                ponto[sh4.id_sh4] = sh4.total_valor_fob;
            }
        });
        return ponto;
    }) || [];

    const idsSh4 = histSh4Data?.[0]?.dados.map((sh4:any) => sh4.id_sh4) || [];


    if (loading) {
        return (
            <Loading/>
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
                        tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                        labelFormatter={(label) => `${label}`}
                        formatter={(value: number) => `${value?.toLocaleString('pt-BR')}`}
                        labelClassName=''
                        labelStyle={{ color: '#1e40af', fontWeight: 'bold' }}
                    />
                    <Legend />
                    {idsSh4.map((id:any, index:any) => (
                        <Line
                            key={id}
                            type="monotone"
                            dataKey={id}
                            stroke={
                                ["#82ca9d", "#3b82f6", "rgb(245, 158, 11)", "rgb(255, 111, 111)", "#9366fa"][
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