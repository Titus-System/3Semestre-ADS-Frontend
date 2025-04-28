import { useState } from "react";
import DetalhesTransacaoModal from "./DetalhesTransacaoModal";

interface Transacao {
    id_transacao: number;
    id_pais: number;
    ano: number;
    [key: string]: string | number | boolean | null;
}

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

    return (
        <>
            <div className="w-full max-w-5xl overflow-x-auto mt-8">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-sm">
                    <thead className="bg-gray-900 text-white">
                        <tr>
                            <th className="px-4 py-2 text-left">
                                ID
                            </th>
                            <th className="px-4 py-2 text-left">
                                País
                            </th>
                            <th className="px-4 py-2 text-left">
                                Ano
                            </th>
                            <th className="px-4 py-2 text-left">
                                Tipo
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {transacoes.map((transacao) => (
                            <tr
                                key={transacao.id_transacao}
                                onClick={() => handleRowClick(transacao)}
                                className="hover:bg-gray-50 cursor-pointer"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {transacao.id_transacao}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {transacao.nome_pais}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {transacao.ano}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {tipoProcesso === "exp" ? "Exportação" : "Importação"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <DetalhesTransacaoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transacao={selectedTransacao}
            />
        </>
    );
} 