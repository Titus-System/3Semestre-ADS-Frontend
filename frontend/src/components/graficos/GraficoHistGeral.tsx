import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatarValor } from "../../utils/formatarValor";
import { useEffect, useState } from "react";
import { buscaHistGeral } from "../../services/apiServices";
import Loading from "../loading";

type Props = {
    ncm?: number[],
    estado?: number[],
    pais?: number[],
    transporte?: number[],
    urf?: number[],
};

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export default function GraficoHistGeral({ ncm, estado, pais, transporte, urf }: Props) {
    const [exibicao, setExibicao] = useState<string>('valor_fob');
    const [totalGeral, setTotalGeral] = useState<any>(null);
    const [dadosGrafico, setDadosGrafico] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const buscarDados = async () => {
        const hist_exp = await buscaHistGeral('exp', ncm, pais, estado, transporte, urf);
        const hist_imp = await buscaHistGeral('imp', ncm, pais, estado, transporte, urf);

        // Agrupando por data para facilitar o merge
        const mapDados: { [data: string]: any } = {};
        console.log('hist_exp:', hist_exp)

        hist_exp.forEach((item: any) => {
            const data = `${meses[item.mes - 1]}/${item.ano}`;
            if (!mapDados[data]) mapDados[data] = { data };
            mapDados[data].exp_valor_fob = parseFloat(item.total_valor_fob);
            mapDados[data].exp_kg_liquido = parseFloat(item.total_kg_liquido);
            mapDados[data].exp_valor_agregado = item.total_kg_liquido > 0
                ? parseFloat(item.total_valor_fob) / parseFloat(item.total_kg_liquido)
                : 0;
        });

        hist_imp.forEach((item: any) => {
            const data = `${meses[item.mes - 1]}/${item.ano}`;
            if (!mapDados[data]) mapDados[data] = { data };
            mapDados[data].imp_valor_fob = parseFloat(item.total_valor_fob);
            mapDados[data].imp_kg_liquido = parseFloat(item.total_kg_liquido);
            mapDados[data].imp_valor_agregado = item.total_kg_liquido > 0
                ? parseFloat(item.total_valor_fob) / parseFloat(item.total_kg_liquido)
                : 0;
        });

        // Calcular balança
        const dadosFinais = Object.values(mapDados).map((item: any) => {
            return {
                ...item,
                balanca: (item.exp_valor_fob || 0) - (item.imp_valor_fob || 0)
            };
        });

        // Calcular totais
        const total = {
            total_fob_exp: dadosFinais.reduce((sum, d) => sum + (d.exp_valor_fob || 0), 0),
            total_kg_exp: dadosFinais.reduce((sum, d) => sum + (d.exp_kg_liquido || 0), 0),
            total_fob_imp: dadosFinais.reduce((sum, d) => sum + (d.imp_valor_fob || 0), 0),
            total_kg_imp: dadosFinais.reduce((sum, d) => sum + (d.imp_kg_liquido || 0), 0),
            total_valor_frete: dadosFinais.reduce((sum, d) => sum + (d.valor_frete || 0), 0),   // opcional, se esse campo existir
            total_valor_seguro: dadosFinais.reduce((sum, d) => sum + (d.valor_seguro || 0), 0), // opcional, se esse campo existir
            balanca_comercial:
                dadosFinais.reduce((sum, d) => sum + (d.exp_valor_fob || 0), 0) -
                dadosFinais.reduce((sum, d) => sum + (d.imp_valor_fob || 0), 0),
            valor_agregado_exp: (() => {
                const totalFOB = dadosFinais.reduce((sum, d) => sum + (d.exp_valor_fob || 0), 0);
                const totalKG = dadosFinais.reduce((sum, d) => sum + (d.exp_kg_liquido || 0), 0);
                return totalKG ? totalFOB / totalKG : 0;
            })(),
            valor_agregado_imp: (() => {
                const totalFOB = dadosFinais.reduce((sum, d) => sum + (d.imp_valor_fob || 0), 0);
                const totalKG = dadosFinais.reduce((sum, d) => sum + (d.imp_kg_liquido || 0), 0);
                return totalKG ? totalFOB / totalKG : 0;
            })()
        };

        console.log("total: ", total)
        setDadosGrafico(dadosFinais);
        setTotalGeral(total);
    };

    useEffect(() => {
        //setLoading(true);
        buscarDados().finally(() => setLoading(false));
    }, [ncm, estado, pais, transporte, urf]);

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <div className="rounded-lg p-4 w-full max-w-full overflow-x-auto">
            {/* Botões */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex space-x-2">
                    {[
                        { label: 'Valor FOB', key: 'valor_fob' },
                        { label: 'Kg Líquido', key: 'kg_liquido' },
                        { label: 'Valor Agregado', key: 'valor_agregado' }
                    ].map(opcao => (
                        <button
                            key={opcao.key}
                            onClick={() => setExibicao(opcao.key)}
                            className={`px-4 py-1 rounded-md text-sm border transition ${exibicao === opcao.key
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-indigo-600 border-indigo-300 hover:border-indigo-600'}`}
                        >
                            {opcao.label}
                        </button>
                    ))}
                </div>
            </div>

            {totalGeral && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                    {/* Exportação */}
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 shadow-sm">
                        <h4 className="text-sm text-blue-600 font-medium">
                            {exibicao === 'valor_agregado' ? 'Média de Exportação' : 'Total Exportado'}
                        </h4>
                        <p className="text-xl font-semibold text-blue-900">
                            {exibicao === 'kg_liquido'
                                ? `KG ${totalGeral.total_kg_exp.toLocaleString('pt-BR')}`
                                : exibicao === 'valor_agregado'
                                    ? `US$ ${totalGeral.valor_agregado_exp.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`
                                    : `US$ ${totalGeral.total_fob_exp.toLocaleString('pt-BR')}`}
                        </p>
                    </div>

                    {/* Importação */}
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 shadow-sm">
                        <h4 className="text-sm text-red-600 font-medium">
                            {exibicao === 'valor_agregado' ? 'Média de Importação' : 'Total Importado'}
                        </h4>
                        <p className="text-xl font-semibold text-red-900">
                            {exibicao === 'kg_liquido'
                                ? `KG ${totalGeral.total_kg_imp.toLocaleString('pt-BR')}`
                                : exibicao === 'valor_agregado'
                                    ? `US$ ${totalGeral.valor_agregado_imp.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`
                                    : `US$ ${totalGeral.total_fob_imp.toLocaleString('pt-BR')}`}
                        </p>
                    </div>

                    {/* Saldo / Balança Comercial */}
                    {exibicao != "valor_agregado" && (
                        <div className="p-4 rounded-lg bg-green-50 border border-green-200 shadow-sm">
                            <h4 className="text-sm text-green-600 font-medium">Saldo</h4>
                            <p
                                className={`text-xl font-semibold ${totalGeral.balanca_comercial >= 0 ? 'text-green-900' : 'text-red-900'
                                    }`}
                            >
                                {exibicao === 'kg_liquido'
                                    ? `KG ${(totalGeral.total_kg_exp - totalGeral.total_kg_imp).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`
                                    : `US$ ${totalGeral.balanca_comercial.toLocaleString('pt-BR')}`}
                            </p>
                        </div>
                    )}
                </div>
            )}


            {/* Gráfico */}
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" tick={{ fontSize: 11 }} />
                    <YAxis
                        tickFormatter={formatarValor}
                        label={{ value: exibicao === 'kg_liquido' ? 'KG' : 'US$', angle: -90, position: 'insideLeft', offset: -10 }}
                        tick={{ fontSize: 11, color:"rgb(212, 207, 207)" }}
                    />
                    <Tooltip
                        formatter={(value: number) => value.toLocaleString('pt-BR')}
                        labelFormatter={(label) => `${label}`}
                        contentStyle={{ fontSize: 13 }}
                        labelStyle={{ color: ' #1e40af', fontWeight: 'bold' }}
                    />
                    <Legend />

                    <Line
                        type="monotone"
                        dataKey={`exp_${exibicao}`}
                        stroke="#007bff"
                        strokeWidth={2}
                        dot={false}
                        name="Exportação"
                    />
                    <Line
                        type="monotone"
                        dataKey={`imp_${exibicao}`}
                        stroke="#cf0909"
                        strokeWidth={2}
                        dot={false}
                        name="Importação"
                    />
                    {exibicao !== 'valor_agregado' && (
                        <Line
                            type="monotone"
                            dataKey="balanca"
                            stroke="rgb(170, 111, 22)"
                            strokeWidth={2}
                            dot={false}
                            name="Balança Comercial"
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
