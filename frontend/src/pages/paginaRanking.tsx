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
import { useState } from "react";

import { buscaPaisExpImpInfo, buscarHistoricoPais, buscarRankingPaises } from "../services/paisService";


type DadoPais = {
  pais: string;
  exportacao: number;
  importacao: number;
  valorAgregado: number;
};
const dadosPorAno:Record<number, DadoPais[]> = {
  2014: [
    { pais: "Estados Unidos", exportacao: 2200, importacao: 2100, valorAgregado: 100 },
    { pais: "China", exportacao: 2000, importacao: 1900, valorAgregado: 120 },
    { pais: "Alemanha", exportacao: 1600, importacao: 1500, valorAgregado: 90 },
    { pais: "Japão", exportacao: 700, importacao: 650, valorAgregado: 60 },
  ],
  2015: [
    { pais: "Estados Unidos", exportacao: 2300, importacao: 2200, valorAgregado: 120 },
    { pais: "China", exportacao: 2100, importacao: 2000, valorAgregado: 140 },
    { pais: "Alemanha", exportacao: 1650, importacao: 1550, valorAgregado: 95 },
    { pais: "Japão", exportacao: 720, importacao: 670, valorAgregado: 65 },
  ],
  2016: [
    { pais: "Estados Unidos", exportacao: 2300, importacao: 2200, valorAgregado: 120 },
    { pais: "China", exportacao: 2100, importacao: 2000, valorAgregado: 140 },
    { pais: "Alemanha", exportacao: 1650, importacao: 1550, valorAgregado: 95 },
    { pais: "Japão", exportacao: 720, importacao: 670, valorAgregado: 65 },
  ],
  2017: [
    { pais: "Estados Unidos", exportacao: 2300, importacao: 2200, valorAgregado: 120 },
    { pais: "China", exportacao: 2100, importacao: 2000, valorAgregado: 140 },
    { pais: "Alemanha", exportacao: 1650, importacao: 1550, valorAgregado: 95 },
    { pais: "Japão", exportacao: 720, importacao: 670, valorAgregado: 65 },
  ],
  2018: [
    { pais: "Estados Unidos", exportacao: 2300, importacao: 2200, valorAgregado: 120 },
    { pais: "China", exportacao: 2100, importacao: 2000, valorAgregado: 140 },
    { pais: "Alemanha", exportacao: 1650, importacao: 1550, valorAgregado: 95 },
    { pais: "Japão", exportacao: 720, importacao: 670, valorAgregado: 65 },
  ],
  2019: [
    { pais: "Estados Unidos", exportacao: 2300, importacao: 2200, valorAgregado: 120 },
    { pais: "China", exportacao: 2100, importacao: 2000, valorAgregado: 140 },
    { pais: "Alemanha", exportacao: 1650, importacao: 1550, valorAgregado: 95 },
    { pais: "Japão", exportacao: 720, importacao: 670, valorAgregado: 65 },
  ],
  2020: [
    { pais: "Estados Unidos", exportacao: 2300, importacao: 2200, valorAgregado: 120 },
    { pais: "China", exportacao: 2100, importacao: 2000, valorAgregado: 140 },
    { pais: "Alemanha", exportacao: 1650, importacao: 1550, valorAgregado: 95 },
    { pais: "Japão", exportacao: 720, importacao: 670, valorAgregado: 65 },
  ],
  2021: [
    { pais: "Estados Unidos", exportacao: 2300, importacao: 2200, valorAgregado: 120 },
    { pais: "China", exportacao: 2100, importacao: 2000, valorAgregado: 140 },
    { pais: "Alemanha", exportacao: 1650, importacao: 1550, valorAgregado: 95 },
    { pais: "Japão", exportacao: 720, importacao: 670, valorAgregado: 65 },
  ],
  2022: [
    { pais: "Estados Unidos", exportacao: 2300, importacao: 2200, valorAgregado: 120 },
    { pais: "China", exportacao: 2100, importacao: 2000, valorAgregado: 140 },
    { pais: "Alemanha", exportacao: 1650, importacao: 1550, valorAgregado: 95 },
    { pais: "Japão", exportacao: 720, importacao: 670, valorAgregado: 65 },
  ],
  2023: [
    { pais: "Estados Unidos", exportacao: 2300, importacao: 2200, valorAgregado: 120 },
    { pais: "China", exportacao: 2100, importacao: 2000, valorAgregado: 140 },
    { pais: "Alemanha", exportacao: 1650, importacao: 1550, valorAgregado: 95 },
    { pais: "Japão", exportacao: 720, importacao: 670, valorAgregado: 65 },
  ],
  2024: [
    { pais: "Estados Unidos", exportacao: 2550, importacao: 2420, valorAgregado: 149.4 },
    { pais: "China", exportacao: 2750, importacao: 2190, valorAgregado: 400.2 },
    { pais: "Alemanha", exportacao: 1650, importacao: 1420, valorAgregado: 299.7 },
    { pais: "Japão", exportacao: 750, importacao: 660, valorAgregado: 69.7 },
  ],
};



const tendencia = [
  { ano: 2014, China: 120, EUA: 100, Alemanha: 90, Japao: 60 },
  { ano: 2015, China: 140, EUA: 120, Alemanha: 95, Japao: 65 },
  { ano: 2016, China: 180, EUA: 150, Alemanha: 100, Japao: 70 },
  { ano: 2017, China: 200, EUA: 160, Alemanha: 120, Japao: 72 },
  { ano: 2018, China: 240, EUA: 180, Alemanha: 140, Japao: 75 },
  { ano: 2019, China: 270, EUA: 200, Alemanha: 180, Japao: 78 },
  { ano: 2020, China: 300, EUA: 250, Alemanha: 200, Japao: 90 },
  { ano: 2021, China: 310, EUA: 300, Alemanha: 230, Japao: 92 },
  { ano: 2022, China: 350, EUA: 350, Alemanha: 260, Japao: 95 },
  { ano: 2023, China: 370, EUA: 400, Alemanha: 280, Japao: 98 },
  { ano: 2024, China: 400, EUA: 450, Alemanha: 300, Japao: 100 },
];





export default function PaginaRanking() {
  const [anoSelecionado, setAnoSelecionado] = useState<number>(2024);
  const dadosAno = dadosPorAno[anoSelecionado];

  const buscaRankingPais = async (ano:number) =>{
    let paises_id = [];
    const anosSelec = [ano];
    const ranking_exp = await buscarRankingPaises(
      "exp",          // tipo
      5,              // qtd
      undefined,      // ncm (não informado)
      undefined,      // paises (não informado)
      undefined,      // estados (não informado)
      anosSelec,      // anos
      undefined,      // meses (não informado)
      "valor_fob",    // crit
      0
    );

    for (let pais of ranking_exp) {
      paises_id.push(pais.id_pais)
    }

    const infoanopaises = await buscaPaisExpImpInfo(paises_id, undefined, undefined, anosSelec, undefined)
    const histpaisesexp = await buscarHistoricoPais("exp", paises_id, undefined, undefined, undefined, undefined, undefined, undefined)
    const histpaisesimp = await buscarHistoricoPais("imp", paises_id, undefined, undefined, undefined, undefined, undefined, undefined)
  
    console.log("ranking: ", ranking_exp)
    console.log("info ano: ", infoanopaises)
    console.log("hist exp; ", histpaisesexp)
    console.log("hist imp: ", histpaisesimp)

  };



  const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);


  const togglePeriodSelection = (id: number) => {
    setSelectedPeriods((prev) =>
      prev.includes(id) ? prev.filter((period) => period !== id) : [...prev, id]
    );
  };


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

        

        {/* Tabela */}
        <div className="responsive-container overflow-x-auto bg-white rounded text-black">
          <table className="min-w-full text-sm text-center">
            <thead className="bg-indigo-200 text-indigo-950 font-bold">
              <tr>
                <th className="px-4 py-2">País</th>
                <th className="px-4 py-2">Exportação</th>
                <th className="px-4 py-2">Importação</th>
                <th className="px-4 py-2">Valor Agregado</th>
              </tr>
            </thead>
            <tbody>
              {dadosAno.map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-indigo-300 hover:bg-indigo-100"
                >
                  <td className="py-2">{item.pais}</td>
                  <td>US$ {item.exportacao.toFixed(2)}</td>
                  <td>US$ {item.importacao.toFixed(2)}</td>
                  <td>US$ {item.valorAgregado.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gráfico de barras */}
        <div className="bg-white rounded p-4">
          <h3 className="text-center text-indigo-900 font-semibold mb-2">
            Valor Agregado por País
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dadosAno}>
              <XAxis dataKey="pais" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valorAgregado" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de linha */}
    <div className="bg-white rounded p-4">
      <h3 className="text-center text-indigo-900 font-semibold mb-2">
        Tendência de Valor Agregado (2014–2024)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={tendencia}>
          <XAxis dataKey="ano" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="China" stroke="#ef4444" />
          <Line type="monotone" dataKey="EUA" stroke="#3b82f6" />
          <Line type="monotone" dataKey="Alemanha" stroke="#10b981" />
          <Line type="monotone" dataKey="Japao" stroke="#f59e0b" />
        </LineChart>
      </ResponsiveContainer>
    </div>


      </div>
    </div>
    
</div>

  );
}
