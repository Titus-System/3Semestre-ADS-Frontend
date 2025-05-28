export default function ModalCrescimentoMensal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-50 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl relative">
        <h2 className="text-2xl text-black font-semibold mb-4">📈 O que é Crescimento Mensal?</h2>

        <p className="mb-3 text-gray-700">
          O <strong>crescimento mensal</strong> mostra a variação percentual da balança comercial de um mês para o seguinte. Ele indica se o comércio está aumentando ou diminuindo ao longo do tempo.
        </p>

        <h3 className="text-xl font-semibold mb-2">Como calculamos o crescimento mensal?</h3>

        <p className="mb-3 text-gray-700">
          Calculamos o crescimento mensal usando a variação percentual entre o valor da balança comercial de um mês e o mês anterior:
        </p>

        <p className="mb-4 text-gray-700 font-mono bg-gray-100 p-2 rounded text-center">
          crescimentoₜ = ((balança_comercialₜ - balança_comercialₜ₋₁) / balança_comercialₜ₋₁) × 100
        </p>

        <p className="mb-3 text-gray-700">
          Um valor positivo indica crescimento, enquanto um valor negativo indica queda na balança comercial em relação ao mês anterior.
        </p>

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
