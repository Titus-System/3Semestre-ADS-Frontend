export default function Sazonalidade({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl relative">
                <h2 className="text-2xl font-semibold mb-4">📅 O que é Sazonalidade?</h2>

                <p className="mb-3 text-gray-700">
                    <strong>Sazonalidade</strong> é um padrão de variação recorrente que ocorre em determinados períodos do ano. No contexto de comércio exterior, por exemplo, é comum que alguns produtos tenham aumento de exportações ou importações em meses específicos devido a colheitas, feriados, estações do ano, entre outros fatores.
                </p>

                <p className="mb-3 text-gray-700">
                    Para identificar a sazonalidade, é calculada a <strong>média de cada mês ao longo dos anos</strong>. Por exemplo, somam-se os valores de todos os meses de janeiro na série histórica e divide-se pelo número de anos:
                </p>

                <p className="mb-4 text-gray-700 font-mono bg-gray-100 p-2 rounded">
                    média_janeiro = (janeiro_2014 + janeiro_2015 +...+ janeiro_2024) / número_de_anos
                </p>

                <p className="mb-3 text-gray-700">
                    Isso permite entender como cada mês se comporta em relação aos demais, ajudando a identificar ciclos naturais e tomar decisões mais informadas com base nessas tendências.
                </p>

                <p className="text-gray-700">
                    A análise da sazonalidade é fundamental para planejamento estratégico, previsão de demanda e avaliação de desempenho ao longo do tempo.
                </p>

                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
                    onClick={onClose}
                >
                    &times;
                </button>
            </div>
        </div>
    )
}
