import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { buscaEstadoPorNome } from "../services/estadoService";

interface Estado {
    id_estado: number;
    nome: string;
    sigla: string;
}

interface PesquisaEstadoProps {
    label: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function PesquisaEstado({ label, onChange, placeholder = "Digite o nome do estado" }: PesquisaEstadoProps) {
    const [suggestions, setSuggestions] = useState<Estado[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEstado, setSelectedEstado] = useState<Estado | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const searchEstados = async () => {
            if (inputValue.length < 2) {
                setSuggestions([]);
                setIsOpen(false);
                return;
            }

            if (selectedEstado && inputValue === selectedEstado.nome) {
                return;
            }

            setIsLoading(true);
            try {
                const resultados = await buscaEstadoPorNome(inputValue);
                console.log("Resultados da busca:", resultados);
                setSuggestions(resultados);
                if (resultados.length > 0) {
                    setIsOpen(true);
                } else {
                    setIsOpen(false);
                }
                setHighlightedIndex(-1);
            } catch (err) {
                console.error("Erro ao buscar estados", err);
                setSuggestions([]);
                setIsOpen(false);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(searchEstados, 300);
        return () => clearTimeout(debounceTimer);
    }, [inputValue, selectedEstado]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectEstado = (estado: Estado) => {
        console.log("Tentando selecionar estado:", estado);
        if (!estado || !estado.id_estado) {
            console.error("Estado inválido selecionado");
            return;
        }
        console.log("Estado válido, atualizando estados...");
        setSelectedEstado(estado);
        setInputValue(estado.nome);
        onChange(estado.id_estado.toString());
        setSuggestions([]);
        setHighlightedIndex(-1);
        setIsOpen(false);
        console.log("Estado selecionado com sucesso:", estado);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        console.log("Mudando input para:", newValue);
        setInputValue(newValue);
        
        if (!newValue) {
            setSelectedEstado(null);
            onChange("");
            setIsOpen(false);
        }
        
        if (selectedEstado && newValue !== selectedEstado.nome) {
            console.log("Input diferente do estado selecionado, limpando seleção");
            setSelectedEstado(null);
            onChange("");
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        console.log("Tecla pressionada:", e.key);
        if (!isOpen || suggestions.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex((prev) => 
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((prev) => 
                    prev > 0 ? prev - 1 : prev
                );
                break;
            case "Enter":
                e.preventDefault();
                console.log("Enter pressionado, índice destacado:", highlightedIndex);
                if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
                    const estadoSelecionado = suggestions[highlightedIndex];
                    console.log("Estado selecionado por teclado:", estadoSelecionado);
                    handleSelectEstado(estadoSelecionado);
                }
                break;
            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                setHighlightedIndex(-1);
                break;
        }
    };

    return (
        <div className="flex flex-col space-y-2 w-full" ref={dropdownRef}>
            <label className="text-white text-xl font-semibold">{label}</label>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="bg-white text-gray-900 text-md font-medium p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-16 w-full"
                    onFocus={() => {
                        if (inputValue.length >= 2 && !selectedEstado) {
                            setIsOpen(true);
                        }
                    }}
                />
                {isLoading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    </div>
                )}
                {isOpen && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                        {suggestions.map((estado, index) => (
                            <div
                                key={estado.id_estado}
                                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200 ${
                                    selectedEstado?.id_estado === estado.id_estado ? "bg-gray-100" : ""
                                } ${
                                    index === highlightedIndex ? "bg-gray-200" : ""
                                }`}
                                onClick={() => {
                                    console.log("Clicando no estado:", estado);
                                    handleSelectEstado(estado);
                                }}
                                onMouseEnter={() => setHighlightedIndex(index)}
                            >
                                {estado.nome}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 