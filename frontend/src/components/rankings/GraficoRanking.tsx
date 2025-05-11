import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { RankingEstados, RankingNcms, RankingPaises } from "../../models/interfaces"

type Props = {
    titulo: {
        tipoProcesso:string|null,
        ncmDescricao: string|null,
        siglaEstado:string|null,
        nomePais:string|null
    }|string,
    ranking: RankingPaises | RankingEstados | RankingNcms
}

function formataComplemetoTitulo (titulo:any, grafico:string) {
    let complemento = ``;
    if (grafico == 'ncm') {
        complemento = `que foram mais ${titulo.tipoProcesso ? titulo.tipoProcesso : "exp"}ortados`;
        if (titulo.siglaEstado) {
            complemento = `${complemento} por ${titulo.siglaEstado}`
        }
    }
    else if (grafico == 'paises'){
        complemento = `que ${titulo.siglaEstado ? titulo.siglaEstado : 'Brasil'} mais ${titulo.tipoProcesso ? titulo.tipoProcesso : "exp"}ortou`
    }else {
        complemento = `que mais ${titulo.tipoProcesso ? titulo.tipoProcesso : "exp"}ortaram`
    }

    if (titulo.ncmDescricao) {
        complemento = `${complemento} ${titulo.ncmDescricao}`
    }

    if (titulo.nomePais){
        complemento = `${complemento} de ${titulo.nomePais}`
    }

    return complemento
}

export default function GraficoRankingPais({ titulo, ranking }: Props) {
    const bar_datakey = "total_valor_fob"

    const x_datakey = (() => {
        if (!ranking.length) return "";
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

    const descricao = (() => {

        switch (x_datakey) {
            case "nome_pais":
                return `Ranking dos países ${formataComplemetoTitulo(titulo, 'paises')}`;
            case "sigla_estado":
                return `Ranking dos estados ${formataComplemetoTitulo(titulo, 'estados')}`;
            case "produto_descricao":
                return `Ranking dos ncm ${formataComplemetoTitulo(titulo, 'ncm')}`;
            default:
                return "ranking não encontrado";
        }
    })();

    return (
        <div className="bg-white rounded p-4 w-full max-w-full overflow-x-auto">
            <h3 className="text-center text-indigo-900 font-semibold mb-2">
                {`${descricao}`}
            </h3>
            {descricao && (
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
            )}
        </div>
    );
}