import { JSX, ReactNode } from "react";

interface BotaoBuscarProps {
  onClick: () => Promise<void> | void;
  isLoading?: boolean;
  children?: ReactNode;
  className?: string;
}

export default function BotaoBuscar({
  onClick,
  isLoading = false,
  children = "Buscar",
  className = "",
}: BotaoBuscarProps): JSX.Element {
  return (
    <div className="p-6 border-t border-gray-200 flex justify-center">
      <button
        onClick={onClick}
        disabled={isLoading}
        className={`bg-white rounded hover:bg-[#0a0a3d] text-gray-800 hover:text-white px-8 py-3 font-semibold text-lg shadow-lg transition-all duration-200 flex items-center h-12 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading ? (
          <>
            <div className="h-5 w-5 mr-2 animate-spin border-2 border-white border-t-transparent"></div>
            Buscando...
          </>
        ) : (
          <>
            <svg
              className="mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            {children}
          </>
        )}
      </button>
    </div>
  );
}
