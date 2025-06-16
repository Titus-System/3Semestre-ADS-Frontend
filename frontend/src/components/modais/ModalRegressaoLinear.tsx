import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

type Props = {
  onClose: () => void;
};

export default function ModalRegressaoLinear({ onClose }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 5);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {clearTimeout(timer); document.body.style.overflow = originalOverflow;}
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 50); 
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleClose}>
      <div onClick={(e) => e.stopPropagation()} className={`bg-white p-6 rounded-2xl w-10/12 md:w-2/3 lg:w-3/6 max-h-[70vh] overflow-y-auto relative shadow-xl transform transition-all duration-200 ease-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-600 text-xl font-bold hover:text-black"
        >
          &times;
        </button>
        
        <h2 className="text-2xl text-black font-semibold mb-4">📉 O que é Regressão Linear?</h2>

        <p className="mb-3 text-gray-700">
          A <strong>Regressão Linear</strong> é uma técnica estatística usada para identificar a relação entre duas variáveis: uma variável independente (nesse caso, o tempo) e uma variável dependente (como a balança comercial, por exemplo).
        </p>

        <p className="mb-3 text-gray-700">
          Ela ajusta uma linha reta que melhor representa a tendência dos dados ao longo do tempo, permitindo entender se a variável está aumentando, diminuindo ou se mantém estável.
        </p>

        <h3 className="text-xl font-semibold mb-2">📐 Como a regressão é calculada?</h3>
        <p className="mb-3 text-gray-700">
          Para cada ponto no tempo, convertemos a data em um número (timestamp) para poder usar como entrada no modelo. O modelo encontra a melhor reta que minimiza a diferença entre os valores reais e os valores previstos.
        </p>
        <p className="mb-4 text-gray-700 font-mono bg-gray-100 p-2 rounded">
          y = a + b * x
        </p>
        <p className="mb-3 text-gray-700">
          Onde:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li><strong>y</strong>: valor previsto da balança comercial</li>
          <li><strong>x</strong>: tempo (timestamp)</li>
          <li><strong>a</strong>: intercepto (valor inicial)</li>
          <li><strong>b</strong>: inclinação (taxa de crescimento ou decrescimento)</li>
        </ul>

      </div>
    </div>
  )

  return ReactDOM.createPortal(modalContent, document.getElementById("modal-root")!);
}
