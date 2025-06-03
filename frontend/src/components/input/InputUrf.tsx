import React, { useEffect, useRef, useState } from "react";
import { Urf } from "../../models/interfaces";
import { buscaUrfPorNome } from "../../services/urfService";

interface Props {
    onChange: (value: Urf | null) => void
}

export default function InputUrf({ onChange }: Props) {
    const [suggestions, setSuggestions] = useState<Urf[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedUrf, setSelectedUrf] = useState<Urf | null>(null)
    const [inputValue, setInputValue] = useState("")
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)


    useEffect(() => {
        const searchPaises = async () => {
            if (inputValue.length < 2) {
                setSuggestions([])
                return
            }

            if (selectedUrf && inputValue === selectedUrf.nome) {
                return
            }

            setIsLoading(true)
            try {
                const resultados = await buscaUrfPorNome(inputValue)
                console.log("Resultados da busca:", resultados)
                setSuggestions(resultados)
                if (resultados.length > 0) {
                    setIsOpen(true)
                }
                setHighlightedIndex(-1)
            } catch (err) {
                console.error("Erro ao buscar países", err)
                setSuggestions([])
            } finally {
                setIsLoading(false)
            }
        }

        const debounceTimer = setTimeout(searchPaises, 300)
        return () => clearTimeout(debounceTimer)
    }, [inputValue, selectedUrf])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    
    const handleSelectUrf = (urf: Urf) => {
        console.log("Tentando selecionar país:", urf)
        if (!urf || !urf.id_urf) {
            console.error("País inválido selecionado")
            return
        }
        console.log("País válido, atualizando estados...")
        setSelectedUrf(urf)
        setInputValue(urf.nome)
        onChange(urf)
        setSuggestions([])
        setHighlightedIndex(-1)
        setIsOpen(false)
        console.log("País selecionado com sucesso:", urf)
    }


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value || ""
        setInputValue(newValue)

        if (!newValue) {
            setSelectedUrf(null)
            onChange(null)
            setIsOpen(false)
        }

        if (selectedUrf && newValue !== selectedUrf.nome) {
            console.log("Input diferente do país selecionado, limpando seleção")
            setSelectedUrf(null)
            onChange(null)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log("Tecla pressionada:", e.key)
        if (!isOpen || suggestions.length === 0) return

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
                break
            case "ArrowUp":
                e.preventDefault()
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev))
                break
            case "Enter":
                e.preventDefault()
                console.log("Enter pressionado, índice destacado:", highlightedIndex)
                if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
                    const paisSelecionado = suggestions[highlightedIndex]
                    console.log("País selecionado por teclado:", paisSelecionado)
                    handleSelectUrf(paisSelecionado)
                }
                break
            case "Escape":
                e.preventDefault()
                setIsOpen(false)
                setHighlightedIndex(-1)
                break
        }
    }



    return (
        <div className="grid gap-2" ref={dropdownRef}>
            <label
                className="text-sm text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                Defina a URF:
            </label>

            <div className="relative">
                <div className="flex items-center">
                    <div className="relative w-full">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {/* Globe Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                <path d="M2 12h20"></path>
                            </svg>
                        </div>

                        <input
                            id="input-urf"
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Digite a Unidade da Receita Federal"
                            className="w-full h-12 pl-10 pr-10 py-2 rounded-md border border-gray-300
                bg-white text-gray-900 shadow-sm transition-colors
                focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-300"
                            onFocus={() => {
                                if (inputValue.length >= 2 && !selectedUrf) {
                                    setIsOpen(true)
                                }
                            }}
                        />

                        {isLoading ? (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                {/* Loader Icon */}
                                <svg
                                    className="animate-spin h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                                </svg>
                            </div>
                        ) : (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                {/* Chevrons Up Down Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m7 15 5 5 5-5"></path>
                                    <path d="m7 9 5-5 5 5"></path>
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {isOpen && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 rounded-md border border-gray-200 bg-white shadow-md">
                        <div className="max-h-60 overflow-auto p-1">
                            {suggestions.map((urf, index) => (
                                <div
                                    key={urf.id_urf}
                                    className={`
                    flex items-center px-2 py-1.5 text-sm rounded-sm relative cursor-default select-none
                    ${index === highlightedIndex ? "bg-gray-100" : ""}
                    ${selectedUrf?.id_urf === urf.id_urf ? "font-medium" : ""}
                    hover:bg-gray-100
                  `}
                                    onClick={() => handleSelectUrf(urf)}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                >
                                    {/* Check Icon */}
                                    <svg
                                        className={`mr-2 h-4 w-4 ${selectedUrf?.id_urf === urf.id_urf ? "opacity-100" : "opacity-0"}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    <span>{urf.nome}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
