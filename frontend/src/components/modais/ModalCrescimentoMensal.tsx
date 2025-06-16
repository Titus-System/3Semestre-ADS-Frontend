import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

type Props = {
  onClose: () => void;
};

export default function ModalCrescimentoMensal({ onClose }: Props) {
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-white p-6 rounded-2xl w-10/12 md:w-2/3 lg:w-3/6 max-h-[70vh] overflow-y-auto relative shadow-xl
          transform transition-all duration-200 ease-out
          ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-600 text-xl font-bold hover:text-black"
        >
          &times;
        </button>

        {/* Conteúdo explicativo interno */}
        <h2 className="text-2xl text-black font-semibold mb-4">📈 O que é Crescimento Mensal?</h2>

        <p className="mb-3 text-gray-700">
          O <strong>crescimento mensal</strong> mostra a variação percentual da balança comercial de um mês para o seguinte. Ele indica se o comércio está aumentando ou diminuindo ao longo do tempo.
        </p>

        <h3 className="text-xl font-semibold mb-2">Como calculamos o crescimento mensal?</h3>

        <p className="mb-3 text-gray-700">
          Calculamos o crescimento mensal usando a variação percentual entre o valor da balança comercial de um mês e o mês anterior:
        </p>

        <p className="mb-4 text-gray-700 font-mono bg-gray-100 p-2 rounded text-center">
          crescimentoₜ = ((balança_comercialₜ - balança_comercialₜ₋₁) / balança_comercialₜ₋₁) × 100
        </p>

        <p className="mb-3 text-gray-700">
          Um valor positivo indica crescimento, enquanto um valor negativo indica queda na balança comercial em relação ao mês anterior.
        </p>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.getElementById("modal-root")!);
}


