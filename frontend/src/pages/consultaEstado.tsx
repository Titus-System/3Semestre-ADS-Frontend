import { useState } from "react";
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import { BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer } from "recharts";
import type { FeatureCollection } from "geojson";
import type { Layer, LeafletMouseEvent } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import geoData from "../assets/br_states.json";
import estadoInfo from "../assets/info_estados.json";
import SelecionaPeriodo from "../components/selecionaPeriodo";

// Extrai nomes dos estados
const estados = (geoData as FeatureCollection).features.map(
  (feature) => feature.properties?.Estado || "Desconhecido"
);

// Gera dados fictícios
const dados = estados.map((estado) => ({
  estado,
  exportacao: Math.floor(Math.random() * 1000),
  importacao: Math.floor(Math.random() * 800),
}));

// Cor por saldo comercial
function getCorPorMovimento(estado: string): string {
  const found = dados.find((d) => d.estado === estado);
  if (!found) return "#ccc";
  const saldo = found.exportacao - found.importacao;

  if (saldo > 200) return "#28965A";
  if (saldo > 0) return "#F9C846";
  if (saldo > -50) return "#F57C00";
  if (saldo > -200) return "#D64045";
  return "#D64045";
}

export default function ConsultaEstado() {
  const [estadoSelecionado, setEstadoSelecionado] = useState<string | null>(null);
  const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);

  const dadosFiltrados = estadoSelecionado
    ? dados.filter((d) => d.estado === estadoSelecionado)
    : [];

  const info = estadoInfo.find((e) => e.estado === estadoSelecionado);

  const handlePeriodosSelecionados = (periodos: number[]) => {
    setSelectedPeriods(periodos);
  };

  const anoMaisProximo = selectedPeriods.length > 0
  ? selectedPeriods.some((ano) => ano >= 2023)
    ? 2022
    : selectedPeriods.reduce((prev, curr) =>
        Math.abs(curr - 2022) < Math.abs(prev - 2022) ? curr : prev
      )
  : 2022;

  // Dados fictícios para o gráfico de setores econômicos
  const dadosSetores = [
    { setor: "Agronegócio", exportacao: 200, importacao: 50 },
    { setor: "Indústria", exportacao: 150, importacao: 100 },
    { setor: "Mineração", exportacao: 300, importacao: 80 },
    { setor: "Setor Florestal", exportacao: 120, importacao: 40 },
    { setor: "Tecnologia", exportacao: 180, importacao: 90 },
    { setor: "Bens de consumo", exportacao: 160, importacao: 110 },
  ];

  return (
    <div className="p-8">
      <h2 className="text-white mb-4 text-xl font-semibold">
        Mapa Interativo - Exportações e Importações
      </h2>
    <div className="w-screen mx-auto justify-center">
      <div className="flex justify-center flex-col space-y-4 h-auto w-full max-w-5xl mt-6">
        <SelecionaPeriodo onPeriodosSelecionados={handlePeriodosSelecionados} />
      </div>

      <div className="relative" style={{ height: "500px", width: "100%" }}>
        <MapContainer
          key={estadoSelecionado || "mapa"}
          center={[-14.235, -51.9253]}
          zoom={4}
          style={{ height: "100%", width: "100%", backgroundColor: "transparent" }}
        >
          <TileLayer
            url="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAkcBT2Od3Y4AAAAASUVORK5CYII="
            attribution=""
          />
          <GeoJSON
            data={geoData as FeatureCollection}
            style={(feature) => {
              const nome = feature?.properties?.Estado || "Desconhecido";
              return {
                color: "#fff",
                weight: 1,
                fillColor: getCorPorMovimento(nome),
                fillOpacity: 0.9,
              };
            }}
            onEachFeature={(feature, layer: Layer) => {
              const nome = feature.properties?.Estado;
              if (!nome) return;

              layer.on({
                click: () => setEstadoSelecionado(nome),
                mouseover: (e: LeafletMouseEvent) => {
                  const layer = e.target as L.Path;
                  layer.setStyle({ weight: 2, fillOpacity: 1 });
                },
                mouseout: (e: LeafletMouseEvent) => {
                  const layer = e.target as L.Path;
                  layer.setStyle({ weight: 1, fillOpacity: 0.9 });
                },
              });

              layer.bindTooltip(nome, { sticky: true });
            }}
          />
        </MapContainer>
        <div className="absolute bottom-4 right-4 bg-white/10 text-white text-sm p-4 rounded-lg shadow-md backdrop-blur border border-white/20 w-72 z-[1000]">
          <h4 className="font-semibold mb-2">Legenda - Saldo Comercial</h4>
          <ul className="space-y-1">
            <li className="flex items-center space-x-2">
              <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: "#28965A" }}></span>
              <span>Desempenho positivo</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: "#F9C846" }}></span>
              <span>Neutro</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: "#F57C00" }}></span>
              <span>Alerta</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: "#D64045" }}></span>
              <span>Desempenho negativo</span>
            </li>
          </ul>
    </div>

      </div>

      {estadoSelecionado && (
        <>
          {/* Bloco com duas caixas lado a lado */}
          <div className="flex flex-wrap flex-row gap-6">
            {/* Caixa de informações do estado */}
            {info && (
              <div className="bg-white/10 border border-white/20 backdrop-blur rounded-lg p-4 text-white space-y-2 shadow-lg w-full md:w-5/12">
                <h3 className="text-xl font-bold">{info.estado}</h3>
                <p><span className="font-semibold">Capital:</span> {info.capital}</p>
                <p><span className="font-semibold">Área Territorial:</span> {info.area}</p>

                {/* Cálculo seguro do PIB por ano mais próximo */}
                {(() => {
                  const anoKey = anoMaisProximo.toString() as keyof typeof info.pib;
                  const valorPib = info.pib[anoKey];

                  return (
                    <p>
                      <span className="font-semibold">PIB:</span>{" "}
                      {valorPib}
                    </p>
                  );
                })()}
              </div>
            )}

            {/* Nova caixa de informações adicional */}
            <div className="bg-white/10 border border-white/20 backdrop-blur rounded-lg p-4 text-white space-y-2 shadow-lg w-full md:w-5/12">
              <h3 className="text-xl font-bold">Economia e Comércio</h3>
              <p>Produtos mais exportados: Automóveis, açúcar, café e equipamentos.</p>
              <p>Produtos mais importados: Eletrônicos, insumos farmacêuticos, petróleo.</p>
              <p>Exportadores: China, EUA, Argentina, Alemanha, Holanda.</p>
              <p>Importadores: China, EUA, Alemanha, Índia.</p>
            </div>
          </div>

        <div className="flex flex-wrap content-center w-screen mx-auto">
          {/* Gráfico de barras - Setores Econômicos */}
          <div className="md:w-5/12 mx-auto">
            <h3 className="text-white mt-6 mb-4 text-lg font-medium">
              Exportações vs Importações por Setor: {estadoSelecionado}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosSetores}>
                <XAxis dataKey="setor" stroke="#ffffff" tick={{ fontSize: 10.5, fill: "#ffffff" }} interval={0} />
                <YAxis stroke="#ffffff" tick={{ fill: "#ffffff" }}/>
                <ChartTooltip />
                <Bar dataKey="exportacao" fill="#66bb6a" name="Exportações" />
                <Bar dataKey="importacao" fill="#42a5f5" name="Importações" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de barras - Exportações vs Importações */}
          <div className="md:w-5/12 mx-auto">
            <h3 className="text-white mt-6 mb-4 text-lg font-medium">
              Exportações vs Importações: {estadoSelecionado}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosFiltrados}>
                <XAxis dataKey="estado" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <ChartTooltip />
                <Bar dataKey="exportacao" fill="#66bb6a" name="Exportações" />
                <Bar dataKey="importacao" fill="#42a5f5" name="Importações" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        </>
      )}
    </div>
    </div>
  );
}
