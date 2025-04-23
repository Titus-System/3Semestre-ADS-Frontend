import { useState, useEffect } from "react";
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import { BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer } from "recharts";
import type { FeatureCollection } from "geojson";
import type { Layer, LeafletMouseEvent } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import geoData from "../assets/br_states.json";
import estadoInfo from "../assets/info_estados.json";
import codigosEstados from "../assets/codigos_estados.json"
import SelecionaPeriodo from "../components/selecionaPeriodo";
import { buscaVlFobSetores } from "../services/shService";
import { buscarRankingNcm } from "../services/ncmService";
import { buscarRankingPaises } from "../services/paisService";
import { buscaBalancaComercial } from "../services/balancaComercialService";
import "../index.css"

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
  const [dadosSetores, setDadosSetores] = useState<{ setor: string; exportacao: number; importacao: number }[]>([]);

  const [exportados, setExportados] = useState<string[]>([]);
  const [importados, setImportados] = useState<string[]>([]);
  const [exportadores, setExportadores] = useState<string[]>([]);
  const [importadores, setImportadores] = useState<string[]>([]);

  const [dadosFiltrados, setDadosFiltrados] = useState<
  { estado: string; exportacao: number; importacao: number }[]
>([]);

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

  useEffect(() => {
    const carregarDadosSetores = async () => {
      console.log("⏳ Iniciando carregamento de dados dos setores...");
  
      if (!estadoSelecionado) {
        console.warn("⚠️ Nenhum estado selecionado. Interrompendo fetch.");
        return;
      }
  
      const codigos = codigosEstados[estadoSelecionado as keyof typeof codigosEstados];
      if (!codigos || codigos.length === 0) {
        console.error("❌ Código do estado não encontrado para:", estadoSelecionado);
        return;
      }
  
      const [codigoEstado] = codigos;
      console.log("✅ Código do estado selecionado:", codigoEstado);
  
      const anos =
        selectedPeriods.length > 0
          ? selectedPeriods.map(Number)
          : Array.from({ length: 2024 - 2014 + 1 }, (_, i) => 2014 + i);
  
      console.log("📅 Anos usados na chamada:", anos);
  
      try {
        console.log("📡 Chamando função buscaVlFobSetores...");
        const dados = await buscaVlFobSetores(anos, [codigoEstado], undefined);
        console.log("📥 Resposta da função buscaVlFobSetores:", dados);
  
        if (!dados || Object.keys(dados).length === 0) {
          console.warn("⚠️ Resposta vazia ou inválida da API.");
        }
  
        const dadosConvertidos = Object.entries(dados).map(([setor, valores]) => {
          const v = valores as {
            total_valor_fob_exp: string | number;
            total_valor_fob_imp: string | number;
          };
  
          return {
            setor,
            exportacao: parseFloat(String(v.total_valor_fob_exp)),
            importacao: parseFloat(String(v.total_valor_fob_imp)),
          };
        });
  
        console.log("📊 Dados convertidos para o gráfico:", dadosConvertidos);
        setDadosSetores(dadosConvertidos);
      } catch (erro) {
        console.error("❌ Erro ao buscar dados dos setores:", erro);
        setDadosSetores([]);
      }
    };
  
    carregarDadosSetores();
  }, [estadoSelecionado, selectedPeriods]);
  
  useEffect(() => {
    const buscarDadosComercio = async () => {
      if (!estadoSelecionado) return;
  
      const estadoCod = codigosEstados[estadoSelecionado as keyof typeof codigosEstados]?.[0];
      if (!estadoCod) return;
  
      const anos = selectedPeriods.length > 0
        ? selectedPeriods.map(Number)
        : Array.from({ length: 2024 - 2014 + 1 }, (_, i) => 2014 + i);
  
      try {
        // 🔹 Produtos exportados
        console.log("🔍 Buscando produtos exportados para:", estadoCod, anos);
        const exp = await buscarRankingNcm("exp", 4, undefined, [estadoCod], anos);
        console.log("📦 Produtos exportados:", exp);
  
        // 🔹 Produtos importados
        console.log("🔍 Buscando produtos importados para:", estadoCod, anos);
        const imp = await buscarRankingNcm("imp", 4, undefined, [estadoCod], anos);
        console.log("📦 Produtos importados:", imp);
  
        setExportados(
          exp && exp.length > 0
            ? exp.map((item: any) => item.produto_descricao)
            : ["Nenhum dado disponível"]
        );
  
        setImportados(
          imp && imp.length > 0
            ? imp.map((item: any) => item.produto_descricao)
            : ["Nenhum dado disponível"]
        );
  
      const paisesImp = await buscarRankingPaises("exp", 4, undefined, undefined, [estadoCod], anos, undefined);
      const paisesExp = await buscarRankingPaises("imp", 4, undefined, undefined, [estadoCod], anos, undefined);

      setExportadores(
        paisesExp?.length > 0 ? paisesExp.map((item: any) => item.nome_pais) : ["Nenhum dado disponível"]
      );
      setImportadores(
        paisesImp?.length > 0 ? paisesImp.map((item: any) => item.nome_pais) : ["Nenhum dado disponível"]
      );

      } catch (erro) {
        console.error("❌ Erro ao buscar rankings:", erro);
        setExportados(["Erro ao buscar produtos exportados"]);
        setImportados(["Erro ao buscar produtos importados"]);
        setExportadores(["Erro ao buscar exportadores"]);
        setImportadores(["Erro ao buscar importadores"]);
      }
    };
  
    buscarDadosComercio();
  }, [estadoSelecionado, selectedPeriods]);
  
  useEffect(() => {
    const buscarDadosBalancaComercial = async () => {
      if (!estadoSelecionado) return;
  
      const estadoCod = codigosEstados[estadoSelecionado as keyof typeof codigosEstados]?.[0];
      if (!estadoCod) return;
  
      const anos = selectedPeriods.length > 0
        ? selectedPeriods.map(Number)
        : Array.from({ length: 2024 - 2014 + 1 }, (_, i) => 2014 + i); // Todos os anos de 2014 a 2024
  
      try {
        const resposta = await buscaBalancaComercial(anos, [estadoCod]);
  
        if (resposta && Array.isArray(resposta) && resposta.length > 0) {
          // Somar os totais ao longo dos anos selecionados
          let totalExportado = 0;
          let totalImportado = 0;
  
          resposta.forEach((item) => {
            totalExportado += parseFloat(item.total_exportado || '0');
            totalImportado += parseFloat(item.total_importado || '0');
          });
  
          setDadosFiltrados([
            {
              estado: estadoSelecionado,
              exportacao: totalExportado,
              importacao: totalImportado
            }
          ]);
        } else {
          setDadosFiltrados([]);
        }
  
      } catch (erro) {
        console.error("❌ Erro ao buscar dados da balança comercial:", erro);
        setDadosFiltrados([]);
      }
    };
  
    buscarDadosBalancaComercial();
  }, [estadoSelecionado, selectedPeriods]);
  
  

  return (
    <div className="p-8 mt-10">
      <h2 className="text-white mb-4 text-4xl font-bold text-center">
        Consulta por Estado
      </h2>
    <div className="w-full flex flex-col justify-center mt-11">
      <div className="w-full max-w-5xl mx-auto">
        <SelecionaPeriodo onPeriodosSelecionados={handlePeriodosSelecionados} />
      </div>
      <br />

      <div
  className="relative w-full mb-28 sm:mb-44 map-wrapper"
  style={{ height: "500px" }}  // fallback importante para evitar sumiço
>
  <MapContainer
    key={estadoSelecionado || "mapa"}
    center={[-14.235, -51.9253]}
    zoom={4}
    scrollWheelZoom={false}
    dragging={false}
    zoomControl={false}
    doubleClickZoom={false}
    boxZoom={false}
    keyboard={false}
    style={{
      height: "100%",
      width: "100%",
      backgroundColor: "transparent"
    }}
    className="h-full"
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
        <div className="relative 
                lg:absolute lg:bottom-[-10px] lg:left-2 lg:w-fit 
                xl:left-2 xl:w-fit 
                2xl:w-fit 
                bg-white/10 text-white text-sm p-4 rounded-lg shadow-md 
                backdrop-blur border border-white/20 
                z-[1000] mt-4 lg:mt-0">
  <h4 className="font-semibold mb-2">Legenda - Saldo Comercial</h4>
  <ul className="flex flex-col gap-2 lg:flex-col">
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
        <div className="flex flex-wrap justify-center w-full mx-auto px-2 mt-24 relative top-6">
          {/* Bloco com duas caixas lado a lado */}
          <div className="flex flex-wrap justify-center w-full mx-auto px-4 gap-6">
            {/* Caixa de informações do estado */}
            {info && (
              <div className="bg-white/10 border border-white/20 backdrop-blur rounded-lg p-4 text-white space-y-2 shadow-lg 
              w-full md:w-5/12 mx-auto
              text-base lg:text-sm sm:text-xs
            ">            
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
            <div className="bg-white/10 border border-white/20 backdrop-blur rounded-lg p-4 text-white space-y-2 shadow-lg 
            w-full md:w-5/12 mx-auto
            text-base lg:text-sm sm:text-xs
          ">

              <h3 className="text-xl font-bold">Economia e Comércio</h3>
              <div>
                  <p className="font-semibold">Produtos mais exportados:</p>
                  <ul>
                  {exportados.map((produto, index) => (
                    <li key={index}>{produto}</li>
                  ))}
                </ul>
              </div>
                <div>
                  <p className="font-semibold">Produtos mais importados:</p>
                  <ul>
                  {importados.map((produto, index) => (
                    <li key={index}>{produto}</li>
                  ))}
                </ul>
              </div>
              <div>
              <p>Exportadores:</p>
              <ul className="list-disc list-inside">
                {exportadores.map((pais, idx) => (
                  <li key={idx}>{pais}</li>
                ))}
              </ul>
              </div>
              <div>
              <p>Importadores:</p>
              <ul className="list-disc list-inside">
                {importadores.map((pais, idx) => (
                  <li key={idx}>{pais}</li>
                ))}
              </ul>
              </div>
            </div>
          </div>

        <div className="flex flex-wrap justify-center w-full mx-auto px-4">
          {/* Gráfico de barras - Setores Econômicos */}
          <div className="md:w-5/12 mx-auto">
            <h3 className="text-white mt-6 mb-4 text-lg font-medium">
              Exportações vs Importações por Setor: {estadoSelecionado}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosSetores} >
                <XAxis dataKey="setor" stroke="#ffffff" tick={{ fontSize: 10.5, fill: "#ffffff" }} interval={0} />
                <YAxis stroke="#ffffff" tick={{ fill: "#ffffff" }} domain={[0, 'dataMax']} allowDataOverflow={true}/>
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
        </div>
        </>
      )}
    </div>
    </div>
  );
}
