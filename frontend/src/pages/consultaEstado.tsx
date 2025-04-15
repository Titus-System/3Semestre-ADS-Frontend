import { useState } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import {BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer} from "recharts";
import type { FeatureCollection } from "geojson";
import type { Layer, LeafletMouseEvent } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import geoData from "../assets/br_states.json";

// Extrai nomes dos estados do GeoJSON usando "Estado"
const estados = (geoData as FeatureCollection).features.map(
  (feature) => feature.properties?.Estado || "Desconhecido"
);

// Gera dados fictícios com base no nome dos estados
const dados = estados.map((estado) => ({
  estado,
  exportacao: Math.floor(Math.random() * 1000),
  importacao: Math.floor(Math.random() * 800),
}));

// Retorna cor com base no saldo comercial
function getCorPorMovimento(estado: string): string {
  const found = dados.find((d) => d.estado === estado);
  if (!found) return "#ccc";
  const saldo = found.exportacao - found.importacao;

  if (saldo > 200) return "#007F5F";
  if (saldo > 100) return "#2B9348";
  if (saldo > 0) return "#80B918";
  if (saldo > -100) return "#F9C846";
  if (saldo > -200) return "#F9844A";
  return "#D64045";
}

export default function ConsultaEstado() {
  const [estadoSelecionado, setEstadoSelecionado] = useState<string | null>(null);

  const dadosFiltrados = estadoSelecionado
    ? dados.filter((d) => d.estado === estadoSelecionado)
    : [];

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ color: "white", marginBottom: "1rem" }}>
        Mapa Interativo - Exportações e Importações
      </h2>

      <div style={{ height: "500px", marginBottom: "2rem" }}>
        <MapContainer
          center={[-14.235, -51.9253]}
          zoom={4}
          style={{ height: "100%", width: "100%" }}
        >
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

              // Eventos de interação
              layer.on({
                click: () => {
                  setEstadoSelecionado(nome);
                },
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
      </div>

      {estadoSelecionado && (
        <>
          <h3 style={{ color: "white", marginBottom: "1rem" }}>
            Exportações vs Importações: {estadoSelecionado}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosFiltrados}>
              <XAxis dataKey="estado" />
              <YAxis />
              <ChartTooltip />
              <Bar dataKey="exportacao" fill="#66bb6a" name="Exportações" />
              <Bar dataKey="importacao" fill="#42a5f5" name="Importações" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
