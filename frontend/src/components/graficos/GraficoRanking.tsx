import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, LegendProps } from "recharts";
import { RankingEstados, RankingNcms, RankingPaises } from "../../models/interfaces"
import { formatarValor } from "../../utils/formatarValor";

type Props = {
    titulo?: string,
    ranking?: RankingPaises | RankingEstados | RankingNcms
    valor_agregado?: boolean | null
}

export default function GraficoRanking({ titulo, ranking, valor_agregado }: Props) {
    const bar_datakey = valor_agregado ? "total_valor_agregado" : "total_valor_fob"

    const x_datakey = (() => {
        if (!ranking?.length) return "";
        const item = ranking[0];
        if ("nome_pais" in item) return "nome_pais";
        if ("sigla_estado" in item) return "sigla_estado";
        if ("produto_descricao" in item) return "produto_descricao";
        if ("sh4_descricao" in item) return "sh4_descricao"
        return "";
    })();

    const color = (() => {
        switch (x_datakey) {
            case "nome_pais":
                return "rgb(109, 111, 230)";
            case "sigla_estado":
                return "rgb(32, 174, 94)";
            case "produto_descricao":
                return "rgb(189, 124, 20)";
            case "sh4_descricao":
                return "rgb(175, 20, 189)"
            default:
                return "#ffffff";
        }
    })();

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
            {!ranking?.length && (
                <p>Nenhum dado encontrado</p>
            )}
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={ranking} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis
                        stroke="#E0E0E0"
                        dataKey={x_datakey}
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
                    <Bar dataKey={bar_datakey} fill={color} name="$" />
                    <Legend content={<CustomLegend fontSize={16} />} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}