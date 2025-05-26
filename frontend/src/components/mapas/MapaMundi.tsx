import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { GeoJsonObject, Feature, Geometry } from "geojson";
import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";

export default function WorldMap() {
  const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const geoJsonUrl =
    "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

  useEffect(() => {
    fetch(geoJsonUrl)
      .then((res) => res.json())
      .then((data: GeoJsonObject) => setGeoData(data));
  }, []);

  const onEachCountry = (feature: Feature<Geometry, any>, layer: L.Layer) => {
    layer.on("click", () => {
      if (feature.properties?.name) {
        setSelectedCountry(feature.properties.name);
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Mapa Mundo Interativo</h1>

      <div className="w-full max-w-6xl h-[600px] border rounded-xl shadow-md overflow-hidden">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          scrollWheelZoom={false}
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {geoData && (
            <GeoJSON
              data={geoData}
              onEachFeature={onEachCountry}
              style={() => ({
                fillColor: "#93c5fd", // Tailwind azul-300
                color: "#1e40af",     // Tailwind azul-800
                weight: 0.5,
                fillOpacity: 0.4,
              })}
            />
          )}
        </MapContainer>
      </div>

      {selectedCountry && (
        <div className="text-lg font-medium">
          País selecionado: <span className="text-blue-700">{selectedCountry}</span>
        </div>
      )}
    </div>
  );
}
