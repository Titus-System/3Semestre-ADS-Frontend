
import { useEffect, useState } from "react";
import { formatCurrency, formatNumber } from "../../utils/formatarValor";
import { buscaInfoGeral } from "../../services/apiServices";

type Props = {
    anos?: number[],
    ncm?: number[],
    estado?: number[],
    pais?: number[],
    transporte?: number[],
    urf?: number[],
}

async function buscaInfo({ anos, ncm, estado, pais, transporte, urf }: Props) {
    const info_exp = await buscaInfoGeral('exp', ncm, anos, pais, estado, transporte, urf);
    console.log("totalExp: ", info_exp);
    const info_imp = await buscaInfoGeral('imp', ncm, anos, pais, estado, transporte, urf);
    let infoTotal = {
        total_fob_exp: info_exp.total_valor_fob,
        total_kg_exp: info_exp.total_kg_liquido,
        total_fob_imp: info_imp.total_valor_fob,
        total_kg_imp: info_imp.total_kg_liquido,
        total_valor_frete: info_imp.total_valor_frete,
        total_valor_seguro: info_imp.total_valor_seguro,
        balanca_comercial: info_exp.total_valor_fob - info_imp.total_valor_fob,
        valor_agregado_exp: info_exp.total_valor_fob / info_exp.total_kg_liquido,
        valor_agregado_imp: info_imp.total_valor_fob / info_imp.total_kg_liquido
    };
    return infoTotal
}

export default function InfoGeral({ anos, ncm, estado, pais, transporte, urf }: Props) {
    const [totalGeral, setTotalGeral] = useState({
        total_fob_exp: 0,
        total_kg_exp: 0,
        total_fob_imp: 0,
        total_kg_imp: 0,
        total_valor_frete: 0,
        total_valor_seguro: 0,
        balanca_comercial: 0,
        valor_agregado_exp: 0,
        valor_agregado_imp: 0
    });
    const [totalFiltrado, setTotalFiltrado] = useState<any>(null);

    useEffect(() => {
        const buscaTotal = async () => {
            const info_geral = await buscaInfo({});
            setTotalGeral(info_geral);
            console.log(info_geral);
        };
        buscaTotal();
        if (ncm || anos || estado || pais || transporte || urf) {
            const buscaFiltro = async () => {
                const info_filtro = await buscaInfo({ anos, ncm, estado, pais, transporte, urf });
                setTotalFiltrado(info_filtro);
            }
            buscaFiltro();
        } else {
            setTotalFiltrado(null);
        }
    }, [ncm, anos, estado, pais, transporte, urf]);
    const [abaAtiva, setAbaAtiva] = useState<"brasil" | "filtros">("brasil");

    return (
        <section className="flex flex-col gap-4 p-4 w-full overflow-x-auto rounded-lg shadow-lg ">
            {/* Abas */}
            <div className="flex flex-row gap-4 border-b border-indigo-300">
                <button
                    className={`py-4 px-0 sm:px-2 md:px-6 font-medium text-xs md:text-sm ${abaAtiva === "brasil"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-white hover:text-gray-400 hover:border-gray-300"
                        }`}
                    onClick={() => setAbaAtiva("brasil")}
                >
                    <h2 className="text-lg flex items-center gap-2">
                        <span className="inline-block w-4 h-4 bg-green-500 rounded-sm"></span>
                        Informações Gerais do Brasil
                    </h2>
                </button>

                <button
                    className={`py-4 px-0 sm:px-2 md:px-6 font-medium text-xs md:text-sm ${abaAtiva === "filtros"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-white hover:text-gray-400 hover:border-gray-300"
                        }`}
                    onClick={() => setAbaAtiva("filtros")}
                >
                    <h2 className="text-lg flex items-center gap-2">
                        <span className="inline-block w-4 h-4 bg-purple-500 rounded-sm"></span>
                        Informações Para os Filtros Selecionados
                    </h2>
                </button>
            </div>

            {abaAtiva == 'brasil' && (
                <div className="w-full max-w-full">
                    {/* <h2 className="text-xl font-bold text-gray-100 mb-6 pb-2 border-b">
                        <span className="inline-block w-4 h-4 mr-2 bg-green-500 rounded-sm"></span>Informações Gerais do Brasil
                    </h2> */}

                    <div className="rounded-b-lg">
                        <p className="text-sm text-gray-400 mt-1">Dados consolidados de exportação e importação</p>
                        <div className="overflow-x-auto rounded-lg border border-gray-500">
                            <table className="w-full">
                                <thead className="border-b border-gray-500">
                                    <tr className="bg-indigo-950">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-200">Métrica</th>
                                        <th className="text-left py-3 px-4 font-semibold text-green-200">Exportação</th>
                                        <th className="text-left py-3 px-4 font-semibold text-red-200">Importação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover:bg-indigo-950 transition-colors border-b border-gray-500">
                                        <td className="py-3 px-4">
                                            <div className="font-medium">Peso Líquido</div>
                                            <div className="text-xs text-gray-400">em kg</div>
                                        </td>
                                        <td className="py-3 px-4 text-green-400">
                                            {formatNumber(totalGeral?.total_kg_exp)} kg
                                        </td>
                                        <td className="py-3 px-4 text-red-400 hover:text-red-700">
                                            {formatNumber(totalGeral?.total_kg_imp)} kg
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-indigo-950 transition-colors border-b border-gray-500">
                                        <td className="py-3 px-4">
                                            <div className="font-medium">Valor FOB</div>
                                            <div className="text-xs text-gray-400">em USD</div>
                                        </td>
                                        <td className="py-3 px-4 text-green-400">
                                            {formatCurrency(totalGeral?.total_fob_exp)}
                                        </td>
                                        <td className="py-3 px-4 text-red-400 hover:text-red-700">
                                            {formatCurrency(totalGeral?.total_fob_imp)}
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-indigo-950 transition-colors border-b border-gray-500">
                                        <td className="py-3 px-4">
                                            <div className="font-medium">Valor Agregado</div>
                                            <div className="text-xs text-gray-400">USD/kg</div>
                                        </td>
                                        <td className="py-3 px-4 text-green-400 font-medium">
                                            {formatCurrency(totalGeral?.valor_agregado_exp).replace('US$', '')} US$/kg
                                        </td>
                                        <td className="py-3 px-4 text-red-400 hover:text-red-700 font-medium">
                                            {formatCurrency(totalGeral?.valor_agregado_imp).replace('US$', '')} US$/kg
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-indigo-950 transition-colors border-b border-gray-500">
                                        <td className="py-3 px-4">
                                            <div className="font-medium">Valor Frete</div>
                                            <div className="text-xs text-gray-400">USD</div>
                                        </td>
                                        <td className="py-3 px-4 text-green-400">
                                            --
                                        </td>
                                        <td className="py-3 px-4 text-red-400 hover:text-red-700">
                                            {formatCurrency(totalGeral?.total_valor_frete)}
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-indigo-950 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="font-medium">Valor Seguro</div>
                                            <div className="text-xs text-gray-400">USD</div>
                                        </td>
                                        <td className="py-3 px-4 text-green-400">
                                            --
                                        </td>
                                        <td className="py-3 px-4 text-red-400 hover:text-red-700">
                                            {formatCurrency(totalGeral?.total_valor_seguro)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            {abaAtiva == 'filtros' && (
                <div className="w-full max-w-full">
                    {/* <h2 className="text-xl font-bold text-gray-100 mb-6 pb-2 border-b">
                        <span className="inline-block w-4 h-4 mr-2 bg-purple-500 rounded-sm"></span>Informações Para os filtros selecionados
                    </h2> */}
                    <div>
                        <div className="rounded-b-lg">
                            <p className="text-sm text-gray-400 mt-1">Dados filtrados conforme seleção</p>
                            <div className="overflow-x-auto rounded-lg border border-gray-500">
                                {totalFiltrado ? (
                                    <table className="w-full">
                                        <thead className="border-b border-gray-500">
                                            <tr className="bg-indigo-950">
                                                <th className="text-left py-3 px-4 font-semibold text-gray-200">Métrica</th>
                                                <th className="text-left py-3 px-4 font-semibold text-green-200">Exportação</th>
                                                <th className="text-left py-3 px-4 font-semibold text-red-200">Importação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="hover:bg-indigo-950 transition-colors border-b border-gray-500">
                                                <td className="py-3 px-4">
                                                    <div className="font-medium">Peso Líquido</div>
                                                    <div className="text-xs text-gray-400">em kg</div>
                                                </td>
                                                <td className="py-3 px-4 text-green-400">
                                                    {formatNumber(totalFiltrado?.total_kg_exp)} kg
                                                </td>
                                                <td className="py-3 px-4 text-red-400 hover:text-red-700">
                                                    {formatNumber(totalFiltrado?.total_kg_imp)} kg
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-indigo-950 transition-colors border-b border-gray-500">
                                                <td className="py-3 px-4">
                                                    <div className="font-medium">Valor FOB</div>
                                                    <div className="text-xs text-gray-400">em USD</div>
                                                </td>
                                                <td className="py-3 px-4 text-green-400">
                                                    {formatCurrency(totalFiltrado?.total_fob_exp)}
                                                </td>
                                                <td className="py-3 px-4 text-red-400 hover:text-red-700">
                                                    {formatCurrency(totalFiltrado?.total_fob_imp)}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-indigo-950 transition-colors border-b border-gray-500">
                                                <td className="py-3 px-4">
                                                    <div className="font-medium">Valor Agregado</div>
                                                    <div className="text-xs text-gray-400">USD/kg</div>
                                                </td>
                                                <td className="py-3 px-4 text-green-400 font-medium">
                                                    {formatCurrency(totalFiltrado?.valor_agregado_exp)}
                                                </td>
                                                <td className="py-3 px-4 text-red-400 hover:text-red-700 font-medium">
                                                    {formatCurrency(totalFiltrado?.valor_agregado_imp).replace('US$', '')} US$/kg
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-indigo-950 transition-colors border-b border-gray-500">
                                                <td className="py-3 px-4">
                                                    <div className="font-medium">Valor Frete</div>
                                                    <div className="text-xs text-gray-400">USD</div>
                                                </td>
                                                <td className="py-3 px-4 text-green-400">
                                                    --
                                                </td>
                                                <td className="py-3 px-4 text-red-400 hover:text-red-700">
                                                    {formatCurrency(totalFiltrado?.total_valor_frete)}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-indigo-950 transition-colors border-b border-gray-500">
                                                <td className="py-3 px-4">
                                                    <div className="font-medium">Valor Seguro</div>
                                                    <div className="text-xs text-gray-400">USD</div>
                                                </td>
                                                <td className="py-3 px-4 text-green-400">
                                                    --
                                                </td>
                                                <td className="py-3 px-4 text-red-400 hover:text-red-700">
                                                    {formatCurrency(totalFiltrado?.total_valor_seguro)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                        <svg
                                            className="w-12 h-12 text-gray-400 mb-4"
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
                                        <p className="text-lg font-medium">Nenhuma informação disponível para os filtros selecionados</p>
                                        <p className="text-sm mt-1">Ajuste os filtros para visualizar informações específicas</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section >
    )
}