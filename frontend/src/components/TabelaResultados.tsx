interface Transacao {
    id_transacao: number;
    id_pais: number;
    ano: number;
}

interface TabelaResultadosProps {
    transacoes: Transacao[];
    tipoProcesso: "exp" | "imp" | null;
}

export default function TabelaResultados({ transacoes, tipoProcesso }: TabelaResultadosProps) {
    if (transacoes.length === 0) return null;

    return (
        <div className="w-full max-w-5xl overflow-x-auto mt-8">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-sm">
                <thead className="bg-gray-900 text-white">
                    <tr>
                        <th className="px-4 py-2 text-left">#</th>
                        <th className="px-4 py-2 text-left">ID Transação</th>
                        <th className="px-4 py-2 text-left">País</th>
                        <th className="px-4 py-2 text-left">Ano</th>
                        <th className="px-4 py-2 text-left">Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    {transacoes.map((transacao, idx) => (
                        <tr key={idx} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="px-4 py-2">{idx + 1}</td>
                            <td className="px-4 py-2">{transacao.id_transacao}</td>
                            <td className="px-4 py-2">{transacao.id_pais}</td>
                            <td className="px-4 py-2">{transacao.ano}</td>
                            <td className="px-4 py-2">{tipoProcesso}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 