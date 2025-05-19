import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatarData } from "../../utils/formatarData";
import { useEffect, useState } from "react";
import { buscarTendenciaVa } from "../../services/tendenciaServices";
import { Estado, Mercadoria, Pais } from "../../models/interfaces";

type Props = {
    estado?: Estado | null;
    pais?: Pais | null;
    ncm?: Mercadoria | null;
}

interface Data {
    ds: string
    yhat: number
}

interface DadoIndividual {
    ds: string;
    yhat: number;
}

interface DadoUnificado {
    ds: string;
    mes: string;
    exportacaoHistorico?: number;
    exportacaoPrevisao?: number;
    importacaoHistorico?: number;
    importacaoPrevisao?: number;
}

function formataTitulo(estado?: Estado | null, pais?: Pais | null) {
    let titulo = `Valor Agregado médio${estado ? ` de ${estado.sigla}` : ` do Brasil`}${pais ? `com ${pais.nome}` : ``}`;
    return titulo;
}

function unificarDados(
    exportacao?: DadoIndividual[],
    importacao?: DadoIndividual[],
    balanca?: DadoIndividual[]
): DadoUnificado[] {
    const LIMIAR_PREVISAO = new Date("2025-01-01");
    const mapa: Record<string, DadoUnificado> = {};

    const adicionar = (dados: DadoIndividual[] | undefined, tipo: 'exportacao' | 'importacao' | 'balanca') => {
        dados?.forEach(({ ds, yhat }) => {
            const data = new Date(ds);
            const chave = ds;
            if (!mapa[chave]) {
                mapa[chave] = {
                    ds,
                    mes: formatarData(ds),
                };
            }

            const ehHistorico = data < LIMIAR_PREVISAO;

            if (tipo === 'exportacao') {
                if (ehHistorico) mapa[chave].exportacaoHistorico = yhat;
                else mapa[chave].exportacaoPrevisao = yhat;
            }

            if (tipo === 'importacao') {
                if (ehHistorico) mapa[chave].importacaoHistorico = yhat;
                else mapa[chave].importacaoPrevisao = yhat;
            }
        });
    };

    adicionar(exportacao, 'exportacao');
    adicionar(importacao, 'importacao');
    adicionar(balanca, 'balanca');

    return Object.values(mapa).sort((a, b) => new Date(a.ds).getTime() - new Date(b.ds).getTime());
}

export default function GraficoHistValorAgregado({ estado, pais, ncm }: Props) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [titulo, setTitulo] = useState<string>();
    const [dadosVaImp, setDadosVaImp] = useState<Data[]>([])
    const [dadosVaExp, setDadosVaExp] = useState<Data[]>([])

    const [dadosUnificados, setDadosUnificados] = useState<DadoUnificado[]>([]);

    const buscarVa = async () => {
        console.log("Buscando dados para:", {
            estado: estado?.id_estado,
            pais: pais?.id_pais
        })
        try {
            const [vaImp, vaExp] = await Promise.all([
                buscarTendenciaVa('imp', estado?.id_estado, pais?.id_pais),
                buscarTendenciaVa('exp', estado?.id_estado, pais?.id_pais)
            ])
            setDadosVaExp(vaExp)
            setDadosVaImp(vaImp)
        } catch (error) {
            console.error("Erro ao buscar dados:", error)
        }
    }

    useEffect(() => {
        const carregarDados = async () => {
            setIsLoading(true);
            await buscarVa();
            setIsLoading(false);
        };
        carregarDados();
    }, [estado, pais, ncm]);


    useEffect(() => {
        if (dadosVaExp.length && dadosVaImp.length) {
            setIsLoading(true);
            setDadosUnificados(unificarDados(dadosVaExp, dadosVaImp));
            setTitulo(formataTitulo(estado, pais))
            setIsLoading(false);
        }
    }, [dadosVaExp, dadosVaImp]);

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
        <div className="rounded-lg p-4 shadow-md w-full h-[500px]">
            <h3 className="text-center text-indigo-900 font-semibold mb-2">
                {titulo}
            </h3>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart
                    data={dadosUnificados}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="ds"
                        tickFormatter={(ds: string) => formatarData(ds)}
                        interval={11}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        tickFormatter={(value) => `${Number(value).toFixed(2)}`}
                        label={{ value: '$', angle: -90, position: 'insideLeft', offset: 10 }}
                    />
                    <Tooltip
                        labelFormatter={(label) => `Data: ${label}`}
                        formatter={(value: number) => `$ ${value
                            ? Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : '0,00'}`}
                            labelStyle={{ color: ' #1e40af', fontWeight: 'bold' }}
                    />

                    <Legend wrapperStyle={{}} />
                    <ReferenceLine
                        x="2025-01-01"
                        stroke="red"
                        strokeDasharray="3 3"
                        label={{
                            value: "Projeção",
                            position: "top",
                            angle: 0,
                            fontSize: 12,
                            fill: "red"
                        }}
                    />
                    {/* Linhas exportação */}
                    <Line type="monotone" dataKey="exportacaoHistorico" name="Exportação" stroke="rgb(15, 116, 2)" strokeWidth={3} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="exportacaoPrevisao" name="Exportação (Previsão)" stroke="rgb(15, 116, 2)" strokeWidth={3} strokeDasharray="6 4" dot={{ r: 1 }} />

                    {/* Linhas importação */}
                    <Line type="monotone" dataKey="importacaoHistorico" name="Importação" stroke="rgb(179, 15, 15)" strokeWidth={3} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="importacaoPrevisao" name="Importação (Previsão)" stroke="rgb(179, 15, 15)" strokeWidth={3} strokeDasharray="6 4" dot={{ r: 1 }} />


                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}