import { useEffect, useRef } from "react";
import Transacao from "../models/transacao";

interface DetalhesTransacaoModalProps {
    isOpen: boolean;
    onClose: () => void;
    transacao: Transacao; // Substitua por uma interface mais específica quando tiver os detalhes
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div 
                ref={modalRef}
                className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Detalhes da Transação</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-4">
                    {transacao && Object.entries(transacao).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 gap-4">
                            <div className="font-medium text-gray-700">
                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                            </div>
                            <div className="text-gray-900">
                                {value?.toString() || '-'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 