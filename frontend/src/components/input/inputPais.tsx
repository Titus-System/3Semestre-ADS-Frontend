"use client"

import type React from "react"

import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { buscaPaisPorNome } from "../../services/paisService"

interface Pais {
  id_pais: number
  nome: string
}

interface PesquisaPaisProps {
  label?: string
  onChange: (value: Pais | null) => void
  placeholder?: string
  required?: boolean
}

export default function InputPais({
  label = "Defina o país:",
  onChange,
  placeholder = "Digite o nome do país",
  required = false,
}: PesquisaPaisProps) {
  const [suggestions, setSuggestions] = useState<Pais[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPais, setSelectedPais] = useState<Pais | null>(null)
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

      if (selectedPais && inputValue === selectedPais.nome) {
        return
      }

      setIsLoading(true)
      try {
        const resultados = await buscaPaisPorNome(inputValue)
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
  }, [inputValue, selectedPais])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelectPais = (pais: Pais) => {
    console.log("Tentando selecionar país:", pais)
    if (!pais || !pais.id_pais) {
      console.error("País inválido selecionado")
      return
    }
    console.log("País válido, atualizando estados...")
    setSelectedPais(pais)
    setInputValue(pais.nome)
    onChange(pais)
    setSuggestions([])
    setHighlightedIndex(-1)
    setIsOpen(false)
    console.log("País selecionado com sucesso:", pais)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value || ""
    setInputValue(newValue)

    if (!newValue) {
        setSelectedPais(null)
        onChange(null)
        setIsOpen(false)
    }

    if (selectedPais && newValue !== selectedPais.nome) {
        console.log("Input diferente do país selecionado, limpando seleção")
        setSelectedPais(null)
        onChange(null)
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
          const paisSelecionado = suggestions[highlightedIndex]
          console.log("País selecionado por teclado:", paisSelecionado)
          handleSelectPais(paisSelecionado)
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
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label} {required && <span className="text-red-500">*</span>}
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
                if (inputValue.length >= 2 && !selectedPais) {
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
              {suggestions.map((pais, index) => (
                <div
                  key={pais.id_pais}
                  className={`
                    flex items-center px-2 py-1.5 text-sm rounded-sm relative cursor-default select-none
                    ${index === highlightedIndex ? "bg-gray-100" : ""}
                    ${selectedPais?.id_pais === pais.id_pais ? "font-medium" : ""}
                    hover:bg-gray-100
                  `}
                  onClick={() => handleSelectPais(pais)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {/* Check Icon */}
                  <svg
                    className={`mr-2 h-4 w-4 ${selectedPais?.id_pais === pais.id_pais ? "opacity-100" : "opacity-0"}`}
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
                  <span>{pais.nome}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
