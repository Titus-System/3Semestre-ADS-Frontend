import { useEffect, useState } from "react";
import { NcmHist, RankingNcm } from "../../models/interfaces";
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

type Props = {
    rankingNcm: any;
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

async function callBuscarNcmHist(
    tipo: "exp" | "imp" | null,
    ncmList: number[],
    anos: number[],
    pais?: number,
    estado?: number
) {
    const dados = await buscarNcmHist(
        tipo ? tipo : "exp",
        ncmList,
        anos,
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

export default function GraficoHistNcm({ rankingNcm }: Props) {
    const [histNcmData, setHistNcmData] = useState<HistNCMs[] | null>(null);

    useEffect(() => {
        if (rankingNcm && Array.isArray(rankingNcm)) {
            const ncmsList = rankingNcm.slice(0, 5).map((item: RankingNcm) => item.ncm);

            const fetchHistNcm = async () => {
                try {
                    const result = await formatarDadosNcmHist(
                        await callBuscarNcmHist("exp", ncmsList, [], undefined, undefined)
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
    }, [rankingNcm]);

    // 🔁 Transforma os dados no formato que o Recharts entende
    const dadosGrafico = histNcmData?.map((item) => {
        const ponto: any = { data: item.data };
        item.dados.forEach((ncm) => {
            ponto[ncm.id_ncm] = ncm.total_valor_fob; // ou total_kg_liquido, se preferir
        });
        return ponto;
    }) || [];

    const idsNcm = histNcmData?.[0]?.dados.map((ncm) => ncm.id_ncm) || [];

    return (
        <div className="bg-white rounded p-4 w-full max-w-full overflow-x-auto">
            <h3 className="text-center text-indigo-900 font-semibold mb-2">
                Top Ncm
            </h3>
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
                        tickFormatter={(value) => `${(value / 1e9)}`}
                        label={{ value: '$ (Bilhões)', angle: -90, position: 'insideLeft', offset: 10 }}
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
