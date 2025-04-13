import logosemfundo from "../assets/logosemfundo.png";
import { useState } from "react";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-[#0A0A37] text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo e Título */}
                <div className="flex items-center gap-x-2 sm:gap-x-4">
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
                <nav className={`${isOpen ? "block" : "hidden"} sm:flex`}>
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
    );
}