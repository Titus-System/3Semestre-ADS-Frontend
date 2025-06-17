import { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, LegendProps } from "recharts";
import { RankingEstados, RankingNcms, RankingPaises } from "../../models/interfaces"
import { formatarValor } from "../../utils/formatarValor";

type Props = {
    titulo?: string,
    ranking?: RankingPaises | RankingEstados | RankingNcms
    valor_agregado?: boolean | null
}

export default function GraficoRanking({ titulo, ranking, valor_agregado }: Props) {
    const [appearScroll, setAppearScroll] = useState(false);

    useEffect(() => {
    const handleResize = () => {
        setAppearScroll(window.innerWidth < 756);
    };
    
    handleResize(); 
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
    }, []);

    const scrollRef = useRef<HTMLDivElement | null>(null);

    function scrollGrafico(direcao: "left" | "right") {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const scrollAmount = 150;
            container.scrollBy({
                left: direcao === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    }

    const bar_datakey = valor_agregado ? "total_valor_agregado" : "total_valor_fob"

    const x_datakey = (() => {
        if (!ranking?.length) return "";
        const item = ranking[0];
        if ("nome_pais" in item) return "nome_pais";
        if ("sigla_estado" in item) return "sigla_estado";
        if ("produto_descricao" in item) return "produto_descricao";
        if ("sh4_descricao" in item) return "sh4_descricao"
        return "";
    })();

    const color = (() => {
        switch (x_datakey) {
            case "nome_pais":
                return "rgb(109, 111, 230)";
            case "sigla_estado":
                return "rgb(32, 174, 94)";
            case "produto_descricao":
                return "rgb(189, 124, 20)";
            case "sh4_descricao":
                return "rgb(175, 20, 189)"
            default:
                return "#ffffff";
        }
    })();

    const CustomLegend = ({ payload, fontSize }: LegendProps & { fontSize: number }) => {
        return (
        <div className="w-full flex justify-center mt-10">
              <ul className="flex flex-row gap-3">
                {payload?.map((entry, index) => (
                  <li key={`item-${index}`} className="flex items-center text-white" style={{ fontSize }}>
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span>{entry.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            );
          };

        const CustomTooltip = ({
            active,
            payload,
            label,
            }: {
            active?: boolean;
            payload?: any;
            label?: string;
            }) => {
            if (!active || !payload?.length) return null;

            // Lógica para quebrar a string
            const texto = String(label);
            const maxChars = 65;
            const linhas = texto.match(new RegExp(`.{1,${maxChars}}`, 'g')) || [texto];

            return (
                <div className="bg-white p-2 rounded shadow-md border border-gray-300 max-w-xs">
                <p className="text-blue-800 font-bold text-sm">
                    {linhas.map((linha, i) => (
                    <div key={i}>{linha}</div>
                    ))}
                </p>
                <p className="text-gray-700 text-sm">
                    {payload[0].value.toLocaleString('pt-BR')}
                </p>
                </div>
            );
        };


        return (
        <div className="bg-transparent rounded p-4 w-full max-w-full overflow-hidden h-fit">
            <h3 className="text-center text-gray-300 font-semibold mb-2">
            {titulo}
            </h3>
            {!ranking?.length && <p className="text-center text-white">Nenhum dado encontrado</p>}

            <div className="relative w-full">
            {appearScroll && (
                <>
                <button
                    onClick={() => scrollGrafico("left")}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow z-10"
                    aria-label="Scroll Left"
                >
                    <FaChevronLeft />
                </button>

                <button
                    onClick={() => scrollGrafico("right")}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow z-10"
                    aria-label="Scroll Right"
                >
                    <FaChevronRight />
                </button>
                </>
            )}

            <div
                ref={scrollRef}
                className={appearScroll ? "overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800" : ""}
            >
                <div className={appearScroll ? "min-w-[700px] h-[405px]" : "w-full h-[405px]"}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    data={ranking}
                    margin={{ top: 0, right: 0, left: 20, bottom: 23 }}
                    barCategoryGap="25%"
                    >
                    <XAxis
                        stroke="#E0E0E0"
                        dataKey={x_datakey}
                        tickFormatter={(value: string) => value.substring(0, 10)}
                        tick={{ fontSize: 11, textAnchor: "end" }}
                        interval={0}
                        minTickGap={10}
                    />
                    <YAxis
                        stroke="#E0E0E0"
                        tickFormatter={formatarValor}
                        label={{
                        value: "$",
                        angle: -90,
                        position: "insideLeft",
                        offset: -10,
                        stroke: "#E0E0E0",
                        }}
                        tick={{ fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey={bar_datakey} fill={color} name="$" />
                    <Legend content={<CustomLegend fontSize={16} />} />
                    </BarChart>
                </ResponsiveContainer>
                </div>
            </div>
            </div>
        </div>
        );


}