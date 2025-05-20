import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatarData } from "../../utils/formatarData";
import { useEffect, useState } from "react";
import { buscarTendenciaBalancaComercial, buscarTendenciaVlFob } from "../../services/tendenciaServices";
import { Estado, Mercadoria, Pais } from "../../models/interfaces";
import { formatarValor } from "../../utils/formatarValor";

type Props = {
    anos?: number[] | null;
    estado?: Estado | null;
    pais?: Pais | null;
    ncm?: Mercadoria | null;
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
    balancaHistorico?: number;
    balancaPrevisao?: number;
}

interface Data {
    ds: string
    yhat: number
}

function formataTitulo(estado?: Estado | null, pais?: Pais | null) {
    let titulo = `Balança comercial${estado ? ` de ${estado.sigla}` : ` do Brasil`}${pais ? `com ${pais.nome}` : ``}`;
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

            if (tipo === 'balanca') {
                if (ehHistorico) mapa[chave].balancaHistorico = yhat;
                else mapa[chave].balancaPrevisao = yhat;
            }
        });
    };

    adicionar(exportacao, 'exportacao');
    adicionar(importacao, 'importacao');
    adicionar(balanca, 'balanca');

    return Object.values(mapa).sort((a, b) => new Date(a.ds).getTime() - new Date(b.ds).getTime());
}

export default function GraficoBalancaComercial({ anos, estado, pais, ncm }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const [dadosUnificados, setDadosUnificados] = useState<DadoUnificado[]>([]);
    const [dadosExportacao, setDadosExportacao] = useState<Data[]>([])
    const [dadosImportacao, setDadosImportacao] = useState<Data[]>([])
    const [dadosBalanca, setDadosBalanca] = useState<Data[]>([])

    const [titulo, setTitulo] = useState<string>();

    const buscarVlFob = async () => {
        console.log("Buscando dados para:", {
            estado: estado?.id_estado,
            pais: pais?.id_pais
        })
        try {
            const [dadosExp, dadosImp, dadosBal] = await Promise.all([
                buscarTendenciaVlFob("exp", estado?.id_estado, pais?.id_pais, ncm?.id_ncm),
                buscarTendenciaVlFob("imp", estado?.id_estado, pais?.id_pais, ncm?.id_ncm),
                buscarTendenciaBalancaComercial(estado?.id_estado, pais?.id_pais, ncm?.id_ncm),
            ]);

            setDadosExportacao(dadosExp);
            setDadosImportacao(dadosImp);
            setDadosBalanca(dadosBal);
            setError(false);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            setError(true);
        }
        setTitulo(formataTitulo(estado, pais))
    };

    useEffect(() => {
        const executarBusca = async () => {
            setLoading(true);
            await buscarVlFob();
            setLoading(false);
        };
        executarBusca();
    }, [anos, estado, pais, ncm]);

    useEffect(() => {
        if (dadosExportacao.length && dadosImportacao.length && dadosBalanca.length) {
            setDadosUnificados(unificarDados(dadosExportacao, dadosImportacao, dadosBalanca));
        }
    }, [dadosExportacao, dadosImportacao, dadosBalanca]);

    if (loading) {
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
    if (error) {
        return (
            <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex justify-center items-center h-64">
                    <p>Erro ao acessar dados</p>
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
                        tickFormatter={formatarValor}
                        label={{ value: '$', angle: -90, position: 'insideLeft', offset: -10 }}
                        tick={{fontSize:11}}
                    />
                    <Tooltip
                        labelFormatter={(label) => `Data: ${label}`}
                        formatter={(value: number) => `$ ${value?.toLocaleString('pt-BR')}`}
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

                    {/* Linhas balança comercial */}
                    <Line type="monotone" dataKey="balancaHistorico" name="Balança Comercial" stroke="rgb(51, 111, 207)" strokeWidth={3} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="balancaPrevisao" name="Balança Comercial (Previsão)" stroke="rgb(51, 111, 207)" strokeWidth={3} strokeDasharray="6 4" dot={{ r: 1 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}