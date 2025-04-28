import { useState, useEffect } from "react";

interface Periodo {
    id: number;
    icon: string;
}

interface SelecionaPeriodoProps {
    onPeriodosSelecionados: (periodos: number[]) => void;
}

export default function SelecionaPeriodo({ onPeriodosSelecionados }: SelecionaPeriodoProps) {
    const analysisPeriod: Periodo[] = Array.from({ length: 11 }, (_, i) => ({
        id: 2014 + i,
        icon: `${2014 + i}`,
    }));

    const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);

    const togglePeriodSelection = (id: number) => {
        setSelectedPeriods((prev: number[]) =>
            prev.includes(id) ? prev.filter((period) => period !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        onPeriodosSelecionados(selectedPeriods);
    }, [selectedPeriods, onPeriodosSelecionados]);

    return (
        <div className="flex flex-col space-y-4">
            {/* Dropdown para telas menores */}
            <div className="block md:hidden">
                    <select
                        className="bg-white text-gray-900 text-md font-medium p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-16 w-full appearance-none pr-10"
                        style={{
                        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>')`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '1.5rem',
                        }}
                        onChange={(e) => togglePeriodSelection(parseInt(e.target.value))}
                    >
                        <option value="">Selecione um período</option>
                        {analysisPeriod.map((period) => (
                        <option key={period.id} value={period.id}>
                            {period.icon}
                        </option>
                        ))}
                    </select>
                    </div>

                    {/* Botões para telas maiores */}
                    <div className="hidden md:flex bg-white text-gray-900 text-md font-bold p-3 border border-gray-300 rounded-full shadow-md hover:bg-gray-100 flex-wrap justify-center gap-4">
                    {analysisPeriod.map((period) => (
                        <button
                        key={period.id}
                        className={`p-3 rounded-md text-xl transition-all duration-200 ${
                            selectedPeriods.includes(period.id)
                            ? "bg-gray-900 text-white border-2 border-white"
                            : "text-gray-700"
                        } hover:bg-gray-300`}
                        onClick={() => togglePeriodSelection(period.id)}
                        >
                        {period.icon}
                        </button>
                    ))}
            </div>
        </div>
    );
}