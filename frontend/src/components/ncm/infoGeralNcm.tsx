import { useEffect, useState } from "react";
import { buscaPorNcm } from "../../services/ncmService";


type Props = {
    ncm: number | null,
    tipo?: "exp" | "imp" | null,
    anos?: number[],
    estados?: number[],
    paises?: number[],
    transporte?: number[],
    urf?: number[],
}

interface ncmInfo {
    produto_descricao: string
    sh4_descricao: string
    total_kg_liquido_exp: number
    total_kg_liquido_imp: number
    total_valor_agregado_exp: number
    total_valor_agregado_imp: number
    total_valor_fob_exp: number
    total_valor_fob_imp: number
}

const formatNumber = (num: number) => {
    return new Intl.NumberFormat("pt-BR").format(num)
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)
}

export default function InfoGeralNcm({ ncm, anos, tipo, estados, paises, transporte, urf }: Props) {

    const [totalGeral, setTotalGeral] = useState<ncmInfo | null>(null);
    const buscaTotal = async (ncm: number | null) => {
        if (ncm) {
            const info: ncmInfo[] = await buscaPorNcm([ncm]);
            setTotalGeral(info[0]);
            console.log("totalGeral: ", info)
        }
    }

    const [totalFiltrado, setTotalFiltrado] = useState<ncmInfo | null>(null);
    const buscaTotalFiltrado = async (ncm: number | null) => {
        if (ncm) {
            const info: ncmInfo[] = await buscaPorNcm(
                [ncm],
                anos ? anos : undefined,
                undefined,
                estados ? estados : undefined,
                paises ? paises : undefined,
                transporte ? transporte : undefined,
                urf ? urf : undefined
            );
            setTotalFiltrado(info[0]);
        }
    }

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const busca = async () => {
            setIsLoading(true);
            await buscaTotalFiltrado(ncm);
            setIsLoading(false);
        };
        busca();
    }, [ncm, anos, estados, estados, paises, transporte, urf]);

    useEffect(() => {
        const busca = async () => {
            buscaTotal(ncm);
        }
        busca();
    }, [ncm]);

    const [activeTab, setActiveTab] = useState("geral")

  return (
    <div className="bg-white rounded-lg shadow-md p-5 w-full max-w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b">
        Informações do NCM <span className="text-blue-600">{ncm}</span> : {totalGeral?.produto_descricao}
      </h2>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      )}

      {totalGeral && (
        <div className="space-y-6">
          {/* Card de detalhes do produto */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="bg-gray-100 px-5 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <span className="inline-block w-4 h-4 mr-2 bg-blue-500 rounded-sm"></span>
                Detalhes do Produto
              </h3>
            </div>
            <div className="p-5">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-gray-500">Descrição do Produto</dt>
                  <dd className="text-gray-800">{totalGeral.produto_descricao}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-gray-500">Descrição SH4</dt>
                  <dd className="text-gray-800">{totalGeral.sh4_descricao}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-gray-500">Código NCM</dt>
                  <dd className="text-gray-800 font-medium">{ncm}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Tabs melhoradas */}
          <div className="w-full">
            {/* Tab navigation */}
            <div className="flex rounded-t-lg overflow-hidden border border-gray-200">
              <button
                className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 relative
              ${
                activeTab === "geral"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
                onClick={() => setActiveTab("geral")}
              >
                Dados Gerais
                {activeTab === "geral" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></span>}
              </button>
              <button
                className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 relative
              ${
                activeTab === "filtrado"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
                onClick={() => setActiveTab("filtrado")}
              >
                Dados Filtrados
                {activeTab === "filtrado" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></span>
                )}
              </button>
            </div>

            {/* Conteúdo das tabs com bordas laterais */}
            <div className="border-x border-b border-gray-200 rounded-b-lg bg-white p-5">
              {/* Tab content for dados gerais */}
              <div
                className={`transition-opacity duration-300 ${activeTab === "geral" ? "opacity-100" : "opacity-0 hidden"}`}
              >
                <div className="bg-white rounded-lg overflow-hidden">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                      <span className="inline-block w-4 h-4 mr-2 bg-green-500 rounded-sm"></span>
                      Resumo Geral
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Dados consolidados de exportação e importação</p>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 border-b">Métrica</th>
                          <th className="text-left py-3 px-4 font-semibold text-green-600 border-b">Exportação</th>
                          <th className="text-left py-3 px-4 font-semibold text-blue-600 border-b">Importação</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 border-b">
                            <div className="font-medium">Peso Líquido</div>
                            <div className="text-xs text-gray-500">em kg</div>
                          </td>
                          <td className="py-3 px-4 border-b text-green-700">
                            {formatNumber(totalGeral.total_kg_liquido_exp)}
                          </td>
                          <td className="py-3 px-4 border-b text-blue-700">
                            {formatNumber(totalGeral.total_kg_liquido_imp)}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 border-b">
                            <div className="font-medium">Valor FOB</div>
                            <div className="text-xs text-gray-500">em USD</div>
                          </td>
                          <td className="py-3 px-4 border-b text-green-700">
                            {formatCurrency(totalGeral.total_valor_fob_exp)}
                          </td>
                          <td className="py-3 px-4 border-b text-blue-700">
                            {formatCurrency(totalGeral.total_valor_fob_imp)}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-medium">Valor Agregado</div>
                            <div className="text-xs text-gray-500">USD/kg</div>
                          </td>
                          <td className="py-3 px-4 text-green-700 font-medium">
                            {formatCurrency(totalGeral.total_valor_fob_exp / (totalGeral.total_kg_liquido_exp || 1))}
                          </td>
                          <td className="py-3 px-4 text-blue-700 font-medium">
                            {formatCurrency(totalGeral.total_valor_agregado_imp)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Tab content for dados filtrados */}
              <div
                className={`transition-opacity duration-300 ${activeTab === "filtrado" ? "opacity-100" : "opacity-0 hidden"}`}
              >
                {totalFiltrado ? (
                  <div className="bg-white rounded-lg overflow-hidden">
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 flex items-center">
                        <span className="inline-block w-4 h-4 mr-2 bg-purple-500 rounded-sm"></span>
                        Resumo Filtrado
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Dados filtrados conforme seleção</p>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 border-b">Métrica</th>
                            <th className="text-left py-3 px-4 font-semibold text-green-600 border-b">Exportação</th>
                            <th className="text-left py-3 px-4 font-semibold text-blue-600 border-b">Importação</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 border-b">
                              <div className="font-medium">Peso Líquido</div>
                              <div className="text-xs text-gray-500">em kg</div>
                            </td>
                            <td className="py-3 px-4 border-b text-green-700">
                              {formatNumber(totalFiltrado.total_kg_liquido_exp)}
                            </td>
                            <td className="py-3 px-4 border-b text-blue-700">
                              {formatNumber(totalFiltrado.total_kg_liquido_imp)}
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 border-b">
                              <div className="font-medium">Valor FOB</div>
                              <div className="text-xs text-gray-500">em USD</div>
                            </td>
                            <td className="py-3 px-4 border-b text-green-700">
                              {formatCurrency(totalFiltrado.total_valor_fob_exp)}
                            </td>
                            <td className="py-3 px-4 border-b text-blue-700">
                              {formatCurrency(totalFiltrado.total_valor_fob_imp)}
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-medium">Valor Agregado</div>
                              <div className="text-xs text-gray-500">USD/kg</div>
                            </td>
                            <td className="py-3 px-4 text-green-700 font-medium">
                              {formatCurrency(totalFiltrado.total_valor_agregado_exp)}
                            </td>
                            <td className="py-3 px-4 text-blue-700 font-medium">
                              {formatCurrency(totalFiltrado.total_valor_agregado_imp)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <svg
                      className="w-12 h-12 text-gray-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <p className="text-lg font-medium">Nenhum dado filtrado disponível</p>
                    <p className="text-sm mt-1">Ajuste os filtros para visualizar informações específicas</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!totalGeral && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <svg
            className="w-16 h-16 text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="text-lg font-medium">Nenhuma informação disponível</p>
          <p className="text-sm mt-1">Não foram encontrados dados para o NCM {ncm}</p>
        </div>
      )}
    </div>
  )
}