import { JSX } from "react";

interface Props {
  tipoProcesso: "exp" | "imp" | null;
  setTipoProcesso: (tipo: "exp" | "imp" | null) => void;
}

export default function InputTipo({ tipoProcesso, setTipoProcesso }: Props): JSX.Element {
  const handleClick = (tipo: "exp" | "imp") => {
    setTipoProcesso(tipoProcesso === tipo ? null : tipo);
  };

  return (
    <div className="grid gap-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Tipo de Processo
        </label>
      <div className="inline-flex rounded-md shadow-sm w-full">
        <button
          onClick={() => handleClick("exp")}
          className={`p-3 border border-gray-300 rounded-l-md w-1/2 h-12 ${
            tipoProcesso === "exp"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-900 hover:bg-gray-300"
          }`}
        >
          Exportação
        </button>
        <button
          onClick={() => handleClick("imp")}
          className={`p-3 border border-gray-300 border-l-0 rounded-r-md w-1/2 h-12  ${
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
