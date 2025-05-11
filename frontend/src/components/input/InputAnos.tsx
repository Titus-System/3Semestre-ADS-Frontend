import { useState, MouseEvent, JSX } from 'react';

interface InputAnosProps {
  onChange: (anosSelecionados: number[]) => void;
}

export default function InputAnos({ onChange }: InputAnosProps): JSX.Element {
  const anos: number[] = Array.from({ length: 2024 - 2014 + 1 }, (_, i) => 2014 + i);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [lastClicked, setLastClicked] = useState<number | null>(null);

  const toggleYear = (year: number, event: MouseEvent<HTMLButtonElement>): void => {
    let newSelection: number[] = [...selectedYears];

    if (event.shiftKey && lastClicked !== null) {
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
    onChange(newSelection); // ← envia os anos selecionados ao pai
  };

  return (
    <div className="flex flex-wrap gap-2 p-4">
      {anos.map((year) => (
        <button
          key={year}
          onClick={(e) => toggleYear(year, e)}
          className={`h-8 w-16 rounded-md border text-sm transition-all
            ${
              selectedYears.includes(year)
                ? 'bg-blue-600 text-white border-blue-700'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
            }`}
        >
          {year}
        </button>
      ))}
    </div>
  );
}
