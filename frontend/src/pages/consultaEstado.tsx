import { useState, useEffect } from "react";
import { FaSpinner } from 'react-icons/fa';
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
import { buscarRankingEstados } from "../services/estadoService";
import "../index.css"

// Extrai nomes dos estados
const estados = (geoData as FeatureCollection).features.map(
  (feature) => feature.properties?.Estado || "Desconhecido"
);

export default function ConsultaEstado() {
  const [loading, setLoading] = useState(true);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

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

const [dadosEstadoMapa, setDadosEstadoMapa] = useState<
{ estado: string; total_fob: number[] }[]
>([]);

  const info = estadoInfo.find((e) => e.estado === estadoSelecionado);

  const handlePeriodosSelecionados = (periodos: number[]) => {
    setSelectedPeriods(periodos);
  };

  const { isSmallScreen, isSmallerScreen } = useScreenSize();

  function useScreenSize() {
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isSmallerScreen, setIsSmallerScreen] = useState(false);
  
    useEffect(() => {
      const handleResize = () => {
        const width = window.innerWidth;
  
        if (width <= 628) {
          setIsSmallerScreen(true);
          setIsSmallScreen(false);
        } else if (width <= 768) {
          setIsSmallerScreen(false);
          setIsSmallScreen(true);
        } else {
          setIsSmallerScreen(false);
          setIsSmallScreen(false);
        }
      };
  
      window.addEventListener("resize", handleResize);
      handleResize(); // run once on mount
  
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    return { isSmallScreen, isSmallerScreen };
  }

  const anoMaisProximo = selectedPeriods.length > 0
  ? selectedPeriods.some((ano) => ano >= 2023)
    ? 2022
    : selectedPeriods.reduce((prev, curr) =>
        Math.abs(curr - 2022) < Math.abs(prev - 2022) ? curr : prev
      )
  : 2022;

  const formatarNumeroEixoY = (valor: number) => {
    if (valor >= 1_000_000_000) return (valor / 1_000_000_000).toFixed(1) + 'B';
    if (valor >= 1_000_000) return (valor / 1_000_000).toFixed(1) + 'M';
    if (valor >= 1_000) return (valor / 1_000).toFixed(1) + 'K';
    return valor.toString();
  };

  useEffect(() => {
    const carregarRankingEstados = async () => {
      const anos = selectedPeriods.length > 0
        ? selectedPeriods.map(Number)
        : [];
  
      try {
        setLoading(true);
        const respostaApi = await buscarRankingEstados(
          ["exp", "imp"],
          27,
          anos,
          undefined,
          undefined,
          undefined,
          "valor_fob",
          0
        );

        console.log("🔎 Resultado bruto da função buscarRankingEstados:", respostaApi);
  
        const resposta = respostaApi;
  
        // console.log("📦 Resposta completa da API:", respostaApi);
        // console.log("📦 Conteúdo de respostaApi.resposta:", resposta);
  
        if (!resposta || resposta.length === 0) {
          console.warn("⚠️ Resposta vazia da função buscarRankingEstados.");
          setLoading(false);
          return;
        }
  
        const mapaEstados: Record<string, number[]> = {};
  
        resposta.forEach((tipoComercial: any) => {
          tipoComercial.dados.forEach((item: any) => {
            const estado = item.nome_estado;
            const valor = parseFloat(item.total_valor_fob);
            if (!isNaN(valor)) {
              if (!mapaEstados[estado]) mapaEstados[estado] = [];
              mapaEstados[estado].push(valor);
            } else {
              console.warn(`⚠️ Valor inválido para ${estado}:`, item.total_valor_fob);
            }
          });
        });
  
        const dadosConvertidos = Object.entries(mapaEstados).map(([estado, total_fob]) => ({
          estado,
          total_fob,
        }));
  
        setDadosEstadoMapa(dadosConvertidos);
        setLoading(false);
  
      } catch (erro) {
        console.error("❌ Erro ao buscar ranking de estados:", erro);
        setLoading(false);
      }
    };
  
    carregarRankingEstados();
  }, [selectedPeriods]);

  const getCorPorMovimento = (estado: string): string => {
    const dado = dadosEstadoMapa.find((d) => d.estado === estado);
    if (!dado) return "#f0f0f0"; // cor neutra se não houver dado

    const exp = dado.total_fob[0]
    const imp = dado.total_fob[1]
    const intensidade = exp/imp

    //console.log(`Cálculo da intensidade para ${estado}:`, intensidade);  
  
    if (intensidade > 1.1) return "#28965A"; // desempenho positivo
    if (intensidade >= 0.9 && intensidade <= 1.1) return "#F9C846";  // neutro
    if (intensidade >= 0.6) return "#F57C00"; // alerta
    if (!dado) {
      console.warn(`🔍 Estado não encontrado nos dados: ${estado}`);
      return "#f0f0f0";
    }
    
    else return "#D64045";                          // desempenho negativo

  };  
  
  
  useEffect(() => {
    const carregarDadosSetores = async () => {
      // console.log("⏳ Iniciando carregamento de dados dos setores...");
  
      if (!estadoSelecionado) {
        // console.warn("⚠️ Nenhum estado selecionado. Interrompendo fetch.");
        return;
      }
  
      const codigos = codigosEstados[estadoSelecionado as keyof typeof codigosEstados];
      if (!codigos || codigos.length === 0) {
        console.error("❌ Código do estado não encontrado para:", estadoSelecionado);
        return;
      }
  
      const [codigoEstado] = codigos;
      // console.log("✅ Código do estado selecionado:", codigoEstado);
  
      const anos =
        selectedPeriods.length > 0
          ? selectedPeriods.map(Number)
          : [];
  
      // console.log("📅 Anos usados na chamada:", anos);
  
      try {
        // console.log("📡 Chamando função buscaVlFobSetores...");
        const dados = await buscaVlFobSetores(anos, [codigoEstado], undefined);
        // console.log("📥 Resposta da função buscaVlFobSetores:", dados);
  
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
  
        // console.log("📊 Dados convertidos para o gráfico:", dadosConvertidos);
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
        : [];
  
      try {
        // Produtos exportados
        // console.log("🔍 Buscando produtos exportados para:", estadoCod, anos);
        const exp = await buscarRankingNcm("exp", 4, undefined, [estadoCod], anos);
        // console.log("📦 Produtos exportados:", exp);
  
        // Produtos importados
        // console.log("🔍 Buscando produtos importados para:", estadoCod, anos);
        const imp = await buscarRankingNcm("imp", 4, undefined, [estadoCod], anos);
        // console.log("📦 Produtos importados:", imp);
  
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
        : []; 
  
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
  style={{ height: "500px" }} 
>{loading ? ( // Verifica o estado de carregamento
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-[999] bg-transparent flex flex-col">
              <FaSpinner className="animate-spin text-blue-500 text-5xl" /> {/* Ícone de carregamento */}
              <p className="mt-3">Carregando cores para o mapa...</p>
            </div>
          ) : null}
  <MapContainer
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
              const nome = feature?.properties?.Estado;
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
  <h4 className="font-semibold">Legenda - Balança Comercial</h4>
  <p className="mb-3 opacity-75">Cálculo: exportações / importações</p>
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
              <div className="bg-white/10 border border-white/20 backdrop-blur rounded-lg p-4 text-white space-y-3 shadow-lg 
                  w-full sm:w-full md:w-full lg:w-full xl:w-5/12 2xl:w-5/12 md:w-5/12 
                  mx-auto
                  text-base
            ">            
                <h3 className="text-xl font-bold">{info.estado}</h3>
                <p><span className="font-bold">Capital:</span> {info.capital}</p>
                <p><span className="font-bold">Área Territorial:</span> {info.area}</p>

                {/* Cálculo seguro do PIB por ano mais próximo */}
                {(() => {
                  const anoKey = anoMaisProximo.toString() as keyof typeof info.pib;
                  const valorPib = info.pib[anoKey];
                  const dados = dadosFiltrados.find((e) => e.estado === estadoSelecionado);
                  const exp = dados?.exportacao
                  const imp = dados?.importacao
                  return (
                    <div>
                      <p className="mb-2">
                        <span className="font-bold">PIB:</span>{" "}
                        {valorPib}
                      </p>
                      <ul className="list-disc pl-5">
                        <li><span className="font-medium">Exportação: $</span>{" "}
                        {exp ? formatNumber(exp) : 'N/A'}</li>
                        <li><span className="font-medium">Importação: $</span>{" "}
                        {imp ? formatNumber(imp) : 'N/A'}</li>
                      </ul>
                  </div>
                  );
                })()}

              </div>
            )}

            {/* Nova caixa de informações adicional */}
            <div className="bg-white/10 border border-white/20 backdrop-blur rounded-lg p-4 text-white space-y-2 shadow-lg 
            w-full sm:w-full md:w-full lg:w-full xl:w-5/12 2xl:w-5/12 mx-auto
            text-base
          ">

              <h3 className="text-xl font-bold">Economia e Comércio</h3>
              <div>
                  <p><strong>Produtos mais exportados:</strong> {exportados.join(", ")}</p>
              </div>
              <div>
                <p><strong>Produtos mais importados:</strong> {importados.join(", ")}</p>
              </div>
              <div>
                <p><strong>Exportadores:</strong> {exportadores.join(", ")}</p>
              </div>
              <div>
              <p><strong>Importadores:</strong> {importadores.join(", ")}</p>
              </div>
            </div>
          </div>

        <div className="flex flex-wrap justify-center items-center w-full mx-auto px-4">
          {/* Gráfico de barras - Setores Econômicos */}
          <div className="md:w-full lg:w-8/12 xl:w-2/4 2xl:w-2/4 mx-auto">
            <h3 className="text-white mt-6 mb-4 text-lg font-medium">
              Exportações vs Importações por Setor: {estadoSelecionado}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosSetores} >
                <XAxis dataKey="setor" stroke="#ffffff" tick={{fontSize: isSmallerScreen ? 0 : isSmallScreen ? 8 : 10, fill: "#ffffff"}} interval={0} />
                <YAxis stroke="#ffffff" tick={{ fill: "#ffffff"}} domain={[0, 'dataMax']} allowDataOverflow={true} tickFormatter={formatarNumeroEixoY} minTickGap={15}  interval="preserveStartEnd"/>
                
                <ChartTooltip />
                <Bar dataKey="exportacao" fill="#66bb6a" name="Exportações" />
                <Bar dataKey="importacao" fill="#42a5f5" name="Importações" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de barras - Exportações vs Importações */}
          <div className="md:w-full lg:w-3/12 xl:w-3/12 2xl:w-3/12 mx-auto">
            <h3 className="text-white mt-6 mb-4 text-lg font-medium">
              Exportações vs Importações: {estadoSelecionado}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosFiltrados}>
                <XAxis dataKey="estado" stroke="#ffffff" />
                <YAxis stroke="#ffffff" tickFormatter={formatarNumeroEixoY}/>
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
