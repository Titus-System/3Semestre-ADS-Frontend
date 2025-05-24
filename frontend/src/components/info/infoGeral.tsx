
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


    return (
        <section className="flex flex-col lg:flex-row gap-4 rounded p-4 w-full overflow-x-auto">
            <div className="bg-white rounded-lg shadow-md p-5 w-full max-w-full">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b">
                    <span className="inline-block w-4 h-4 mr-2 bg-green-500 rounded-sm"></span>Informações Gerais do Brasil
                </h2>

                <div className="border-x border-b border-gray-200 rounded-b-lg bg-white p-5">
                    <p className="text-sm text-gray-500 mt-1">Dados consolidados de exportação e importação</p>
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
                                        {formatNumber(totalGeral?.total_kg_exp)} kg
                                    </td>
                                    <td className="py-3 px-4 border-b text-blue-700">
                                        {formatNumber(totalGeral?.total_kg_imp)} kg
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 border-b">
                                        <div className="font-medium">Valor FOB</div>
                                        <div className="text-xs text-gray-500">em USD</div>
                                    </td>
                                    <td className="py-3 px-4 border-b text-green-700">
                                        {formatCurrency(totalGeral?.total_fob_exp)}
                                    </td>
                                    <td className="py-3 px-4 border-b text-blue-700">
                                        {formatCurrency(totalGeral?.total_fob_imp)}
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 border-b">
                                        <div className="font-medium">Valor Agregado</div>
                                        <div className="text-xs text-gray-500">USD/kg</div>
                                    </td>
                                    <td className="py-3 px-4 border-b text-green-700 font-medium">
                                        {formatCurrency(totalGeral?.valor_agregado_exp)}
                                    </td>
                                    <td className="py-3 px-4 border-b text-blue-700 font-medium">
                                        {formatCurrency(totalGeral?.valor_agregado_imp).replace('US$', '')} US$/kg
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 border-b">
                                        <div className="font-medium">Valor Frete</div>
                                        <div className="text-xs text-gray-500">USD</div>
                                    </td>
                                    <td className="py-3 px-4 border-b text-green-700">
                                        --
                                    </td>
                                    <td className="py-3 px-4 border-b text-blue-700">
                                        {formatCurrency(totalGeral?.total_valor_frete)}
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 border-b">
                                        <div className="font-medium">Valor Seguro</div>
                                        <div className="text-xs text-gray-500">USD</div>
                                    </td>
                                    <td className="py-3 px-4 border-b text-green-700">
                                        --
                                    </td>
                                    <td className="py-3 px-4 border-b text-blue-700">
                                        {formatCurrency(totalGeral?.total_valor_seguro)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 w-full max-w-full">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b">
                    <span className="inline-block w-4 h-4 mr-2 bg-purple-500 rounded-sm"></span>Informações Para os filtros selecionados
                </h2>
                <div>
                    <div className="border-x border-b border-gray-200 rounded-b-lg bg-white p-5">
                        <p className="text-sm text-gray-500 mt-1">Dados filtrados conforme seleção</p>
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            {totalFiltrado ? (
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
                                                {formatNumber(totalFiltrado?.total_kg_exp)} kg
                                            </td>
                                            <td className="py-3 px-4 border-b text-blue-700">
                                                {formatNumber(totalFiltrado?.total_kg_imp)} kg
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 border-b">
                                                <div className="font-medium">Valor FOB</div>
                                                <div className="text-xs text-gray-500">em USD</div>
                                            </td>
                                            <td className="py-3 px-4 border-b text-green-700">
                                                {formatCurrency(totalFiltrado?.total_fob_exp)}
                                            </td>
                                            <td className="py-3 px-4 border-b text-blue-700">
                                                {formatCurrency(totalFiltrado?.total_fob_imp)}
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 border-b">
                                                <div className="font-medium">Valor Agregado</div>
                                                <div className="text-xs text-gray-500">USD/kg</div>
                                            </td>
                                            <td className="py-3 px-4 border-b text-green-700 font-medium">
                                                {formatCurrency(totalFiltrado?.valor_agregado_exp)}
                                            </td>
                                            <td className="py-3 px-4 border-b text-blue-700 font-medium">
                                                {formatCurrency(totalFiltrado?.valor_agregado_imp).replace('US$', '')} US$/kg
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 border-b">
                                                <div className="font-medium">Valor Frete</div>
                                                <div className="text-xs text-gray-500">USD</div>
                                            </td>
                                            <td className="py-3 px-4 border-b text-green-700">
                                                --
                                            </td>
                                            <td className="py-3 px-4 border-b text-blue-700">
                                                {formatCurrency(totalFiltrado?.total_valor_frete)}
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 border-b">
                                                <div className="font-medium">Valor Seguro</div>
                                                <div className="text-xs text-gray-500">USD</div>
                                            </td>
                                            <td className="py-3 px-4 border-b text-green-700">
                                                --
                                            </td>
                                            <td className="py-3 px-4 border-b text-blue-700">
                                                {formatCurrency(totalFiltrado?.total_valor_seguro)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

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
                                    <p className="text-lg font-medium">Nenhuma informação disponível para os filtros selecionados</p>
                                    <p className="text-sm mt-1">Ajuste os filtros para visualizar informações específicas</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}