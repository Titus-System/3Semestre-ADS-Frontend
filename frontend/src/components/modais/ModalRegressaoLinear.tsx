export default function ModalRegressaoLinear({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-50 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl relative">
        <h2 className="text-2xl text-black font-semibold mb-4">📉 O que é Regressão Linear?</h2>

        <p className="mb-3 text-gray-700">
          A <strong>Regressão Linear</strong> é uma técnica estatística usada para identificar a relação entre duas variáveis: uma variável independente (nesse caso, o tempo) e uma variável dependente (como a balança comercial, por exemplo).
        </p>

        <p className="mb-3 text-gray-700">
          Ela ajusta uma linha reta que melhor representa a tendência dos dados ao longo do tempo, permitindo entender se a variável está aumentando, diminuindo ou se mantém estável.
        </p>

        <h3 className="text-xl font-semibold mb-2">📐 Como a regressão é calculada?</h3>
        <p className="mb-3 text-gray-700">
          Para cada ponto no tempo, convertemos a data em um número (timestamp) para poder usar como entrada no modelo. O modelo encontra a melhor reta que minimiza a diferença entre os valores reais e os valores previstos.
        </p>
        <p className="mb-4 text-gray-700 font-mono bg-gray-100 p-2 rounded">
          y = a + b * x
        </p>
        <p className="mb-3 text-gray-700">
          Onde:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li><strong>y</strong>: valor previsto da balança comercial</li>
          <li><strong>x</strong>: tempo (timestamp)</li>
          <li><strong>a</strong>: intercepto (valor inicial)</li>
          <li><strong>b</strong>: inclinação (taxa de crescimento ou decrescimento)</li>
        </ul>

        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          &times;
        </button>
      </div>
    </div>
  )
}
