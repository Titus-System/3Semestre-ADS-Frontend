import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, LegendProps } from "recharts";
import { buscarHistoricoPais } from "../../services/paisService";
import { useEffect, useState } from "react";
import { Estado, Mercadoria, Pais } from "../../models/interfaces";
import { formatarValor } from "../../utils/formatarValor";
import Loading from "../loading";

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
    let titulo = `Histórico dos países que ${estado ? estado.sigla : 'Brasil'} mais ${tipo ? `${tipo}ortou` : 'exportou'}`
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
    const [intervalX, setIntervalX] = useState(23);
    const [fontSizeX, setFontSizeX] = useState(14);
    const [strokeWidth, setStrokeWidth] = useState(2.5);
    const [histPaisData, setHistPaisData] = useState<HistPaises[] | null>(null);
    const [titulo, setTitulo] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
            <Loading />
        );
    };

    const CustomLegend = ({ payload, fontSize }: LegendProps & { fontSize: number }) => {
        return (
            <div className="w-full flex justify-center mt-1">
                <ul className="flex flex-col xl:flex-row gap-0 xl:gap-3">
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

            <ResponsiveContainer width="100%" height={440}>
                <LineChart
                    data={dadosGrafico}
                    margin={{ top: 6, right: 22, left: 17, bottom: 5 }}
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
                    {paisNomes.map((nome_pais, index) => (
                        <Line
                            key={nome_pais}
                            type="monotone"
                            dataKey={nome_pais}
                            stroke={
                                ["#82ca9d", " #3b82f6", "rgb(245, 158, 11)", "rgb(255, 111, 111)", "#9366fa"][
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