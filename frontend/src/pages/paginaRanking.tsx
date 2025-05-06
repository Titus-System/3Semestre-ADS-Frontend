import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import SelecionaPeriodo from "../components/selecionaPeriodo";
import { buscarHistoricoPais, buscarRankingPaises } from "../services/paisService";

const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

// Tipagens

type PaisRanking = {
  id_pais: number;
};

type Historico = {
  nome_pais: string;
  ano: number;
  valor_agregado_total_exp?: string;
  valor_agregado_total_imp?: string;
};

type DadoCombinado = {
  pais: string;
  valorAgregadoExp: number;
  valorAgregadoImp: number;
};

export default function PaginaRanking() {
  const [anoSelecionado, setAnoSelecionado] = useState<number>(2024);
  const [topPaises, setTopPaises] = useState<string[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [dadosAno, setDadosAno] = useState<DadoCombinado[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rankingPaises: PaisRanking[] = await buscarRankingPaises(
          "exp", 5, undefined, undefined, undefined,
          [anoSelecionado], undefined, "valor_agregado", undefined
        );
  
        const idsPaises: number[] = rankingPaises.map((pais) => pais.id_pais);
  
        const dadosExportacaoAno: Historico[] = await buscarHistoricoPais(
          "exp", idsPaises, undefined, undefined,
          [anoSelecionado], undefined, undefined, undefined
        );
  
        const dadosImportacao: Historico[] = await buscarHistoricoPais(
          "imp", idsPaises, undefined, undefined,
          [anoSelecionado], undefined, undefined, undefined
        );
  
        const dadosCombinados: DadoCombinado[] = dadosExportacaoAno
          .map((item) => {
            const imp = dadosImportacao.find((p) => p.nome_pais === item.nome_pais);
            return {
              pais: item.nome_pais,
              valorAgregadoExp: parseFloat(item.valor_agregado_total_exp ?? "0"),
              valorAgregadoImp: imp ? parseFloat(imp.valor_agregado_total_imp ?? "0") : 0,
            };
          })
          .sort((a, b) => b.valorAgregadoExp - a.valorAgregadoExp)
          .slice(0, 5);
  
        const nomes: string[] = dadosCombinados.map((r) => r.pais);
        setTopPaises(nomes);
        setDadosAno(dadosCombinados);
  
        // NOVO: Buscar histórico completo de exportações de 2014 a 2024 para os top 5 países
        const dadosHistorico: Historico[] = await buscarHistoricoPais(
          "exp", idsPaises, undefined, undefined,
          Array.from({ length: 11 }, (_, i) => 2014 + i), // anos de 2014 a 2024
          undefined, undefined, undefined
        );
  
        const anos = Array.from(new Set(dadosHistorico.map((r) => r.ano))).sort();
  
        const trend = anos.map((ano) => {
          const entry: any = { ano };
          nomes.forEach((pais) => {
            const rec = dadosHistorico.find(
              (r) => r.ano === ano && r.nome_pais === pais
            );
            entry[pais] = rec ? parseFloat(rec.valor_agregado_total_exp ?? "0") : 0;
          });
          return entry;
        });
  
        setTrendData(trend);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
  
    fetchData();
  }, [anoSelecionado]);

  return (
    <div className="relative from-indigo-900 to-indigo-950 min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center w-full max-w-6xl space-y-6">
        <h2 className="text-center text-3xl font-bold text-white mt-10">
          Comparação Global de Valor Agregado
        </h2>

        <div className="justify-center space-y-2 h-40">
          <p className="text-white text-xl font-semibold flex justify-center mt-8">
            Defina o período de análise
          </p>
        </div>

        <div className="bg-indigo-950 p-6 rounded-2xl shadow-xl w-full space-y-6 text-white">
          <h2 className="text-center text-xl font-bold">
            Ranking de Valor Agregado no Comércio Internacional
          </h2>

          <div className="w-full space-y-2">
            <p className="text-white text-lg sm:text-xl font-semibold text-center">
              Defina o período de análise
            </p>
            <SelecionaPeriodo
              onPeriodosSelecionados={(periodos: number[]) => {
                if (periodos.length > 0) setAnoSelecionado(periodos[0]);
              }}
            />
          </div>

          <div className="bg-indigo-950 p-4 sm:p-6 rounded-2xl shadow-xl w-full space-y-6 text-white">
            <h3 className="text-center text-lg sm:text-xl font-semibold my-2">
              Ranking de Valor Agregado Exportação e Importação - Ano {anoSelecionado}
            </h3>

            <div className="w-full overflow-x-auto bg-white rounded text-black">
              <table className="min-w-[600px] w-full text-sm text-center">
                <thead className="bg-indigo-200 text-indigo-950 font-bold">
                  <tr>
                    <th className="px-4 py-2">País</th>
                    <th className="px-4 py-2">Valor Agregado Exportado</th>
                    <th className="px-4 py-2">Valor Agregado Importado</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosAno.map((item, index) => (
                    <tr key={index} className="border-t border-indigo-300 hover:bg-indigo-100">
                      <td className="py-2">{item.pais}</td>
                      <td className="py-2">US$ {item.valorAgregadoExp.toFixed(2)}</td>
                      <td className="py-2">US$ {item.valorAgregadoImp.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded p-4 w-full max-w-full overflow-x-auto">
              <h3 className="text-center text-indigo-900 font-semibold mb-2">
                Valor Agregado por País (Ano {anoSelecionado})
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dadosAno}>
                  <XAxis dataKey="pais" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="valorAgregadoExp" fill="#6366f1" name="Exportação" />
                  <Bar dataKey="valorAgregadoImp" fill="#facc15" name="Importação" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded p-4 w-full max-w-full overflow-x-auto">
              <h3 className="text-center text-indigo-900 font-semibold mb-2">
                Tendência de Valor Agregado Exportado (2014–2024)
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <XAxis dataKey="ano" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => {
                    const num = typeof value === 'number' ? value : parseFloat(value) || 0;
                    return num.toFixed(2);
                  }} />
                  <Legend />
                  {topPaises.map((pais, idx) => (
                    <Line
                      key={pais}
                      type="monotone"
                      dataKey={pais}
                      stroke={COLORS[idx % COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
