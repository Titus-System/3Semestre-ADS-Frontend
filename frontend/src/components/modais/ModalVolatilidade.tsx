import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

type Props = {
  onClose: () => void;
};

export default function ModalVolatilidade({ onClose }: Props) {
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={handleClose}>
      <div className={`bg-white p-6 rounded-2xl w-10/12 md:w-2/3 lg:w-3/6 max-h-[58vh] sm:max-h-[70vh] overflow-y-auto relative shadow-xl transform transition-all duration-200 ease-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`} 
      onClick={(e) => e.stopPropagation()}>

        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-600 text-xl font-bold hover:text-black"
        >
          &times;
        </button>

        <h2 className="text-2xl text-black font-semibold mb-4">⚡ O que é Volatilidade?</h2>

        <p className="mb-3 text-gray-700">
          A <strong>Volatilidade</strong> é uma medida que mostra o quanto os valores da balança comercial variam ao longo do tempo. Ela indica a estabilidade ou instabilidade das suas exportações e importações.
        </p>

        <h3 className="text-xl font-semibold mb-2">Como calculamos a volatilidade?</h3>

        <p className="mb-3 text-gray-700">
          Calculamos a volatilidade usando o desvio padrão móvel dos últimos 6 meses, ou seja, verificamos quão dispersos estão os valores da balança comercial dentro de uma janela de 6 meses.
        </p>

        <p className="mb-4 text-gray-700 font-mono bg-gray-100 p-2 rounded text-center">
          volatilidadeₜ = std(balança_comercialₜ, balança_comercialₜ₋₁, ..., balança_comercialₜ₋₅)
        </p>

        <p className="mb-3 text-gray-700">
          Onde <em>std</em> é o desvio padrão, uma medida estatística que representa a variação dos valores em relação à média.
        </p>

        <p className="mb-3 text-gray-700">
          Quanto maior a volatilidade, mais os valores estão variando. Quanto menor, mais estáveis eles são.
        </p>

      </div>
    </div>
  )

  return ReactDOM.createPortal(modalContent, document.getElementById("modal-root")!);

}
