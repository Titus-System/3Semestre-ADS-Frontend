import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  LegendProps
} from "recharts";
import { buscarRegressaoLinearVlfob } from "../../services/tendenciaServices";
import { formatarData } from "../../utils/formatarData";
import ModalRegressaoLinear from "../modais/ModalRegressaoLinear";
import { formatarValor } from "../../utils/formatarValor";
import Loading from "../loading";

type Props = {
  ncm?: number | null;
  estado?: number | null;
  pais?: number | null;
};

export function GraficoRegressaoLinearVlfob({ ncm, estado, pais }: Props) {

  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exibirModal, setExibirModal] = useState(false);
  const [fontSizeX, setFontSizeX] = useState(12);
  const [intervalX, setIntervalX] = useState(23);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [legendFontSize, setLegendFontSize] = useState(16);
  const [modalFontSize, setModalFontSize] = useState(14);

  useEffect(() => {
        const handleResize = () => {
            setModalFontSize(window.innerWidth < 304 ? 8 : window.innerWidth < 328 ? 9 : window.innerWidth < 350 ? 10 : window.innerWidth < 364 ? 11 : window.innerWidth < 389 ? 12 : window.innerWidth < 408 ? 13 : 14);
            setFontSizeX(window.innerWidth < 387 ? 10 : window.innerWidth < 510 ? 11 : 12);
            setIntervalX(window.innerWidth < 315 ? 70 : window.innerWidth < 370 ? 42 : window.innerWidth < 482 ? 35 : 23);
            setStrokeWidth(window.innerWidth < 400 ? 1 : 2);
            setLegendFontSize(window.innerWidth < 265 ? 10 : window.innerWidth < 305 ? 11 : window.innerWidth < 640 ? 13 : 14);
        };

        handleResize(); // Executa no carregamento
        window.addEventListener("resize", handleResize); // Escuta mudanças de tamanho

        return () => window.removeEventListener("resize", handleResize);
    }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [exp, imp] = await Promise.all([
          buscarRegressaoLinearVlfob("exp", ncm, estado, pais),
          buscarRegressaoLinearVlfob("imp", ncm, estado, pais),
        ]);

        // Mesclar os dados por data (ds)
        const dadosCombinados = exp.dados.map((expItem: any, index: number) => {
          const impItem = imp.dados[index];
          return {
            ds: expItem.ds,
            exp_real: expItem.y_real,
            exp_regressao: expItem.y_regressao,
            imp_real: impItem?.y_real || 0,
            imp_regressao: impItem?.y_regressao || 0,
          };
        });

        setDados(dadosCombinados);
      } catch (error) {
        console.error("Erro ao buscar dados de regressão linear:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [estado, pais, ncm]);

  if (loading) {
    return (
      <Loading/>
    );
  };
  if (!dados || dados.length === 0) return <p>Nenhum dado disponível.</p>;

  const CustomLegend = ({ payload, fontSize }: LegendProps & { fontSize: number }) => {
    return (
    <div className="w-full flex justify-center mt-1">
          <ul className="flex flex-col sm:grid sm:grid-cols-2 gap-y-1">
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

  return (
    <div className="flex flex-col w-full max-w-full justify-center">
      <h3
        className="text-lg font-medium mb-2 text-gray-300 cursor-pointer hover:underline"
        onClick={() => setExibirModal(true)}
      >
        Regressão Linear
      </h3>
      {exibirModal && <ModalRegressaoLinear onClose={() => setExibirModal(false)} />}
      <div className="flex h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dados} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="ds"
              stroke="#E0E0E0"
              type="category"
              tickFormatter={(ds: string) => formatarData(ds)}
              interval={intervalX}
              tick={{ fontSize: fontSizeX }}
            />
            <YAxis
              stroke="#E0E0E0"
              tickFormatter={formatarValor}
              label={{ value: '$', angle: -90, position: 'insideLeft', stroke: "#E0E0E0", offset: -10 }}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              labelFormatter={(label) => `Data: ${formatarData(label as string)}`}
              formatter={(value: number) => `$ ${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`}
              labelStyle={{ color: '#1e40af', fontWeight: 'bold', fontSize: modalFontSize }}
              itemStyle={{ fontSize: modalFontSize }}

            />
            <Legend content={<CustomLegend fontSize={legendFontSize} />} wrapperStyle={{ width: '100%', display: 'flex', justifyContent: 'center' }} />
            <ReferenceLine
              x="2025-05-01"
              stroke="red"
              strokeDasharray="3 3"
              label={{
                value: "Projeção",
                position: "top",
                angle: 0,
                fontSize: 12,
                fill: "red"
              }}
            />
            <Line type="monotone" dataKey="exp_real" stroke="rgb(35, 148, 20)" name="Exportação Real" strokeWidth={strokeWidth} dot={{ r: 1 }} />
            <Line type="monotone" dataKey="exp_regressao" stroke="rgb(38, 104, 42)" name="Exportação (Regressão)" dot={{ r: 1 }} />
            <Line type="monotone" dataKey="imp_real" stroke="rgb(179, 15, 15)" name="Importação Real" strokeWidth={strokeWidth} dot={{ r: 1 }} />
            <Line type="monotone" dataKey="imp_regressao" stroke="rgb(156, 93, 93)" name="Importação (Regressão)" dot={{ r: 1 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
