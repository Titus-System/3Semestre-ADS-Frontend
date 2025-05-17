import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RankingEstados, RankingNcms, RankingPaises } from "../../models/interfaces"

type Props = {
    titulo?: string,
    ranking?: RankingPaises | RankingEstados | RankingNcms
}

export default function GraficoRanking({ titulo, ranking }: Props) {
    const bar_datakey = "total_valor_fob"

    const x_datakey = (() => {
        if (!ranking?.length) return "";
        const item = ranking[0];
        if ("nome_pais" in item) return "nome_pais";
        if ("sigla_estado" in item) return "sigla_estado";
        if ("produto_descricao" in item) return "produto_descricao";
        return "";
    })();

    const color = (() => {
        switch (x_datakey) {
            case "nome_pais":
                return "rgb(75, 77, 182)";
            case "sigla_estado":
                return "rgb(29, 124, 70)";
            case "produto_descricao":
                return "rgb(189, 124, 20)";
            default:
                return "#ffffff";
        }
    })();

    return (
        <div className="bg-white rounded p-4 w-full max-w-full overflow-x-auto">
            <h3 className="text-center text-indigo-900 font-semibold mb-2">
                {titulo}
            </h3>
            {!ranking?.length && (
                <p>Nenhum dado encontrado</p>
            )}
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={ranking}>
                    <XAxis
                        dataKey={x_datakey}
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
                    <Bar dataKey={bar_datakey} fill={color} name="Valor FOB $" />
                    <Legend />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}