import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { Estado, Pais } from "../../models/interfaces";
import { useEffect, useState } from "react";
import { buscaInfoSetores } from "../../services/setoresService";


type Props = {
    tipo: string | null,
    anos?: number[] | null
    estado?: Estado | null,
    pais?: Pais | null
}

function formataTitulo(tipo?: string | null, pais?: Pais | null, estado?:Estado|null) {
    if (!tipo) {tipo = 'exp'}
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
    const [dadosSetores, setDadosSetores] = useState<any>();
    const [mostrarAgregado, setMostrarAgregado] = useState(false);
    const [dataKey, setDataKey] = useState(tipo ? `VL_FOB_${tipo.toUpperCase()}` : 'VL_FOB_EXP')
    const [titulo, setTitulo] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);


    useEffect(() => {
        const executarBusca = async () => {
            setIsLoading(true);
            const dados = await buscaInfoSetores(anos ? anos : null, pais ? pais.id_pais : null, estado ? estado.sigla : null)
            setDadosSetores(dados);
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
                setDataKey(`VL_FOB_${tipo ? tipo.toUpperCase() : 'EXP'}`);
            }
        };
        mudaDataKey();
    }, [mostrarAgregado, tipo]);

    if (isLoading) {
        return (
            <div className="p-6 rounded-lg shadow">
                <div className="flex justify-center items-center h-64">
                    <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentCo" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </div>
        );
    };

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
                <RadarChart data={dadosSetores} outerRadius="80%" width={730} height={250}>
                    <Radar name={`Valor FOB ${tipo}`} dataKey={dataKey} fill=" #6366f1" fillOpacity={0.8}/>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="setor" stroke="#E0E0E0" />
                    <Tooltip
                        labelFormatter={(label) => `${label.charAt(0).toUpperCase() + label.substring(1, label.length)}`}
                        formatter={(value: number) => `$ ${value?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        labelClassName=''
                        labelStyle={{ color: ' #1e40af', fontWeight: 'bold' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}