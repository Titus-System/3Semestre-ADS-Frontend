import { useEffect, useState } from "react";
import GraficoTendenciasSh4 from "../graficos/GraficoTendenciasSh4";
import { buscaSh4Info } from "../../services/shService";

type Props = {
    sh4: string
}

interface Sh4Info {
  descricao: string;
  id_sh4: string;
  ncm: number[];
}

export default function PainelSh4({ sh4 }: Props) {
    if (!sh4) {
        return
    }
    const [sh4Info, setSh4Info] = useState<Sh4Info | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        async function carregarInfo() {
            try {
                const resultado = await buscaSh4Info(sh4);
                setSh4Info(resultado);
            } catch (err) {
                setErro("Erro ao carregar informações do SH4.");
            } finally {
                setLoading(false);
            }
        }

        carregarInfo();
    }, [sh4]);

    if (loading) {
        return (
            <div className="bg-white/10 rounded-lg p-4 text-gray-200 animate-pulse">
                Carregando informações do sh4...
            </div>
        );
    }

    if (erro || !sh4Info) {
        return (
            <div className="bg-red-100 text-red-800 rounded-lg p-4">
                {erro ?? "Dados não disponíveis."}
            </div>
        );
    }

    return (
        <div className="bg-white/5 rounded-lg border border-gray-200 overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="bg-white/10 px-5 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-white flex items-center">
                    <span className="inline-block w-4 h-4 mr-2 bg-blue-500 rounded-sm"></span>
                    SH4 : {sh4}
                </h3>
            </div>
            <div className="p-5 text-gray-100">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <dt className="text-sm font-medium text-gray-300">Descrição</dt>
                        <dd className="text-lg font-semibold text-white">{sh4Info.descricao}</dd>
                    </div>
                    <div className="md:col-span-2">
                        <dt className="text-sm font-medium text-gray-300">Códigos NCM</dt>
                        <dd className="text-white font-mono">
                            {sh4Info.ncm.map((n:any) => n.toString().padStart(8, '0')).join(', ')}
                        </dd>
                    </div>
                </dl>
            </div>
            <GraficoTendenciasSh4
                sh4={sh4}
            />
        </div>
    );
}