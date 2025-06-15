import { useState } from "react";
import DetalhesTransacaoModal from "./DetalhesTransacaoModal";
import Transacao from "../models/transacao";

interface TabelaResultadosProps {
    transacoes: Transacao[];
    tipoProcesso: "exp" | "imp" | null;
}

export default function TabelaResultados({ transacoes, tipoProcesso }: TabelaResultadosProps) {
    const [selectedTransacao, setSelectedTransacao] = useState<Transacao | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRowClick = (transacao: Transacao) => {
        setSelectedTransacao(transacao);
        setIsModalOpen(true);
    };
    console.log("transacoes: ", transacoes);
    return (
        <>
            <div className="relative w-full rounded-lg border overflow-x-auto mt-8 mx-auto">
                <table className="min-w-full bg-indigo-950 border border-white/20 shadow-xl rounded-xl text-sm text-white">
                    <thead className="bg-indigo-900 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left border-b border-white/10">ID</th>
                            <th className="px-4 py-3 text-left border-b border-white/10">País</th>
                            <th className="px-4 py-3 text-left border-b border-white/10">Ano</th>
                            <th className="px-4 py-3 text-left border-b border-white/10">Tipo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {transacoes.map((transacao) => (
                            <tr
                                key={transacao.id_transacao}
                                onClick={() => handleRowClick(transacao)}
                                className="hover:bg-indigo-800 transition-colors duration-200 cursor-pointer"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">{transacao.id_transacao}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{transacao.nome_pais}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{transacao.ano}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {tipoProcesso === "exp" ? "Exportação" : "Importação"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <DetalhesTransacaoModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    transacao={selectedTransacao ? selectedTransacao : undefined}
                />
            </div>
        </>
    );
} 