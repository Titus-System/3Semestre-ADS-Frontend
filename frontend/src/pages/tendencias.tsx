"use client"

import { useEffect, useState } from "react"
import InputEstado from "../components/input/inputEstado"
import InputPais from "../components/input/inputPais"
import PainelEstatisticasAuxiliares from "../components/paineis/PainelEstatisticasAuxiliaresVlfob"
import PainelEstatisticasBalancaComercial from "../components/paineis/PainelEstatisticasBalancaComercial"
import PainelEstatisticasVlfob from "../components/paineis/PainelEstatisticasVlfob"
import InputNcm from "../components/input/inputNcm"
import { Mercadoria, Sh4 } from "../models/interfaces"
import PainelVlFobVa from "../components/paineis/PainelVlfobVa"
import PainelSh4 from "../components/paineis/PainelSh4"
import InputSh4 from "../components/input/InputSh4"
import PainelTendencias from "../components/paineis/PainelTendencias"

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
    const [mercadoria, setMercadoriaSelecionada] = useState<Mercadoria | null>(null)
    const [sh4, setSh4] = useState<Sh4 | null>(null);


    useEffect(() => {
        setEstadoSelecionado(null)
        setPaisSelecionado(null)
    }, [])

    return (
        <div className="relative z-10 p-8">
            <h2 className="text-white mb-4 text-4xl font-bold text-center">Séries históricas e análises de tendências</h2>
            <div className="w-full max-w-full mx-auto space-y-6">
                <div className="grid grid-cols-1 px-8 md:grid-cols-3 gap-4">
                    <InputEstado
                        onChange={(estado) => {
                            setEstadoSelecionado(estado)
                        }}
                    />

                    <InputPais
                        onChange={(pais) => {
                            setPaisSelecionado(pais)
                        }}
                    />

                    <InputNcm
                        onChange={(mercadoria) => {
                            setMercadoriaSelecionada(mercadoria)
                        }}
                    />

                    <InputSh4
                        onChange={(sh4) => {
                            setSh4(sh4)
                        }}
                    />
                </div>
            </div>

            <div className="p-8 text-white">
                <p className="text-white text-sm italic">* Previsões calculadas usando SARIMA</p>
                <div className="bg-white/10 border border-white/20 backdrop-blur rounded-lg shadow-lg p-6 flex grid gap-6">
                    <PainelTendencias 
                        estado={estadoSelecionado}
                        pais={paisSelecionado}
                        ncm={mercadoria}
                    />
                    {/* <PainelVlFobVa
                        estado={estadoSelecionado}
                        pais={paisSelecionado}
                        ncm={mercadoria}
                    /> */}

                    <div className="flex flex-row gap-6">
                        <PainelEstatisticasVlfob
                            ncm={mercadoria?.id_ncm}
                            estado={estadoSelecionado?.id_estado}
                            pais={paisSelecionado?.id_pais}
                        />
                        <PainelEstatisticasBalancaComercial
                            ncm={mercadoria?.id_ncm}
                            estado={estadoSelecionado?.id_estado}
                            pais={paisSelecionado?.id_pais}
                        />
                        </div>
                        <div className="w-full">
                        <PainelEstatisticasAuxiliares
                            ncm={mercadoria?.id_ncm}
                            estado={estadoSelecionado?.id_estado}
                            pais={paisSelecionado?.id_pais}
                        />
                        </div>
                </div>
                {/* <div>
                    {sh4 && (
                        <PainelSh4 sh4={sh4?.id_sh4} />
                    )}
                </div> */}
            </div>
        </div>
    )
}
