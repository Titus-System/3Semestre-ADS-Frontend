import logosemfundo from "../assets/logosemfundo.png";
import { useState } from "react";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="relative z-50">
            <header className="relative z-50 bg-[#11114e] text-white p-4">
                <div className="container mx-auto flex justify-between items-center gap-3">
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

                    {/* Navegação Desktop */}
                    <nav className="hidden sm:flex flex-grow justify-end">
                        <ul className="flex flex-row space-x-6">
                            <li>
                                <a href="/" className="text-base font-semibold hover:text-[#d72c38]">Home</a>
                            </li>
                            <li className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 text-base font-semibold hover:text-[#d72c38] transition-colors duration-300"
                                >
                                    Funcionalidades
                                    <svg
                                        className={`w-4 h-4 text-[#d72c38] transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                {dropdownOpen && (
                                    <ul className="absolute top-full left-0 mt-3 min-w-[220px] bg-gray-900 rounded-xl shadow-xl text-gray-100 z-50 ring-1 ring-blue-800 ring-opacity-30 animate-dropdown-smooth">
                                        {[
                                            { href: "/consulta_estado", label: "Análise de Estados" },
                                            { href: "/info", label: "Busca de Informações" },
                                            { href: "/paginaRanking", label: "Rankeamento" },
                                            { href: "/previsao", label: "Previsão de Tendências" },
                                        ].map(({ href, label }) => (
                                            <li key={href}>
                                                <a
                                                    href={href}
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="block px-6 py-3 text-sm hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-900 hover:text-white transition-colors rounded-lg"
                                                >
                                                    {label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                            <li>
                                <a href="/sobreNos" className="text-base font-semibold hover:text-[#d72c38]">Sobre Nós</a>
                            </li>
                        </ul>
                    </nav>

                    {/* Botão Hambúrguer (Mobile) */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="sm:hidden text-white text-2xl focus:outline-none relative z-[60]"
                    >
                        ☰
                    </button>
                </div>

                {/* Menu Mobile flutuante */}
                {isOpen && (
                    <div className="absolute right-4 top-15 w-56 bg-[#11114e]/95 rounded-xl shadow-xl ring-1 ring-blue-700 ring-opacity-30 z-[55] p-4 sm:hidden animate-fade-down">
                        <ul className="flex flex-col space-y-3">
                            <li>
                                <a href="/" className="text-sm font-semibold hover:text-[#d72c38]">Home</a>
                            </li>
                            <li>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 text-sm font-semibold hover:text-[#d72c38]"
                                >
                                    Funcionalidades
                                    <svg
                                        className={`w-4 h-4 text-[#d72c38] transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                {dropdownOpen && (
                                    <ul className="mt-2 ml-4 space-y-1">
                                        {[
                                            { href: "/consulta_estado", label: "Análise de Estados" },
                                            { href: "/info", label: "Busca de Informações" },
                                            { href: "/paginaRanking", label: "Rankeamento" },
                                            { href: "/previsao", label: "Previsão de Tendências" },
                                        ].map(({ href, label }) => (
                                            <li key={href}>
                                                <a
                                                    href={href}
                                                    onClick={() => {
                                                        setDropdownOpen(false);
                                                        setIsOpen(false);
                                                    }}
                                                    className="block px-4 py-2 text-sm hover:bg-blue-900 rounded-md transition"
                                                >
                                                    {label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                            <li>
                                <a href="/sobreNos" className="text-sm font-semibold hover:text-[#d72c38]">Sobre Nós</a>
                            </li>
                        </ul>
                    </div>
                )}
            </header>
        </div>
    );
}
