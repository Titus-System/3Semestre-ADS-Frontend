import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { buscarHistoricoPais } from "../../services/paisService";
import { useEffect, useState } from "react";
import { Estado, Mercadoria, Pais } from "../../models/interfaces";

type Props = {
    tipo: string | null;
    paises: Pais[] | null;
    ncm: Mercadoria | null;
    estado: Estado | null;
    anos: number[] | null
}

interface HistPaises {
    data: string;
    dados: {
        nome_pais: string;
        total_kg_liquido: number;
        total_registros: number;
        total_valor_agregado: number;
        total_valor_fob: number;
    }[];
}[];

function formataTitulo(tipo?: string | null, estado?: Estado | null, ncm?: Mercadoria | null) {
    let titulo = `Histórico dos países que ${estado ? estado.sigla : 'Brasil'} mais ${tipo ? `${tipo}portou` : 'exportou'}`
    if (ncm) { titulo = `${titulo} ${ncm.descricao}` }
    return titulo
}


async function callBuscarPaisHist(tipo: string | null, paises: number[] | null, ncm: number | null, estado: number | null, anos: number[] | null) {
    if (paises && paises.length > 0) {
        const dados = await buscarHistoricoPais(
            tipo ? tipo : 'exp',
            paises,
            ncm ? [ncm] : undefined,
            estado ? [estado] : undefined,
            anos ? anos : undefined,
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], undefined, undefined
        )
        const dadosConvertidos = dados.map((item: any) => ({
            ...item,
            valor_fob_total: Number(item.valor_fob_total),
            kg_liquido_total: Number(item.kg_liquido_total),
            valor_agregado_total: Number(item.valor_agregado_total),
        }));
        return dadosConvertidos;
    }
    return null;
}

async function formatarDadosHist(dados: any[]): Promise<HistPaises[]> {
    const dadosAgrupados: Record<string, any[]> = {};

    dados.forEach((item) => {
        const ano = item.ano;
        const mes = item.mes;
        const data = `${ano}-${String(mes).padStart(2, "0")}-01`;

        if (!dadosAgrupados[data]) {
            dadosAgrupados[data] = [];
        }

        dadosAgrupados[data].push({
            nome_pais: item.nome_pais,
            total_kg_liquido: item.kg_liquido_total,
            total_valor_agregado: item.valor_agregado_total,
            total_valor_fob: item.valor_fob_total,
        });
    });

    const dadosFormatados: HistPaises[] = Object.keys(dadosAgrupados)
        .sort()
        .map((data) => ({
            data,
            dados: dadosAgrupados[data],
        }));

    return dadosFormatados;
}


export default function GraficoHistPais({ tipo, paises, ncm, estado, anos }: Props) {
    const [histPaisData, setHistPaisData] = useState<HistPaises[] | null>(null);
    const [titulo, setTitulo] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        if (paises && Array.isArray(paises)) {
            const ids = paises.map((item) => {
                return item.id_pais
            })
            const fetchHistNcm = async () => {
                try {
                    const result = await formatarDadosHist(
                        await callBuscarPaisHist(tipo, ids, ncm ? ncm.id_ncm : null, estado ? estado.id_estado : null, anos)
                    );
                    setHistPaisData(result);
                } catch (error) {
                    console.error("Erro ao obter histNcm:", error);
                }
            };

            if (paises.length > 0) {
                fetchHistNcm();
            }
        } else {
            console.error("paises não é um array ou não foi encontrado.");
        }
        setTitulo(formataTitulo(tipo, estado, ncm))
        setIsLoading(false);
    }, [tipo, paises, ncm, estado, anos]);

    const dadosGrafico = histPaisData?.map((item) => {
        const ponto: any = { data: item.data };
        item.dados.forEach((pais) => {
            ponto[pais.nome_pais] = pais.total_valor_fob;
        });
        return ponto;
    }) || [];

    const paisNomes = histPaisData?.[0]?.dados.map((pais) => pais.nome_pais) || [];
    
    if (isLoading) {
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
                    {paisNomes.map((nome_pais, index) => (
                        <Line
                            key={nome_pais}
                            type="monotone"
                            dataKey={nome_pais}
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