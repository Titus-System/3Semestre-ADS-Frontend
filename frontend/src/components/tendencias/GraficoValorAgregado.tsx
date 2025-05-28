import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { formatarValor } from '../../utils/formatarValor';

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

interface Props {
  dadosExportacao: DadoIndividual[];
  dadosImportacao: DadoIndividual[];
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

function formatarData(iso: string) {
    const date = new Date(Date.UTC(
        parseInt(iso.substring(0, 4)),
        parseInt(iso.substring(5, 7)),
        parseInt(iso.substring(8, 10))
    ));
    const mes = date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
    const ano = date.getFullYear();
    return `${mes.charAt(0).toUpperCase()}${mes.slice(1)}/${ano}`;
}

export default function GraficoValorAgregado({dadosExportacao, dadosImportacao}: Props) {

    const [dadosUnificados, setDadosUnificados] = useState<DadoUnificado[]>([]);

    useEffect(() => {
        if (dadosExportacao.length && dadosImportacao.length) {
            setDadosUnificados(unificarDados(dadosExportacao, dadosImportacao));
        }
    }, [dadosExportacao, dadosImportacao]);

    const pontoDivisao = dadosUnificados.find(d =>
        d.exportacaoPrevisao || d.importacaoPrevisao
    );

    return (
        <div className="bg-white rounded-lg p-4 shadow-md w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
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
                        formatter={(value: number) => `$ ${value
                            ? Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : '0,00'}`}
                    />
                    
                    <Legend wrapperStyle={{}}/>

                    {/* Linhas exportação */}
                    <Line type="monotone" dataKey="exportacaoHistorico" name="Exportação" stroke="#10b981" strokeWidth={3} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="exportacaoPrevisao" name="Exportação (Previsão)" stroke="#10b981" strokeWidth={3} strokeDasharray="6 4" dot={{ r: 1 }} />

                    {/* Linhas importação */}
                    <Line type="monotone" dataKey="importacaoHistorico" name="Importação" stroke="#3b82f6" strokeWidth={3} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="importacaoPrevisao" name="Importação (Previsão)" stroke="#3b82f6" strokeWidth={3} strokeDasharray="6 4" dot={{ r: 1 }} />

                    {pontoDivisao && (
                        <ReferenceLine
                            x={pontoDivisao.mes}
                            stroke="#9ca3af"
                            strokeDasharray="3 3"
                            label={{
                                value: 'Início da Previsão',
                                angle: -90,
                                position: 'insideTopRight',
                                fill: '#6b7280',
                                fontSize: 12,
                                offset: 10,
                            }}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
