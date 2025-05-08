"use client"

import { useEffect, useState } from "react"
import GraficoBalancaComercial from "../components/tendencias/GraficoBalancaComercial"
import { buscarTendenciaBalancaComercial, buscarTendenciaVa, buscarTendenciaVlFob } from "../services/tendenciaServices"
import InputEstado from "../components/tendencias/inputEstado"
import InputPais from "../components/tendencias/inputPais"
import GraficoValorAgregado from "../components/tendencias/GraficoValorAgregado"

interface Data {
  ds: string
  yhat: number
}
interface Estado {
  id_estado: number
  nome: string
  sigla: string
}
interface Pais {
  id_pais: number
  nome: string
}

export default function Previsao() {
    const [estadoSelecionado, setEstadoSelecionado] = useState<Estado | null>(null)
    const [paisSelecionado, setPaisSelecionado] = useState<Pais | null>(null)

    const [dadosExportacao, setDadosExportacao] = useState<Data[]>([])
    const [dadosImportacao, setDadosImportacao] = useState<Data[]>([])
    const [dadosBalanca, setDadosBalanca] = useState<Data[]>([])

    const [dadosVaImp, setDadosVaImp] = useState<Data[]>([])
    const [dadosVaExp, setDadosVaExp] = useState<Data[]>([])

    const [isLoading, setIsLoading] = useState(false)
    const [tituloBalanca, setTituloBalanca] = useState<string>("")
    const [tituloVa, setTituloVa] = useState<string>("")


    const montarTitulos = () => {
        let tituloBc = `Balança comercial`;
        let tituloVa = "Valor Agregado";

        let complemento = estadoSelecionado ? ` de ${estadoSelecionado.sigla}` : ' do Brasil';
        if (paisSelecionado) {
            complemento += ` com ${paisSelecionado.nome}`;
        }
        tituloBc += complemento;
        tituloVa += complemento;
        setTituloBalanca(tituloBc);
        setTituloVa(tituloVa);
    }

    const buscarVlFob = async () => {
        setIsLoading(true)
        setTimeout(async () => {
            console.log("Buscando dados para:", { 
                estado: estadoSelecionado?.id_estado, 
                pais: paisSelecionado?.id_pais 
            })
            
            try {
                const [dadosExp, dadosImp, dadosBal] = await Promise.all([
                buscarTendenciaVlFob("exp", estadoSelecionado?.id_estado, paisSelecionado?.id_pais),
                buscarTendenciaVlFob("imp", estadoSelecionado?.id_estado, paisSelecionado?.id_pais),
                buscarTendenciaBalancaComercial(estadoSelecionado?.id_estado, paisSelecionado?.id_pais),
                ])
        
                setDadosExportacao(dadosExp)
                setDadosImportacao(dadosImp)
                setDadosBalanca(dadosBal)
            } catch (error) {
                console.error("Erro ao buscar dados:", error)
            }
            setIsLoading(false)
        })
    }

    const buscarVa = async() => {
        setIsLoading(true)
        setTimeout(async () => {
            console.log("Buscando dados para:", { 
                estado: estadoSelecionado?.id_estado, 
                pais: paisSelecionado?.id_pais 
            })
            
            try {
                const [vaImp, vaExp] = await Promise.all([
                buscarTendenciaVa('imp', estadoSelecionado?.id_estado, paisSelecionado?.id_pais),
                buscarTendenciaVa('exp', estadoSelecionado?.id_estado, paisSelecionado?.id_pais)
                ])
                setDadosVaExp(vaExp)
                setDadosVaImp(vaImp)
            } catch (error) {
                console.error("Erro ao buscar dados:", error)
            }
            setIsLoading(false)
        })
    }

    const buscarDados = async() => {
        buscarVlFob()
        buscarVa()
    }

    useEffect(() => {
        setEstadoSelecionado(null)
        setPaisSelecionado(null)
        buscarDados()
        montarTitulos()
    }, [])

    return (
        <div className="relative z-10 p-8">
            <h2 className="text-white mb-4 text-4xl font-bold text-center">Séries históricas e análises de tendências</h2>
            <div className="w-full max-w-3xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputEstado
                    label="Defina o estado:"
                    onChange={(estado) => {
                        console.log("Estado recebido do componente:", estado)
                        setEstadoSelecionado(estado)
                    }}
                    placeholder="Digite o nome do estado"
                />

                <InputPais
                    label="Defina o país de origem/destino:"
                    onChange={(pais) => {
                        console.log("País recebido do componente: ", pais)
                        setPaisSelecionado(pais)
                    }}
                    placeholder="Digite o nome do país"
                />
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-center">
                <button
                    onClick={buscarDados}
                    className="bg-[#11114E] hover:bg-[#0a0a3d] text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition-all duration-200 flex items-center h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? (
                    <>
                        <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Buscando...
                    </>
                    ) : (
                    <>
                        <svg
                        className="mr-2 h-5 w-5"
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
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                        </svg>
                        Buscar
                    </>
                    )}
                </button>
                </div>
            </div>

            <div className="p-8 text-black">
                <p className="text-white text-sm italic">* Previsões calculadas usando SARIMA</p>
                <div className="p-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">{tituloBalanca}</h2>
                    <GraficoBalancaComercial
                        dadosExportacao={dadosExportacao}
                        dadosImportacao={dadosImportacao}
                        dadosBalanca={dadosBalanca}
                    />
                    <h2 className="text-xl font-semibold mb-4 mt-8 text-gray-800">{tituloVa}</h2>
                    <GraficoValorAgregado
                        dadosExportacao={dadosVaExp}
                        dadosImportacao={dadosVaImp} 
                    />
                </div>
            </div>
        </div>
    )
}
