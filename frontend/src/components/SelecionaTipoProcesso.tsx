interface SelecionaTipoProcessoProps {
    tipoProcesso: "exp" | "imp" | null;
    setTipoProcesso: (tipo: "exp" | "imp" | null) => void;
}

export default function SelecionaTipoProcesso({ tipoProcesso, setTipoProcesso }: SelecionaTipoProcessoProps) {
    return (
        <div className="flex flex-col space-y-2 w-full">
            <label className="text-black text-xl font-semibold">Tipo de processo:</label>
            <div className="inline-flex rounded-md shadow-sm">
                <button
                    onClick={() => setTipoProcesso("exp")}
                    className={`p-3 border border-gray-300 rounded-l-full w-1/2 h-16 font-bold ${
                        tipoProcesso === "exp"
                            ? "bg-gray-900 text-white"
                            : "bg-white text-gray-900 hover:bg-gray-300"
                    }`}
                >
                    Exportação
                </button>
                <button
                    onClick={() => setTipoProcesso("imp")}
                    className={`p-3 border border-gray-300 border-l-0 rounded-r-full w-1/2 h-16 font-bold ${
                        tipoProcesso === "imp"
                            ? "bg-gray-900 text-white"
                            : "bg-white text-gray-900 hover:bg-gray-300"
                    }`}
                >
                    Importação
                </button>
            </div>
        </div>
    );
} 