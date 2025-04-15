interface InputPesquisaProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function InputPesquisa({ label, value, onChange, placeholder = "" }: InputPesquisaProps) {
    return (
        <div className="flex flex-col space-y-2 w-full">
            <label className="text-black text-xl font-semibold">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="bg-white text-gray-900 text-md font-medium p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-16"
            />
        </div>
    );
} 