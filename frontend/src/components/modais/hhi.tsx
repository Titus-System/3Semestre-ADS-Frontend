import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

type Props = {
  onClose: () => void;
};

export default function Hhi({ onClose }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Ativa a animação de entrada logo após montagem
    const timer = setTimeout(() => setIsVisible(true), 5);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {clearTimeout(timer); document.body.style.overflow = originalOverflow;}
  }, []);

  const handleClose = () => {
    // Anima saída antes de fechar o modal
    setIsVisible(false);
    setTimeout(onClose, 50); // espera a animação de saída terminar
  };

    const modalContent = (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleClose}>
            <div onClick={(e) => e.stopPropagation()} className={`bg-white p-6 rounded-2xl w-10/12 md:w-2/3 lg:w-3/6 max-h-[58vh] sm:max-h-[70vh] overflow-y-auto relative shadow-xl transform transition-all duration-200 ease-out
            ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>

                <button onClick={handleClose} className="absolute top-2 right-2 text-gray-600 text-xl font-bold hover:text-black">
                    &times;
                </button>

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

            </div>
        </div>
    )
    return ReactDOM.createPortal(modalContent, document.getElementById("modal-root")!);
}