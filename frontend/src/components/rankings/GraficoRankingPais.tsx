import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, ScatterChart, Scatter, TooltipProps } from 'recharts';
import { RankingPaises } from "../../models/interfaces"

type Props = {
    tipo:string|null
    rankingPaises : RankingPaises
}


export default function GraficoRankingPais ({tipo, rankingPaises}: Props) {
    return (
        <div className="bg-white rounded p-4 w-full max-w-full overflow-x-auto">
        <h3 className="text-center text-indigo-900 font-semibold mb-2">
            Ranking dos países mais {tipo ? tipo : "exp"}ortados
        </h3>

        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={rankingPaises}>
                <XAxis 
                    dataKey="nome_pais" 
                    tickFormatter={(value:string) => value.substring(0, 10)}
                    tick={{fontSize:11,}}
                />
                <YAxis 
                    tickFormatter={(value) => `${(value / 1e9)}`}
                    label={{ value: '$ (Bilhões)', angle: -90, position: 'insideLeft', offset: 10 }}
                />

                <Tooltip
                    labelFormatter={(label) => `País: ${label}`}
                    formatter={(value: number) => `${value?.toLocaleString('pt-BR')}`}
                    labelClassName=''
                    labelStyle={{}}
                />

                <Line dataKey="nome_pais" name="País"/>
                <Bar dataKey="total_valor_fob" fill="#6366f1" name="Valor FOB $" />
                <Legend/>
            </BarChart>
        </ResponsiveContainer>

        {/* <ResponsiveContainer width="100%" height={400}>
        <RadarChart outerRadius="80%" width={730} height={250} data={dadosConvertidos}>
            <Radar name="Valor FOB" dataKey="total_valor_fob" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
            <PolarGrid />
            <PolarAngleAxis dataKey="nome_pais" />
            <Tooltip />
        </RadarChart>
        </ResponsiveContainer> */}

        </div>
    );
}