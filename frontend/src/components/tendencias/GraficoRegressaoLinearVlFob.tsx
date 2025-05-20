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
} from "recharts";
import { buscarRegressaoLinearVlfob } from "../../services/tendenciaServices";
import { formatarData } from "../../utils/formatarData";
import ModalRegressaoLinear from "../modais/ModalRegressaoLinear";
import { formatarValor } from "../../utils/formatarValor";

type Props = {
  ncm?: number | null;
  estado?: number | null;
  pais?: number | null;
};

export function GraficoRegressaoLinearVlfob({ ncm, estado, pais }: Props) {
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exibirModal, setExibirModal] = useState(false);
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
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex justify-center items-center h-64">
          <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  };
  if (!dados || dados.length === 0) return <p>Nenhum dado disponível.</p>;

  return (
    <div className="w-full max-w-full">
      <h3
        className="text-lg font-medium mb-2 text-gray-700 cursor-pointer hover:underline"
        onClick={() => setExibirModal(true)}
      >
        Regressão Linear
      </h3>
      {exibirModal && <ModalRegressaoLinear onClose={() => setExibirModal(false)} />}
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dados} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="ds"
              type="category"
              tickFormatter={(ds: string) => formatarData(ds)}
              interval={11}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={formatarValor}
              label={{ value: '$', angle: -90, position: 'insideLeft', offset: -10 }}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              labelFormatter={(label) => `Data: ${formatarData(label as string)}`}
              formatter={(value: number) => `$ ${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`}
              labelStyle={{ color: '#1e40af', fontWeight: 'bold' }}
            />
            <Legend />
            <ReferenceLine
              x="2025-01-01"
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
            <Line type="monotone" dataKey="exp_real" stroke="rgb(18, 148, 1)" name="Exportação Real" strokeWidth={2} dot={{ r: 1 }} />
            <Line type="monotone" dataKey="exp_regressao" stroke="rgb(61, 156, 66)" name="Exportação (Regressão)" dot={{ r: 1 }} />
            <Line type="monotone" dataKey="imp_real" stroke="rgb(255, 0, 0)" name="Importação Real" strokeWidth={2} dot={{ r: 1 }} />
            <Line type="monotone" dataKey="imp_regressao" stroke="rgb(156, 93, 93)" name="Importação (Regressão)" dot={{ r: 1 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
