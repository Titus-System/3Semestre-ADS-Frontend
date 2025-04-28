import { useState } from 'react';
import SelecionaModalTransporte from '../components/selecionaModalTransporte';

export default function ExemploUsoModal() {
    const [modaisSelecionados, setModaisSelecionados] = useState<number[]>([]);

    const handleModaisSelecionados = (modais: number[]) => {
        setModaisSelecionados(modais);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Selecione os Modais de Transporte</h1>
            
            {/* Componente de seleção de modais */}
            <SelecionaModalTransporte onModaisSelecionados={handleModaisSelecionados} />
            
            {/* Exibição dos modais selecionados */}
            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Modais Selecionados:</h2>
                <ul className="list-disc pl-4">
                    {modaisSelecionados.map((codigo) => (
                        <li key={codigo}>Modal código: {codigo}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
} 