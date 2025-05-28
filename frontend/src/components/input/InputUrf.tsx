interface InputUrfProps {
    onChange: (value: string) => void;
}

export default function InputUrf({ onChange }: InputUrfProps) {
    return (
        <div className="grid gap-2">
            <label className="text-sm text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Defina a URF:</label>
            <div className="relative">
                <div className="flex items-center">
                    <div className="relative w-full">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {/* Globe Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                <path d="M2 12h20"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="w-full h-12 pl-10 pr-10 py-2 rounded-md border border-gray-300
                bg-white text-gray-900 shadow-sm transition-colors
                focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-300"
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="Digite o código da URF"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
