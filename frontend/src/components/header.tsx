import logosemfundo from "../assets/logosemfundo.png";
import { useState } from "react";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative bg-[#11114e]">
            <div className="">
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
                                href="/funcionalidades"
                                className="hover:underline text-sm sm:text-base"
                            >
                                Funcionalidades
                            </a>
                        </li>
                        <li>
                            <a
                                href="/sobreNos"
                                className="hover:underline text-sm sm:text-base"
                            >
                                Sobre Nós 
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
