"use client";

import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";

const dadosLinha = [
  { ano: '2013', exportacao: 150, importacao: 200 },
  { ano: '2014', exportacao: 160, importacao: 190 },
  { ano: '2015', exportacao: 140, importacao: 160 },
  { ano: '2016', exportacao: 145, importacao: 155 },
  { ano: '2017', exportacao: 150, importacao: 170 },
  { ano: '2018', exportacao: 160, importacao: 175 },
  { ano: '2019', exportacao: 170, importacao: 180 },
  { ano: '2020', exportacao: 175, importacao: 190 },
  { ano: '2021', exportacao: 180, importacao: 200 },
  { ano: '2022', exportacao: 190, importacao: 210 },
  { ano: '2023', exportacao: 200, importacao: 220 },
  { ano: '2024', exportacao: 215, importacao: 240 },
];

const dadosBarras = [
  { pais: "França", exportacao: 15, importacao: 5 },
  { pais: "Argentina", exportacao: 25, importacao: 20 },
  { pais: "Alemanha", exportacao: 20, importacao: 10 },
  { pais: "China", exportacao: 30, importacao: 25 },
  { pais: "EUA", exportacao: 35, importacao: 30 },
];

export default function PaginaTendencia() {
  return (
    
    
    <div className="min-h-screen flex items-center justify-center p-6 mb-10">
       
    <div className="">
        <h1 className="text-white text-3xl flex font-bold justify-center gap-6 mb-20 ">Previsão de Tendências</h1>

        <div className="w-full max-w-6xl bg-[#0B1E3F] rounded-3xl p-8 text-white">
        {/* GRÁFICO DE LINHA */}
        <div className="bg-white rounded-3xl p-6 mb-8 shadow-lg text-black">
          <h2 className="text-xl font-semibold text-center mb-4">
            Exportações e importações de estado escolhido com base nos filtros aplicados
          </h2>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosLinha}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ano" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="exportacao" stroke="#0088FE" name="Exportação" />
                <Line type="monotone" dataKey="importacao" stroke="#FF8042" name="Importação" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO DE BARRAS */}
        <div className="bg-white rounded-3xl p-6 shadow-lg text-black">
          <h2 className="text-xl font-semibold text-center mb-4">
            Exportação e Importação - NCM 09012 (São Paulo)
          </h2>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosBarras} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" label={{ value: "Milhões de dólares", position: "insideBottomRight", offset: -5 }} />
                <YAxis dataKey="pais" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="exportacao" fill="#0088FE" name="Exportação" />
                <Bar dataKey="importacao" fill="#FF8042" name="Importação" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
    
    </div>

  );
}
