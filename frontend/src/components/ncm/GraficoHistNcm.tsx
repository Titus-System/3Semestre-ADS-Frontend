import { useEffect, useMemo, useState } from "react";
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
    tipo: 'exp' | 'imp' | null
    ncm: number;
    anos: number[] | null;
    estado: number | null;
    pais: number | null;
    via: number[] | null;
    urf: number[] | null;
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
    ncm: number,
    anos: number[] | null,
    pais: number | null,
    estado: number | null,
    via: number[] | null,
    urf: number[] | null
) {
    const dados = await buscarNcmHist(
        tipo ? tipo : "exp",
        [ncm],
        anos ? anos : [],
        [],
        pais ? [pais] : [],
        estado ? [estado] : [],
        via ? via : [],
        urf ? urf : []
    );
    const dadosConvertidos = dados.map((item: NcmHist) => ({
        ...item,
        total_valor_fob: Number(item.total_valor_fob),
        total_kg_liquido: Number(item.total_kg_liquido),
        total_valor_agregado: Number(item.total_valor_agregado),
    }));

    console.log("dados convertidos: ", dadosConvertidos)
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

export default function GraficoHistNcm({ tipo, ncm, anos, estado, pais, via, urf }: Props) {
    const [histNcmDataExp, setHistNcmDataExp] = useState<HistNCMs[] | null>(null);
    const [histNcmDataImp, setHistNcmDataImp] = useState<HistNCMs[] | null>(null);
    useEffect(() => {
        if (ncm) {
            const fetchHistNcm = async () => {
                try {
                    const exp = await formatarDadosNcmHist(
                        await callBuscarNcmHist('exp', ncm, anos, pais, estado, via, urf)
                    );
                    setHistNcmDataExp(exp);
                    const imp = await formatarDadosNcmHist(
                        await callBuscarNcmHist('imp', ncm, anos, pais, estado, via, urf)
                    );
                    setHistNcmDataImp(imp);

                } catch (error) {
                    console.error("Erro ao obter histNcm:", error);
                }
            };

            fetchHistNcm();
        } else {
            console.error("rankingNcm não é um array ou não foi encontrado.");
        }
    }, [ncm, tipo, anos, estado, pais, via, urf]);


    const [mostrarAgregado, setMostrarAgregado] = useState(false);
    const [exibicao, setExibicao] = useState<string>('valor_fob')

    // Combinar exportação e importação por data
    const dadosGrafico = useMemo(() => {
        if (!histNcmDataExp || !histNcmDataImp) return [];

        // Cria um mapa para agrupar por data
        const mapaDados: Record<string, any> = {};

        // Processa exportação
        histNcmDataExp.forEach((item) => {
            const data = item.data;
            if (!mapaDados[data]) mapaDados[data] = { data };

            item.dados.forEach((ncm) => {
                let valor: any;
                if (exibicao === 'kg_liquido') {
                    valor = ncm.total_kg_liquido;
                } else if (exibicao === 'valor_agregado') {
                    valor = ncm.total_valor_agregado;
                } else {
                    valor = ncm.total_valor_fob;
                }

                mapaDados[data][`${ncm.id_ncm}_exp`] = valor;
            });
        });

        // Processa importação
        histNcmDataImp.forEach((item) => {
            const data = item.data;
            if (!mapaDados[data]) mapaDados[data] = { data };

            item.dados.forEach((ncm) => {
                let valor: any;
                if (exibicao === 'kg_liquido') {
                    valor = ncm.total_kg_liquido;
                } else if (exibicao === 'valor_agregado') {
                    valor = ncm.total_valor_agregado;
                } else {
                    valor = ncm.total_valor_fob;
                }

                mapaDados[data][`${ncm.id_ncm}_imp`] = valor;
            });
        });

        // Calcular balança comercial (exp - imp) se exibicao for valor_fob
        if (exibicao === 'valor_fob') {
            Object.keys(mapaDados).forEach((data) => {
                const ponto = mapaDados[data];
                let totalExp = 0;
                let totalImp = 0;

                Object.keys(ponto).forEach((key) => {
                    if (key.endsWith('_exp')) {
                        totalExp += ponto[key] || 0;
                    } else if (key.endsWith('_imp')) {
                        totalImp += ponto[key] || 0;
                    }
                });

                ponto["balanca"] = totalExp - totalImp;
            });
        }

        // Retorna como array ordenado por data
        return Object.values(mapaDados).sort((a, b) => a.data.localeCompare(b.data));
    }, [histNcmDataExp, histNcmDataImp, exibicao]);


    const idsNcmExp = histNcmDataExp?.[0]?.dados.map(ncm => `${ncm.id_ncm}_exp`) || [];
    const idsNcmImp = histNcmDataImp?.[0]?.dados.map(ncm => `${ncm.id_ncm}_imp`) || [];
    const idsNcm = [...idsNcmExp, ...idsNcmImp];

    console.log("dadosGrafico:", dadosGrafico)


    const totalGeral = useMemo(() => {
        if (!histNcmDataExp || !histNcmDataImp) return { exp: 0, imp: 0, balanca: 0};

        let totalExp = 0;
        if (exibicao === 'valor_agregado') {
            let totalFob = 0;
            let totalKg = 0;

            histNcmDataExp.forEach(item => {
                item.dados.forEach(ncm => {
                    totalFob += ncm.total_valor_fob || 0;
                    totalKg += ncm.total_kg_liquido || 0;
                });
            });

            totalExp = totalKg > 0 ? totalFob / totalKg : 0; // evita divisão por zero
        } else {
            totalExp = histNcmDataExp.reduce((soma, item) => {
                return (
                    soma +
                    item.dados.reduce((sub, ncm) => {
                        if (exibicao === 'kg_liquido') return sub + (ncm.total_kg_liquido || 0);
                        return sub + (ncm.total_valor_fob || 0); // valor_fob por padrão
                    }, 0)
                );
            }, 0);
        }

        let totalImp = 0;
        if (exibicao === 'valor_agregado') {
            let totalFob = 0;
            let totalKg = 0;

            histNcmDataImp.forEach(item => {
                item.dados.forEach(ncm => {
                    totalFob += ncm.total_valor_fob || 0;
                    totalKg += ncm.total_kg_liquido || 0;
                });
            });

            totalImp = totalKg > 0 ? totalFob / totalKg : 0; // evita divisão por zero
        } else {
            totalImp = histNcmDataImp.reduce((soma, item) => {
                return (
                    soma +
                    item.dados.reduce((sub, ncm) => {
                        if (exibicao === 'kg_liquido') return sub + (ncm.total_kg_liquido || 0);
                        return sub + (ncm.total_valor_fob || 0); // valor_fob por padrão
                    }, 0)
                );
            }, 0);
        }

        return {
            exp: totalExp,
            imp: totalImp,
            balanca: totalExp - totalImp,
        };
    }, [histNcmDataExp, histNcmDataImp, exibicao]);


    return (
        <div className="bg-transparent rounded-lg p-4 w-full max-w-full overflow-x-auto">
            {/* <h3 className="text-center text-indigo-900 font-semibold mb-2">
                Histórico por NCM
            </h3> */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setExibicao('valor_fob')}
                        className={`px-4 py-1 rounded-md text-sm border transition ${exibicao == 'valor_fob'
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-indigo-600 border-indigo-300 hover:border-indigo-600'
                            }`}
                    >
                        {`Valor FOB`}
                    </button>
                    <button
                        onClick={() => setExibicao('kg_liquido')}
                        className={`px-4 py-1 rounded-md text-sm border transition ${exibicao == 'kg_liquido'
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-indigo-600 border-indigo-300 hover:border-indigo-600'
                            }`}
                    >
                        {`Kg Liquido`}
                    </button>
                    <button
                        onClick={() => setExibicao('valor_agregado')}
                        className={`px-4 py-1 rounded-md text-sm border transition ${exibicao == 'valor_agregado'
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-indigo-600 border-indigo-300 hover:border-indigo-600'
                            }`}
                    >
                        {`Valor Agregado`}
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                <div className="p-4 rounded-lg bg-blue-400/10 border border-blue-200/50 shadow-sm">
                    <h4 className="text-sm text-blue-200 font-medium flex items-center gap-1">
                        {`${exibicao == 'valor_agregado' ? 'Média de Exportação' : 'Total Exportado'}`}
                    </h4>
                    <p className="text-xl font-semibold text-blue-600">
                        {exibicao === 'kg_liquido' ? 'KG' : 'US$'} {totalGeral.exp.toLocaleString()}
                    </p>
                </div>

                <div className="p-4 rounded-lg bg-red-400/10 border border-red-200/50 shadow-sm">
                    <h4 className="text-sm text-red-200 font-medium flex items-center gap-1">
                        {`${exibicao == 'valor_agregado' ? 'Média de Importação' : 'Total Importado'}`}
                    </h4>
                    <p className="text-xl font-semibold text-red-600">
                        {exibicao === 'kg_liquido' ? 'KG' : 'US$'} {totalGeral.imp.toLocaleString()}
                    </p>
                </div>

                <div className="p-4 rounded-lg bg-green-400/10 border border-green-200/50 shadow-sm">
                    <h4 className="text-sm text-green-200 font-medium flex items-center gap-1">
                        Saldo
                    </h4>
                    <p className={`text-xl font-semibold ${totalGeral.balanca >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {exibicao === 'kg_liquido' ? 'KG' : 'US$'} {totalGeral.balanca.toLocaleString()}
                    </p>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={dadosGrafico}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data"
                        stroke="#E0E0E0"
                        tickFormatter={(value: string) => value.substring(0, 10)}
                        tick={{ fontSize: 11, }}
                    />
                    <YAxis
                        stroke="#E0E0E0"
                        tickFormatter={(value) => `${(value / 1e6)}`}
                        label={{ value: '$ (Milhões)', angle: -90, position: 'insideLeft', stroke: "#E0E0E0", offset: 10 }}
                    />
                    <Tooltip
                        labelFormatter={(label) => `${label}`}
                        formatter={(value: number) => `${value?.toLocaleString('pt-BR')}`}
                        labelClassName=''
                        labelStyle={{ color: ' #1e40af', fontWeight: 'bold' }}
                    />
                    <Legend />
                    {idsNcm.map((id, index) => (
                        <Line
                            key={id}
                            type="monotone"
                            dataKey={id}
                            stroke={id.includes('_exp') ? 'rgb(74, 161, 255)' : 'rgb(234, 65, 65)'}
                            strokeWidth={2}
                            dot={false}
                            name={id.replace('_exp', ' (Exp)').replace('_imp', ' (Imp)')}
                        />
                    ))}
                    <Line
                        type="monotone"
                        dataKey="balanca"
                        stroke="rgb(201, 142, 54)"
                        strokeWidth={2}
                        dot={false}
                        name="Balança Comercial"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
