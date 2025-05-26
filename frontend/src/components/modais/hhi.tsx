type Props = {
    onClose: () => void;
};

export default function Hhi({ onClose }: Props) {
    return (
        <div className="fixed inset-50 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl relative">
                <h2 className="text-2xl text-black font-semibold mb-4">📊 O que é o Índice HHI?</h2>

                <p className="mb-3 text-gray-700">
                    O <strong>Índice de Herfindahl-Hirschman (HHI)</strong> é uma métrica usada para medir o grau de concentração de mercado. No comércio internacional, ele ajuda a identificar se as <strong>exportações</strong> ou <strong>importações</strong> estão distribuídas entre vários parceiros ou concentradas em poucos.
                </p>

                <p className="mb-3 text-gray-700">
                    O HHI varia de 0 a 1:
                </p>
                <ul className="list-disc list-inside mb-4 text-gray-700">
                    <li><strong>HHI &lt; 0.15</strong> → Mercado <span className="text-green-600 font-medium">não concentrado</span></li>
                    <li><strong>0.15 ≤ HHI ≤ 0.25</strong> → Mercado <span className="text-yellow-600 font-medium">moderadamente concentrado</span></li>
                    <li><strong>HHI &gt; 0.25</strong> → Mercado <span className="text-red-600 font-medium">altamente concentrado</span></li>
                </ul>

                <h3 className="text-xl font-semibold mb-2">📐 Como o HHI é calculado?</h3>
                <p className="mb-3 text-gray-700">
                    Para cada mês, calcula-se a participação percentual de cada país ou estado no total exportado ou importado. Em seguida, essas participações são elevadas ao quadrado e somadas:
                </p>
                <p className="mb-4 text-gray-700 font-mono bg-gray-100 p-2 rounded">
                    participação = valor_parceiro / valor_total_do_mês
                </p>
                <p className="mb-4 text-gray-700 font-mono bg-gray-100 p-2 rounded">
                    HHI = (p₁² + p₂² + ... + pₙ²)
                </p>
                <p className="text-gray-700">
                    Onde <em>p₁, p₂, ..., pₙ</em> são as participações (em proporção, ex: 0.25 para 25%) de cada parceiro comercial no mês.
                </p>

                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
                    onClick={onClose}
                    aria-label="Fechar modal"
                >
                    &times;
                </button>
            </div>
        </div>
    )
}