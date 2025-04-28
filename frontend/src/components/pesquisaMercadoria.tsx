import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { buscaNcmPorNome } from "../services/ncmService";

interface Mercadoria {
    id_ncm: number;
    descricao: string;
}

interface PesquisaMercadoriaProps {
    label: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function PesquisaMercadoria({ label, onChange, placeholder = "Digite o nome ou código NCM" }: PesquisaMercadoriaProps) {
    const [suggestions, setSuggestions] = useState<Mercadoria[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMercadoria, setSelectedMercadoria] = useState<Mercadoria | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const searchMercadorias = async () => {
            if (inputValue.length < 2) {
                setSuggestions([]);
                setIsOpen(false);
                return;
            }

            if (selectedMercadoria && inputValue === selectedMercadoria.descricao) {
                return;
            }

            // Se o input for um número, não fazemos busca por nome
            if (!isNaN(Number(inputValue))) {
                setSuggestions([]);
                setIsOpen(false);
                return;
            }

            setIsLoading(true);
            try {
                const resultados = await buscaNcmPorNome(inputValue);
                console.log("Resultados da busca:", resultados);
                setSuggestions(resultados);
                if (resultados.length > 0) {
                    setIsOpen(true);
                } else {
                    setIsOpen(false);
                }
                setHighlightedIndex(-1);
            } catch (err) {
                console.error("Erro ao buscar mercadorias", err);
                setSuggestions([]);
                setIsOpen(false);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(searchMercadorias, 300);
        return () => clearTimeout(debounceTimer);
    }, [inputValue, selectedMercadoria]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectMercadoria = (mercadoria: Mercadoria) => {
        console.log("Tentando selecionar mercadoria:", mercadoria);
        if (!mercadoria || !mercadoria.id_ncm) {
            console.error("Mercadoria inválida selecionada");
            return;
        }
        console.log("Mercadoria válida, atualizando estados...");
        setSelectedMercadoria(mercadoria);
        setInputValue(mercadoria.descricao);
        onChange(mercadoria.id_ncm.toString());
        setSuggestions([]);
        setHighlightedIndex(-1);
        setIsOpen(false);
        console.log("Mercadoria selecionada com sucesso:", mercadoria);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        console.log("Mudando input para:", newValue);
        setInputValue(newValue);
        
        if (!newValue) {
            setSelectedMercadoria(null);
            onChange("");
            setIsOpen(false);
            return;
        }

        // Se o input for um número, atualiza diretamente o NCM
        if (!isNaN(Number(newValue))) {
            setSelectedMercadoria(null);
            onChange(newValue);
            setIsOpen(false);
            return;
        }
        
        if (selectedMercadoria && newValue !== selectedMercadoria.descricao) {
            console.log("Input diferente da mercadoria selecionada, limpando seleção");
            setSelectedMercadoria(null);
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
                    const mercadoriaSelecionada = suggestions[highlightedIndex];
                    console.log("Mercadoria selecionada por teclado:", mercadoriaSelecionada);
                    handleSelectMercadoria(mercadoriaSelecionada);
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
                        if (inputValue.length >= 2 && !selectedMercadoria && isNaN(Number(inputValue))) {
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
                        {suggestions.map((mercadoria, index) => (
                            <div
                                key={mercadoria.id_ncm}
                                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200 ${
                                    selectedMercadoria?.id_ncm === mercadoria.id_ncm ? "bg-gray-100" : ""
                                } ${
                                    index === highlightedIndex ? "bg-gray-200" : ""
                                }`}
                                onClick={() => {
                                    console.log("Clicando na mercadoria:", mercadoria);
                                    handleSelectMercadoria(mercadoria);
                                }}
                                onMouseEnter={() => setHighlightedIndex(index)}
                            >
                                <div className="font-medium">{mercadoria.descricao}</div>
                                <div className="text-sm text-gray-600">NCM: {mercadoria.id_ncm}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 