import { useState, MouseEvent, JSX } from 'react';

interface InputAnosProps {
  onChange: (anosSelecionados: number[]) => void;
}

export default function InputAnos({ onChange }: InputAnosProps): JSX.Element {
  const anos: number[] = Array.from({ length: 2024 - 2014 + 1 }, (_, i) => 2014 + i);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [lastClicked, setLastClicked] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleYear = (year: number, event: MouseEvent<HTMLButtonElement>): void => {
    let newSelection: number[] = [...selectedYears];

    // Se já houver um ano selecionado e clicar em outro, seleciona o intervalo entre eles
    if (selectedYears.length === 1 && !event.shiftKey) {
      const start = Math.min(selectedYears[0], year);
      const end = Math.max(selectedYears[0], year);
      const range: number[] = anos.filter((y) => y >= start && y <= end);
      newSelection = range;
    } else if (event.shiftKey && lastClicked !== null) {
      const start = Math.min(lastClicked, year);
      const end = Math.max(lastClicked, year);
      const range: number[] = anos.filter((y) => y >= start && y <= end);
      newSelection = Array.from(new Set([...newSelection, ...range]));
    } else if (newSelection.includes(year)) {
      newSelection = newSelection.filter((y) => y !== year);
    } else {
      newSelection.push(year);
    }

    setSelectedYears(newSelection);
    setLastClicked(year);
    onChange(newSelection);
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      <label className="text-sm text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Selecione o período:
      </label>
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="bg-white w-full text-indigo-900 px-4 py-2 rounded-md shadow flex items-center space-x-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-indigo-900"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-left">
          {expanded ? 'Ocultar Anos' : 'Selecionar Anos'}
        </span>
      </button>


      {expanded && (
        <div className="flex flex-wrap gap-2 p-2 rounded-lg shadow-inner bg-indigo-950">
          {anos.map((year) => (
            <button
              key={year}
              onClick={(e) => toggleYear(year, e)}
              className={`h-8 w-16 rounded-md border text-sm transition-all
                ${selectedYears.includes(year)
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                }`}
            >
              {year}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {/* Chevrons Up Down Icon */}
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
                  <path d="m7 15 5 5 5-5"></path>
                  <path d="m7 9 5-5 5 5"></path>
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
