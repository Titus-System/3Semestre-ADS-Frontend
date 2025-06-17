import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { Estado, Pais } from "../../models/interfaces";
import { useEffect, useState } from "react";
import { buscaInfoSetores } from "../../services/setoresService";
import Loading from "../loading";


type Props = {
    tipo: string | null,
    anos?: number[] | null
    estado?: Estado | null,
    pais?: Pais | null
}

function formataTitulo(tipo?: string | null, pais?: Pais | null, estado?: Estado | null) {
    if (!tipo) { tipo = 'exp' }
    let titulo = `Distribuição das ${tipo}ortações ${estado ? `por ${estado.sigla}` : ``}`
    if (pais) {
        if (tipo == 'imp') {
            titulo = `${titulo} de ${pais.nome}`
        } else {
            titulo = `${titulo} para ${pais.nome}`
        }
    }
    return titulo
}

export default function GraficoSetoresDistribuicao({ tipo, anos, estado, pais }: Props) {
    const [fontSizeTooltip, setFontSizeTooltip] = useState(14)
    const [dadosSetores, setDadosSetores] = useState<any>();
    const [mostrarAgregado, setMostrarAgregado] = useState(false);
    const [dataKey, setDataKey] = useState(tipo ? `valor_fob_${tipo}` : 'valor_fob_exp')
    const [titulo, setTitulo] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
    const handleResize = () => {
        setFontSizeTooltip(window.innerWidth < 700 ? 12 : 14);
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
    }, []);


    useEffect(() => {
        const executarBusca = async () => {
            setIsLoading(true);
            const dados = await buscaInfoSetores(anos ? anos : null, pais ? pais.id_pais : null, estado ? estado.id_estado : null)
            const dadosConvertidos = dados.map((item: any) => ({
                ...item,
                valor_fob_exp: Number(item.valor_fob_exp),
                valor_fob_imp: Number(item.valor_fob_imp),
                valor_agregado_exp: Number(item.valor_agregado_exp),
                valor_agregado_imp: Number(item.valor_agregado_imp),
            }));
            setDadosSetores(dadosConvertidos);
            setTitulo(formataTitulo(tipo, pais, estado));
            setIsLoading(false);
        };
        executarBusca();
    }, [tipo, anos, estado, pais]);

    useEffect(() => {
        const mudaDataKey = async () => {
            if (mostrarAgregado) {
                setDataKey(tipo ? `valor_agregado_${tipo}` : 'valor_agregado_exp');
            } else {
                setDataKey(`valor_fob_${tipo ? tipo : 'exp'}`);
            }
        };
        mudaDataKey();
    }, [mostrarAgregado, tipo]);

    if (isLoading) {
        return (
            <Loading />
        );
    };
    const valores = dadosSetores?.map((item: any) => item[dataKey]) || [];
    const maxValor = Math.max(...valores);
    const padding = maxValor * 0.1; // adiciona 10% para respiro visual
    const limiteSuperior = maxValor + padding;
    return (
        <div className="bg-transparent rounded p-4 w-full max-w-full overflow-x-auto">
            <h3 className="text-center text-gray-300 font-semibold mb-2">
                {titulo}
            </h3>
            <div className="flex justify-between items-center mb-2">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setMostrarAgregado(false)}
                        className={`px-4 py-1 rounded-md text-sm border transition ${!mostrarAgregado
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-indigo-600 border-indigo-300 hover:border-indigo-600'
                            }`}
                    >
                        {`Valor FOB ${tipo}`}
                    </button>
                    <button
                        onClick={() => setMostrarAgregado(true)}
                        className={`px-4 py-1 rounded-md text-sm border transition ${mostrarAgregado
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-indigo-600 border-indigo-300 hover:border-indigo-600'
                            }`}
                    >
                        {`Valor Agregado ${tipo}`}
                    </button>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={dadosSetores} outerRadius="80%">
                    <PolarGrid />
                    <PolarAngleAxis dataKey="setor" stroke="#E0E0E0" tick={{ fontSize: fontSizeTooltip, fill: "#E0E0E0" }}/>
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, limiteSuperior]}
                        tick={false}
                    />
                    <Radar
                        name={`Valor FOB ${tipo}`}
                        dataKey={dataKey}
                        fill="#6366f1"
                        fillOpacity={0.8}
                    />
                    <Tooltip
                        labelFormatter={(label) =>
                            `${label.charAt(0).toUpperCase()}${label.slice(1)}`
                        }
                        formatter={(value: number) =>
                            `$ ${value?.toLocaleString('pt-BR', {
                                maximumFractionDigits: 2
                            })}`
                        }
                        labelStyle={{ color: '#1e40af', fontWeight: 'bold' }}
                    />
                </RadarChart>
            </ResponsiveContainer>

        </div>
    )
}