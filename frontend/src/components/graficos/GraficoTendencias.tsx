import { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, LegendProps } from 'recharts';
import { buscarTendenciaDashboard} from '../../services/tendenciaServices';
import { formatarValor } from '../../utils/formatarValor';
import { formatarData } from '../../utils/formatarData';
import Loading from '../loading';
import { Estado, Mercadoria, Pais, Sh4 } from '../../models/interfaces';


interface Props {
    ncm?:Mercadoria | null;
    sh4?: Sh4 | null;
    estado?: Estado | null;
    pais?: Pais | null;
}

export default function GraficoTendencias({ ncm, sh4, estado, pais }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [dadosBuscados, setDadosBuscados] = useState<any[]>();
    const [dadosGrafico, setDadosGrafico] = useState<any[]>([]);
    const [exibicao, setExibicao] = useState<'valor_fob' | 'kg_liquido' | 'valor_agregado'>('valor_fob');
    const [totalGeral, setTotalGeral] = useState({
        vl_fob_exp: 0,
        vl_fob_imp: 0,
        kg_liquido_exp: 0,
        kg_liquido_imp: 0,
    });
    const [lineKey, setLineKey] = useState<string>('vl_fob');

    const [intervalX, setIntervalX] = useState(23);
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [legendFontSize, setLegendFontSize] = useState(14);
    const [fontSizeX, setFontSizeX] = useState(11);
    const isSmallScreen = window.innerWidth < 947;
    const [isSmallerScreen, setIsSmallerScreen] = useState(false);
    const [turnToCol, setTurnToCol] = useState(false);
    const [turnColVlFob, setTurnColVlFob] = useState(false);
    const [modalFontSize, setModalFontSize] = useState(14);

    useEffect(() => { 
        const handleResize = () => {
            setModalFontSize(window.innerWidth < 291 ? 6 : window.innerWidth < 311 ? 7 : window.innerWidth < 331 ? 8 : window.innerWidth < 350 ? 9 : window.innerWidth < 369 ? 10 : window.innerWidth < 388 ? 11 : window.innerWidth < 428 ? 12 : 14);
            setTurnColVlFob(window.innerWidth < 375)
            setTurnToCol(window.innerWidth < 728);
            setIsSmallerScreen(window.innerWidth < 332);
            setFontSizeX(window.innerWidth < 387 ? 10 : 11);
            setIntervalX(window.innerWidth < 365 ? 71 : window.innerWidth < 539 ? 47 : 23);
            setStrokeWidth(window.innerWidth < 400 ? 1 : 2);
            setLegendFontSize(window.innerWidth < 265 ? 10 : window.innerWidth < 305 ? 11 : window.innerWidth < 640 ? 13 : 14);
        };

        handleResize(); // Executa no carregamento
        window.addEventListener("resize", handleResize); // Escuta mudanças de tamanho

        return () => window.removeEventListener("resize", handleResize);
    }, []);


    useEffect(() => {
        async function carregarDados() {
            setLoading(true);
            const resultado = await buscarTendenciaDashboard(estado?.id_estado, pais?.id_pais, ncm?.id_ncm, sh4?.id_sh4);
            console.log("dadosBuscados GraficoTendencias: ", resultado)
            setDadosBuscados(resultado);
            setLoading(false);
        }
        carregarDados();
    }, [ncm, sh4, estado, pais]);

    useEffect(() => {
        const prepararGrafico = (dados: any) => {
            const dadosMapeados: Record<string, Record<string, number>> = {};
            const nomes = [
                'vl_fob_exp', 'vl_fob_imp',
                'kg_liquido_exp', 'kg_liquido_imp',
                'valor_agregado_exp', 'valor_agregado_imp',
                'balanca',
            ];

            nomes.forEach((chave) => {
                if (!dados[chave]) return;
                dados[chave].forEach((item: any) => {
                    if (!dadosMapeados[item.ds]) dadosMapeados[item.ds] = {};
                    dadosMapeados[item.ds][chave] = item.yhat;
                });
            });

            const dadosFinal = Object.entries(dadosMapeados).map(([data, valores]) => ({
                data,
                ...valores
            }));
            console.log("dadosGrafico sh4: ", dadosFinal)
            setDadosGrafico(dadosFinal);
        };
        if (dadosBuscados) {
            prepararGrafico(dadosBuscados);
        }
    }, [dadosBuscados, exibicao]);

    useEffect(() => {
        if (dadosGrafico.length > 0) {
            const limite = new Date('2025-04-01');

            const totais = dadosGrafico
                .filter(item => new Date(item.data) <= limite)
                .reduce(
                    (acc, item) => ({
                        vl_fob_exp: acc.vl_fob_exp + (item.vl_fob_exp || 0),
                        vl_fob_imp: acc.vl_fob_imp + (item.vl_fob_imp || 0),
                        kg_liquido_exp: acc.kg_liquido_exp + (item.kg_liquido_exp || 0),
                        kg_liquido_imp: acc.kg_liquido_imp + (item.kg_liquido_imp || 0),
                    }),
                    {
                        vl_fob_exp: 0,
                        vl_fob_imp: 0,
                        kg_liquido_exp: 0,
                        kg_liquido_imp: 0,
                    }
                );

            setTotalGeral(totais);
        }
    }, [dadosGrafico]);


    useEffect(() => {
        const prefixMap: Record<typeof exibicao, string> = {
            valor_fob: 'vl_fob',
            kg_liquido: 'kg_liquido',
            valor_agregado: 'valor_agregado'
        };
        setLineKey(prefixMap[exibicao]);
    }, [exibicao]);


    console.log("totalGeral sh4:", totalGeral)

    if (loading) {
        return (<Loading />);
    }

    const CustomLegend = ({ payload, fontSize }: LegendProps & { fontSize: number }) => {
    return (
    <div className="w-full flex justify-center mt-1">
          <ul className="flex gap-1 flex-col sm:flex-row sm:gap-3">
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
        <div className="bg-transparent rounded-lg p-4 w-full max-w-full overflow-x-auto">
            <div className="flex justify-between items-center mb-2">
                <div className={`flex ${turnColVlFob ? "flex-col w-full" : "flex-row"} gap-2`}>
                    <button
                        onClick={() => setExibicao('valor_fob')}
                        className={`px-4 py-1 rounded-md text-sm border transition ${exibicao == 'valor_fob'
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-indigo-600 border-indigo-300 hover:border-indigo-600'
                            }`}
                    >
                        Valor FOB
                    </button>
                    <button
                        onClick={() => setExibicao('kg_liquido')}
                        className={`px-4 py-1 rounded-md text-sm border transition ${exibicao == 'kg_liquido'
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-indigo-600 border-indigo-300 hover:border-indigo-600'
                            }`}
                    >
                        Kg Líquido
                    </button>
                    <button
                        onClick={() => setExibicao('valor_agregado')}
                        className={`px-4 py-1 rounded-md text-sm border transition ${exibicao == 'valor_agregado'
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-indigo-600 border-indigo-300 hover:border-indigo-600'
                            }`}
                    >
                        Valor Agregado
                    </button>
                </div>
            </div>

            <div className={`grid ${turnToCol ? "grid-cols-1" : "grid-cols-3" } gap-4 my-6`}>
                <div className="p-4 rounded-lg bg-blue-400/10 border border-blue-200/50 shadow-sm">
                    <h4 className="text-sm text-blue-200 font-medium flex items-center gap-1">
                        {exibicao === 'valor_agregado' ? 'Média de Exportação' : 'Total Exportado'}
                    </h4>
                    <p className={`${isSmallerScreen ? "text-base" : isSmallScreen ? "text-lg" : "text-xl"} font-semibold text-blue-600`}>
                        {exibicao === 'kg_liquido' ? 'KG ' : 'US$ '}
                        {exibicao == 'kg_liquido' ? totalGeral?.kg_liquido_exp.toLocaleString() : ""}
                        {exibicao == 'valor_fob' ? totalGeral?.vl_fob_exp.toLocaleString() : ""}
                        {exibicao == 'valor_agregado' ? (totalGeral?.vl_fob_exp / totalGeral.kg_liquido_exp).toLocaleString() : ""}
                    </p>
                </div>

                <div className="p-4 rounded-lg bg-red-400/10 border border-red-200/50 shadow-sm">
                    <h4 className="text-sm text-red-200 font-medium flex items-center gap-1">
                        {exibicao === 'valor_agregado' ? 'Média de Importação' : 'Total Importado'}
                    </h4>
                    <p className={`${isSmallerScreen ? "text-base" : isSmallScreen ? "text-lg" : "text-xl"} font-semibold text-red-600`}>
                        {exibicao === 'kg_liquido' ? 'KG ' : 'US$ '}
                        {exibicao == 'kg_liquido' ? totalGeral?.kg_liquido_imp.toLocaleString() : ""}
                        {exibicao == 'valor_fob' ? totalGeral?.vl_fob_imp.toLocaleString() : ""}
                        {exibicao == 'valor_agregado' ? (totalGeral?.vl_fob_imp / totalGeral.kg_liquido_imp).toLocaleString() : ""}
                    </p>
                </div>
                {exibicao != "valor_agregado" && (
                    <div className="p-4 rounded-lg bg-green-400/10 border border-green-200/50 shadow-sm">
                        <h4 className="text-sm text-green-200 font-medium flex items-center gap-1">
                            Saldo
                        </h4>
                        {totalGeral && (
                            <p className={`${isSmallerScreen ? "text-base" : isSmallScreen ? "text-lg" : "text-xl"} font-semibold ${totalGeral?.vl_fob_exp >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {exibicao === 'kg_liquido' ? 'KG ' : 'US$ '}
                                {exibicao == 'valor_fob' ? (totalGeral.vl_fob_exp - totalGeral?.vl_fob_imp).toLocaleString() : ""}
                                {exibicao == 'kg_liquido' ? (totalGeral?.kg_liquido_exp - totalGeral?.vl_fob_imp).toLocaleString() : ""}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={dadosGrafico}
                    margin={{ top: 20, right: 15, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="data"
                        stroke="#E0E0E0"
                        tickFormatter={formatarData}
                        interval={intervalX}
                        tick={{ fontSize: fontSizeX }}
                    />
                    <YAxis
                        stroke="#E0E0E0"
                        tickFormatter={formatarValor}
                        label={{ value: '$', angle: -90, position: 'insideLeft', stroke: '#E0E0E0', offset: -10 }}
                        tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                        labelFormatter={(label) => `${label}`}
                        formatter={(value: number) => `${value?.toLocaleString('pt-BR')}`}
                        labelStyle={{ color: ' #1e40af', fontWeight: 'bold', fontSize: modalFontSize }}
                        itemStyle={{ fontSize: modalFontSize }}
                    />
                    <Legend content={<CustomLegend fontSize={legendFontSize} />} wrapperStyle={{ width: '100%', display: 'flex', justifyContent: 'center' }}/>

                    <Line
                        key={`${lineKey}_exp`}
                        type="monotone"
                        dataKey={`${lineKey}_exp`}
                        stroke={' #007bff'}
                        strokeWidth={strokeWidth}
                        dot={false}
                        name={'Exportação'}
                    />

                    <Line
                        key={`${lineKey}_imp`}
                        type="monotone"
                        dataKey={`${lineKey}_imp`}
                        stroke={'rgb(207, 9, 9)'}
                        strokeWidth={strokeWidth}
                        dot={false}
                        name={'Importação'}
                    />
                    {exibicao == 'valor_fob' && (
                        <Line
                            type="monotone"
                            dataKey={"balanca"}
                            stroke="rgb(170, 111, 22)"
                            strokeWidth={strokeWidth}
                            dot={false}
                            name="Balança Comercial"
                        />

                    )}
                    <ReferenceLine
                        x="2025-05-01"
                        stroke="red"
                        strokeDasharray="3 3"
                        label={{
                            value: "Projeção",
                            position: "top",
                            angle: 0,
                            fontSize: 12,
                            fill: "red",
                            fontWeight: 700
                        }}
                        
                        strokeWidth={2}

                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
