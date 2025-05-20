"use client"

import type React from "react"

import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { buscaEstadoPorNome } from "../../services/estadoService"

interface Estado {
  id_estado: number
  nome: string
  sigla: string
}

interface PesquisaEstadoProps {
    label?: string
    onChange: (value: Estado | null) => void
    placeholder?: string
    required?: boolean
}

export default function InputEstado({
  label = "Defina o estado:",
  onChange,
  placeholder = "Digite o nome do estado",
  required = false,
}: PesquisaEstadoProps) {
  const [suggestions, setSuggestions] = useState<Estado[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEstado, setSelectedEstado] = useState<Estado | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const searchEstados = async () => {
        if (inputValue.length < 2) {
            setSuggestions([])
            return
        }

        if (selectedEstado && inputValue === selectedEstado.nome) {
            return
        }

        setIsLoading(true)
            try {
                const resultados = await buscaEstadoPorNome(inputValue)
                console.log("Resultados da busca:", resultados)
                setSuggestions(resultados)
                if (resultados.length > 0) {
                setIsOpen(true)
                }
                setHighlightedIndex(-1)
            } catch (err) {
                console.error("Erro ao buscar estados", err)
                setSuggestions([])
            } finally {
                setIsLoading(false)
            }
        }

        const debounceTimer = setTimeout(searchEstados, 300)
        return () => clearTimeout(debounceTimer)
    }, [inputValue, selectedEstado])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelectEstado = (estado: Estado) => {
        console.log("Tentando selecionar estado:", estado)
            if (!estado || !estado.id_estado) {
                console.error("Estado inválido selecionado")
                return
            }
        console.log("Estado válido, atualizando estados...")
        setSelectedEstado(estado)
        setInputValue(estado.nome)
        onChange(estado)
        setSuggestions([])
        setHighlightedIndex(-1)
        setIsOpen(false)
        console.log("Estado selecionado com sucesso:", estado)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value || ""
            setInputValue(newValue)
        
            if (!newValue) {
            setSelectedEstado(null)
            onChange(null) // <- notifica o pai de que não há mais estado selecionado
            setIsOpen(false)
            }
        
            if (selectedEstado && newValue !== selectedEstado.nome) {
            setSelectedEstado(null)
            onChange(null) // <- também notifica nesse caso
            }
      }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
                const estadoSelecionado = suggestions[highlightedIndex]
                console.log("Estado selecionado por teclado:", estadoSelecionado)
                handleSelectEstado(estadoSelecionado)
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
        htmlFor={label.toLowerCase().replace(/\s/g, "-")}
        className="text-sm text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <div className="flex items-center">
          <div className="relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {/* Map Pin Icon */}
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
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>

            <input
              id={label.toLowerCase().replace(/\s/g, "-")}
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full h-12 pl-10 pr-10 py-2 rounded-md border border-gray-300
                bg-white text-gray-900 shadow-sm transition-colors
                focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-300"
              onFocus={() => {
                if (inputValue.length >= 2 && !selectedEstado) {
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
              {suggestions.map((estado, index) => (
                <div
                  key={estado.id_estado}
                  className={`
                    flex items-center px-2 py-1.5 text-sm rounded-sm relative cursor-default select-none
                    ${index === highlightedIndex ? "bg-gray-100" : ""}
                    ${selectedEstado?.id_estado === estado.id_estado ? "font-medium" : ""}
                    hover:bg-gray-100
                  `}
                  onClick={() => handleSelectEstado(estado)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {/* Check Icon */}
                  <svg
                    className={`mr-2 h-4 w-4 ${selectedEstado?.id_estado === estado.id_estado ? "opacity-100" : "opacity-0"}`}
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
                  <span>{estado.nome}</span>
                  <span className="ml-auto text-xs text-gray-500">{estado.sigla}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
