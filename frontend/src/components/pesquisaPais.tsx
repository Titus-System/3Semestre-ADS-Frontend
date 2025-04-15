import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { buscaPaisPorNome } from "../services/paisService";

interface Pais {
    id_pais: number;
    nome: string;
}

interface PesquisaPaisProps {
    label: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function PesquisaPais({ label, onChange, placeholder = "Digite o nome do país" }: PesquisaPaisProps) {
    const [suggestions, setSuggestions] = useState<Pais[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPais, setSelectedPais] = useState<Pais | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const searchPaises = async () => {
            if (inputValue.length < 2) {
                setSuggestions([]);
                setIsOpen(false);
                return;
            }

            if (selectedPais && inputValue === selectedPais.nome) {
                return;
            }

            setIsLoading(true);
            try {
                const resultados = await buscaPaisPorNome(inputValue);
                console.log("Resultados da busca:", resultados);
                setSuggestions(resultados);
                if (resultados.length > 0) {
                    setIsOpen(true);
                } else {
                    setIsOpen(false);
                }
                setHighlightedIndex(-1);
            } catch (err) {
                console.error("Erro ao buscar países", err);
                setSuggestions([]);
                setIsOpen(false);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(searchPaises, 300);
        return () => clearTimeout(debounceTimer);
    }, [inputValue, selectedPais]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectPais = (pais: Pais) => {
        console.log("Tentando selecionar país:", pais);
        if (!pais || !pais.id_pais) {
            console.error("País inválido selecionado");
            return;
        }
        console.log("País válido, atualizando estados...");
        setSelectedPais(pais);
        setInputValue(pais.nome);
        onChange(pais.id_pais.toString());
        setSuggestions([]);
        setHighlightedIndex(-1);
        setIsOpen(false);
        console.log("País selecionado com sucesso:", pais);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        console.log("Mudando input para:", newValue);
        setInputValue(newValue);
        
        if (!newValue) {
            setSelectedPais(null);
            onChange("");
            setIsOpen(false);
        }
        
        if (selectedPais && newValue !== selectedPais.nome) {
            console.log("Input diferente do país selecionado, limpando seleção");
            setSelectedPais(null);
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
                    const paisSelecionado = suggestions[highlightedIndex];
                    console.log("País selecionado por teclado:", paisSelecionado);
                    handleSelectPais(paisSelecionado);
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
            <label className="text-gray-900 text-xl font-semibold">{label}</label>
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
                        if (inputValue.length >= 2 && !selectedPais) {
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
                        {suggestions.map((pais, index) => (
                            <div
                                key={pais.id_pais}
                                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200 ${
                                    selectedPais?.id_pais === pais.id_pais ? "bg-gray-100" : ""
                                } ${
                                    index === highlightedIndex ? "bg-gray-200" : ""
                                }`}
                                onClick={() => {
                                    console.log("Clicando no país:", pais);
                                    handleSelectPais(pais);
                                }}
                                onMouseEnter={() => setHighlightedIndex(index)}
                            >
                                {pais.nome}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 