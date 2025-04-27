import logosemfundo from "../assets/logosemfundo.png";
import { useState } from "react";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            {/* Degradê de fundo */}
            <div className="absolute inset-0 h-96 bg-gradient-to-b from-[#0A0A37] to-transparent pointer-events-none">
        </div>

        <header className="relative z-10 bg-transparent text-white p-4">
            <div className="container mx-auto flex justify-between items-center gap-3"> {/* Adicionado gap */}
                {/* Logo e Título */}
                <div className="flex items-center gap-x-2 sm:gap-x-4 flex-shrink-0">
                    <img
                        src={logosemfundo}
                        alt="Logo"
                        className="w-20 h-20 object-contain"
                    />
                    <h1 className="text-xl sm:text-2xl font-bold self-center">
                        InsightFlow
                    </h1>
                </div>

                {/* Navegação */}
                <nav className={`${isOpen ? "block" : "hidden"} sm:flex flex-grow justify-end`}>
                    <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
                        <li>
                            <a href="/" className="hover:underline text-sm sm:text-base">
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                href="/consulta_detalhamento"
                                className="hover:underline text-sm sm:text-base"
                            >
                                Consulta e Detalhamento
                            </a>
                        </li>
                        <li>
                            <a
                                href="/analise_comparacoes"
                                className="hover:underline text-sm sm:text-base"
                            >
                                Análise e Comparações
                            </a>
                        </li>
                    </ul>
                </nav>

                {/* Botão Hambúrguer */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="sm:hidden text-white text-2xl focus:outline-none"
                >
                    ☰
                </button>
            </div>
        </header>
       </div> 
    );
}
