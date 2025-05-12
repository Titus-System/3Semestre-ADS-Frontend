import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { DadosSetores } from "../../models/interfaces";
import { useEffect, useState } from "react";


type Props = {
    tipo:string,
    estado?:string,
    pais?:string,
    dadosSetores: DadosSetores;
}


export default function GraficoSetores({ tipo, estado, pais, dadosSetores }: Props) {
    const [mostrarAgregado, setMostrarAgregado] = useState(false);
    const [dataKey, setDataKey] = useState(`VL_FOB_${tipo.toUpperCase()}`)

    useEffect(() => {
        const mudaDataKey = async () => {
            if (mostrarAgregado) {
                setDataKey(`valor_agregado_${tipo}`);
            } else {
                setDataKey(`VL_FOB_${tipo.toUpperCase()}`);
            }
        };
        mudaDataKey();
    }, [mostrarAgregado, tipo]);
    
    return (
        <div className="bg-white rounded p-4 w-full max-w-full overflow-x-auto">
            <h3 className="text-center text-indigo-900 font-semibold mb-2">
                {`Distribuição de ${tipo}ortações de ${estado} ${pais ? `em relação a ${pais}` : ""}`}
            </h3>
            <div className="flex justify-between items-center mb-2">
                <div className="flex space-x-2">
                    <button
                    onClick={() => setMostrarAgregado(false)}
                    className={`px-4 py-1 rounded-md text-sm border transition ${
                        !mostrarAgregado
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-indigo-600 border-indigo-300 hover:border-indigo-600'
                    }`}
                    >
                    {`Valor FOB ${tipo}`}
                    </button>
                    <button
                    onClick={() => setMostrarAgregado(true)}
                    className={`px-4 py-1 rounded-md text-sm border transition ${
                        mostrarAgregado
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
                    <Radar name={`Valor FOB ${tipo}`} dataKey={dataKey} stroke="rgb(32, 36, 245)" fill=" #6366f1" fillOpacity={0.8} />
                    <PolarGrid />
                    <PolarAngleAxis dataKey="setor" />
                    <Tooltip
                        labelFormatter={(label) => `${label.charAt(0).toUpperCase() + label.substring(1,label.length)}`}
                        formatter={(value: number) => `$ ${value?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        labelClassName=''
                        labelStyle={{ color: ' #1e40af', fontWeight: 'bold' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}