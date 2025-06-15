import { useEffect, useRef } from "react";
import Transacao from "../models/transacao";

interface DetalhesTransacaoModalProps {
    isOpen: boolean;
    onClose: () => void;
    transacao?: Transacao ; // Substitua por uma interface mais específica quando tiver os detalhes
}

export default function DetalhesTransacaoModal({ isOpen, onClose, transacao }: DetalhesTransacaoModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
<div className="absolute fixed inset-0 min-h-screen bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
  <div
    ref={modalRef}
    className="bg-indigo-950 border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-white"
  >
    {/* Cabeçalho */}
    <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
      <h2 className="text-2xl font-bold">Detalhes da Transação</h2>
      <button
        onClick={onClose}
        className="text-white hover:text-red-400 transition-colors duration-200"
        aria-label="Fechar modal"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {/* Corpo */}
    <div className="space-y-4">
      {transacao && Object.entries(transacao).map(([key, value]) => (
        <div key={key} className="grid grid-cols-2 gap-4 bg-white/5 rounded-lg p-3 hover:bg-white/10 transition">
          <div className="font-semibold text-white/80">
            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
          <div className="text-white">
            {value?.toString() || '-'}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

    );
} 