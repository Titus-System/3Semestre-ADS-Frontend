import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

type Props = {
  onClose: () => void;
};

export default function Sazonalidade({ onClose }: Props) {
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
            <div onClick={(e) => e.stopPropagation()}
                className={`
                bg-white p-6 rounded-2xl w-10/12 md:w-2/3 lg:w-3/6 max-h-[58vh] sm:max-h-[70vh] overflow-y-auto relative shadow-xl
                transform transition-all duration-200 ease-out
                ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
            `}>
                <button onClick={handleClose} className="absolute top-2 right-2 text-gray-600 text-xl font-bold hover:text-black">
                    &times;
                </button>

                <h2 className="text-2xl text-black font-semibold mb-4">📅 O que é Sazonalidade?</h2>

                <p className="mb-3 text-gray-700">
                    <strong>Sazonalidade</strong> é um padrão de variação recorrente que ocorre em determinados períodos do ano. No contexto de comércio exterior, por exemplo, é comum que alguns produtos tenham aumento de exportações ou importações em meses específicos devido a colheitas, feriados, estações do ano, entre outros fatores.
                </p>

                <p className="mb-3 text-gray-700">
                    Para identificar a sazonalidade, é calculada a <strong>média de cada mês ao longo dos anos</strong>. Por exemplo, somam-se os valores de todos os meses de janeiro na série histórica e divide-se pelo número de anos:
                </p>

                <p className="mb-4 text-gray-700 font-mono bg-gray-100 p-2 rounded">
                    média_janeiro = (janeiro_2014 + janeiro_2015 +...+ janeiro_2024) / número_de_anos
                </p>

                <p className="mb-3 text-gray-700">
                    Isso permite entender como cada mês se comporta em relação aos demais, ajudando a identificar ciclos naturais e tomar decisões mais informadas com base nessas tendências.
                </p>

                <p className="text-gray-700">
                    A análise da sazonalidade é fundamental para planejamento estratégico, previsão de demanda e avaliação de desempenho ao longo do tempo.
                </p>

            </div>
        </div>
    )

    return ReactDOM.createPortal(modalContent, document.getElementById("modal-root")!);
}
