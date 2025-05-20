export default function ModalVolatilidade({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl relative">
        <h2 className="text-2xl font-semibold mb-4">⚡ O que é Volatilidade?</h2>

        <p className="mb-3 text-gray-700">
          A <strong>Volatilidade</strong> é uma medida que mostra o quanto os valores da balança comercial variam ao longo do tempo. Ela indica a estabilidade ou instabilidade das suas exportações e importações.
        </p>

        <h3 className="text-xl font-semibold mb-2">Como calculamos a volatilidade?</h3>

        <p className="mb-3 text-gray-700">
          Calculamos a volatilidade usando o desvio padrão móvel dos últimos 6 meses, ou seja, verificamos quão dispersos estão os valores da balança comercial dentro de uma janela de 6 meses.
        </p>

        <p className="mb-4 text-gray-700 font-mono bg-gray-100 p-2 rounded text-center">
          volatilidadeₜ = std(balança_comercialₜ, balança_comercialₜ₋₁, ..., balança_comercialₜ₋₅)
        </p>

        <p className="mb-3 text-gray-700">
          Onde <em>std</em> é o desvio padrão, uma medida estatística que representa a variação dos valores em relação à média.
        </p>

        <p className="mb-3 text-gray-700">
          Quanto maior a volatilidade, mais os valores estão variando. Quanto menor, mais estáveis eles são.
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
