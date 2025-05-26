import { useRef, useState, useEffect } from "react";
import { FaSpinner } from 'react-icons/fa';
import { MapContainer, GeoJSON, TileLayer, ZoomControl } from "react-leaflet";
import { GeoJSON as LeafletGeoJSON } from "leaflet";
import { BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, TooltipProps, Tooltip } from "recharts";
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
import PainelEstatisticasVlfob from "../components/paineis/PainelEstatisticasVlfob";
import PainelEstatisticasAuxiliares from "../components/paineis/PainelEstatisticasAuxiliaresVlfob";
import PainelEstatisticasBalancaComercial from "../components/paineis/PainelEstatisticasBalancaComercial";
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

  const geoJsonRef = useRef<LeafletGeoJSON | null>(null);

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
    const [isNormalScreen, setIsNormalScreen] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        const width = window.innerWidth;

        if (width <= 1416) {
          setIsNormalScreen(true)
          setIsSmallerScreen(false);
          setIsSmallScreen(false);
        }
        if (width <= 560) {
          setIsNormalScreen(false)
          setIsSmallerScreen(true);
          setIsSmallScreen(false);
        } else if (width <= 630) {
          setIsNormalScreen(false)
          setIsSmallerScreen(false);
          setIsSmallScreen(true);
        } else {
          setIsNormalScreen(false)
          setIsSmallerScreen(false);
          setIsSmallScreen(false);
        }
      };

      window.addEventListener("resize", handleResize);
      handleResize(); // run once on mount

      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return { isSmallScreen, isSmallerScreen, isNormalScreen };
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
    const intensidade = exp / imp

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

  useEffect(() => {
    if (!geoJsonRef.current) return;

    geoJsonRef.current.eachLayer((layer) => {
      const feature = (layer as any).feature;
      const nome = feature?.properties?.Estado;
      if (!nome) return;

      const isSelecionado = nome === estadoSelecionado;

      (layer as L.Path).setStyle({
        weight: isSelecionado ? 4 : 1,
        fillOpacity: isSelecionado ? 1 : 0.8,
      });
    });
  }, [estadoSelecionado]);

  function onEachFeature(feature: any, layer: Layer) {
    const nomeEstado = feature?.properties?.Estado;
    if (!nomeEstado) return;

    // Define o estilo inicial
    const cor = getCorPorMovimento(nomeEstado);

    // Estilo inicial de cada estado
    (layer as L.Path).setStyle({
      fillColor: cor,
      fillOpacity: 0.8,
      color: "white", // borda branca padrão
      weight: estadoSelecionado === nomeEstado ? 3 : 1, // destaque se selecionado
    });

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const target = e.target as L.Path;
        target.setStyle({
          weight: 2,
          color: "white",       // borda cinza leve no hover
          fillOpacity: 0.9,
        });
        target.bringToFront(); // garante que o estado fique por cima
      },
      mouseout: (e: LeafletMouseEvent) => {
        const target = e.target as L.Path;
        const estadoAtual = e.target.feature.properties?.Estado;
        const corAtual = getCorPorMovimento(estadoAtual);
        target.setStyle({
          fillColor: corAtual,
          fillOpacity: 0.8,
          color: "white", // mantém branco
          weight: estadoSelecionado === estadoAtual ? 4 : 1,
        });
      },
      click: () => {
        setEstadoSelecionado(nomeEstado);
      },
    });
  };

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col gap-2 bg-white text-black p-2 rounded shadow-md border border-gray-300">
        {payload.map((entry, index) => {
          const name = entry.name;
          const value = entry.value;

          const formattedValue =
            name === 'Exportações' || name === 'Importações'
              ? `$ ${value?.toLocaleString('pt-BR')}`
              : value;

          let textColor = "text-black"; // cor padrão

          if (name === "Exportações") textColor = "text-green-600";
          else if (name === "Importações") textColor = "text-red-600";
          else if (name === "Setor") textColor = "text-blue-900";

          return (
            <p key={index} className={`text-base font-medium ${textColor}`}>
              {name}: {formattedValue}
            </p>
          );
        })}
      </div>
    );
  }

  return null;
};


  return (
    <div className="p-8 mt-10 relative z-10">
      <h2 className="text-white mb-4 text-4xl font-bold text-center">
        Análise de Estados
      </h2>

      <div className="w-full flex flex-col justify-center mt-11">
        <div className="w-full max-w-5xl mx-auto mb-6">
          <SelecionaPeriodo onPeriodosSelecionados={handlePeriodosSelecionados} />
        </div>
        <br />

        {/* NOVA DIV agrupando mapa, legenda e bloco com capital/PIB */}
        <div className={`relative w-full flex flex-col items-center ${estadoSelecionado ? "justify-center md:flex-col" : " "}`}>
          <div
            className={`relative mb-26  map-wrapper transition-all duration-500 ${estadoSelecionado ? "lg:translate-x-[-42.4%] w-10/12 lg:w-8/12" : "mb-4 w-10/12 lg:w-8/12"
              }`}
            style={{ height: "80vh" }}
          >
            {loading && (
              <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-[999] bg-transparent flex-col">
                <FaSpinner className="animate-spin text-blue-500 text-5xl" />
                <p className="mt-3 text-center">Carregando cores para o mapa...</p>
              </div>
            )}
            <MapContainer
              center={[-14.235, -51.9253]}
              zoom={4}
              minZoom={3}
              maxZoom={8}
              scrollWheelZoom={true}
              dragging={true}
              zoomControl={false}
              doubleClickZoom={true}
              boxZoom={false}
              keyboard={false}
              style={{ height: "100%", width: '100%', backgroundColor: "transparent" }}
              className= {`h-full ${estadoSelecionado ? "" : "" }`}
            >
              <div className="absolute">
                <ZoomControl position="topright" />
              </div>

              <TileLayer
                url="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAkcBT2Od3Y4AAAAASUVORK5CYII="
                attribution=""
              />
              <GeoJSON
                key={JSON.stringify(dadosEstadoMapa)}
                onEachFeature={onEachFeature}
                ref={(ref) => {
                  if (ref) geoJsonRef.current = ref;
                }}
                data={geoData as FeatureCollection}
                style={(feature) => {
                  const nome = feature?.properties?.Estado || "Desconhecido";

                  const isSelecionado = nome === estadoSelecionado;

                  return {
                    color: "#fff",
                    weight: isSelecionado ? 4 : 1,
                    fillColor: getCorPorMovimento(nome),
                    fillOpacity: isSelecionado ? 1 : 0.8,
                  };
                }}
              />
            </MapContainer>
          </div>
          <div className={`transition-all duration-500 z-[1000]
              bg-white/10 text-white shadow-md backdrop-blur border border-white/20 p-2 sm:p-3 rounded-lg w-fit self-start
              ${estadoSelecionado
              ? "w-fit flex flex-col gap-4 p-4 mb-0 lg:mb-10 mt-5"
              : "relative w-fit lg:absolute lg:bottom-[-94px] lg:left-2 lg:w-fit"
            } `}
          >
            <div className={`flex flex-col mr-2`}>
              <h4 className="font-semibold mb-1 whitespace-nowrap text-xs sm:text-sm">Legenda - Balança Comercial</h4>
              <hr className="border-0 h-[1px] w-full bg-[linear-gradient(to_right,#d5b8e8_50%,transparent_100%)]" />
              <p className={`opacity-75 mt-1 whitespace-nowrap text-xs sm:text-sm ${estadoSelecionado ? "" : "mb-4"}`}>Cálculo: exportações / importações</p>
            </div>
            <ul
              className={`gap-y-1 gap-x-4 z-10 ${estadoSelecionado
                ? "flex flex-col md:grid grid-cols-2"
                : "grid grid-cols-1"
                }`}
            >
              <li className="flex items-start gap-2 max-w-[180px]">
                <span
                  className="inline-block w-4 h-4 rounded mt-[0.25rem] shrink-0"
                  style={{ backgroundColor: "#28965A" }}
                ></span>
                <span className="break-words whitespace-normal leading-snug text-xs sm:text-sm">
                  Desempenho positivo
                </span>
              </li>
              <li className="flex items-start gap-2 max-w-[180px]">
                <span
                  className="inline-block w-4 h-4 rounded mt-[0.25rem] shrink-0"
                  style={{ backgroundColor: "#F57C00" }}
                ></span>
                <span className="break-words whitespace-normal leading-snug text-xs sm:text-sm">
                  Alerta
                </span>
              </li>
              <li className="flex items-start gap-2 max-w-[180px]">
                <span
                  className="inline-block w-4 h-4 rounded mt-[0.25rem] shrink-0"
                  style={{ backgroundColor: "#F9C846" }}
                ></span>
                <span className="break-words whitespace-normal leading-snug text-xs sm:text-sm">
                  Neutro
                </span>
              </li>
              <li className="flex items-start gap-2 max-w-[190px]">
                <span
                  className="inline-block w-4 h-4 rounded mt-[0.25rem] shrink-0"
                  style={{ backgroundColor: "#D64045" }}
                ></span>
                <span className="break-keep whitespace-normal leading-snug text-xs sm:text-sm">
                  Desempenho negativo
                </span>
              </li>
            </ul>
          </div>


          {/* Bloco com capital, PIB etc. */}
          {estadoSelecionado && info && (
            <div className={`flex flex-col z-[1000] bg-white/10 border border-white/20 backdrop-blur rounded-lg p-6 text-white shadow-lg text-base transition-all duration-500
          w-[90%]
          ${estadoSelecionado ? "block mb-6 lg:mb-0 mt-[4rem] lg:mt-[6rem]" : "hidden"}
          lg:absolute lg:right-[0.4%] lg:top-[4.5%] lg:h-2/4 lg:w-[35%] xl:w-[33%]"
        }`}>
              <div className="mb-3">
                <h3 className="text-lg sm:text-xl font-bold mb-2">{info.estado}</h3>
                <hr className="border-0 h-[1px] w-full bg-[linear-gradient(to_right,#d5b8e8_60%,transparent_100%)]" />
              </div>
              <p className="text-sm sm:text-lg"><span className="font-semibold">Capital:</span> {info.capital}</p>
              <p className="text-sm sm:text-lg"><span className="font-semibold">Área Territorial:</span> {info.area}</p>
              {(() => {
                const anoKey = anoMaisProximo.toString() as keyof typeof info.pib;
                const valorPib = info.pib[anoKey];
                const dados = dadosFiltrados.find((e) => e.estado === estadoSelecionado);
                const exp = dados?.exportacao;
                const imp = dados?.importacao;
                return (
                  <div>
                    <p className="mb-2 mt-6 text-sm sm:text-lg">
                      <span className="font-semibold">PIB:</span>{" "}
                      {valorPib}
                    </p>
                    <ul className="list-disc pl-5">
                      <li><span className="font-medium text-sm sm:text-lg">Exportação: $</span>{" "}
                        {exp ? formatNumber(exp) : 'N/A'}</li>
                      <li><span className="font-medium text-sm sm:text-lg">Importação: $</span>{" "}
                        {imp ? formatNumber(imp) : 'N/A'}</li>
                    </ul>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Nova caixa de informações adicional */}
        {/* {estadoSelecionado && (
              <>
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
          </>
            )} */}
        {estadoSelecionado && (
          <div className="w-full bg-white/10 border border-white/20 backdrop-blur rounded-lg text-white shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <PainelEstatisticasVlfob
                ncm={null}
                estado={codigosEstados[estadoSelecionado as keyof typeof codigosEstados]?.[0]}
                pais={null}
              />
              <PainelEstatisticasBalancaComercial
                ncm={null}
                estado={codigosEstados[estadoSelecionado as keyof typeof codigosEstados]?.[0]}
                pais={null}
              />
            </div>
            <div className="w-full overflow-x-auto max-w-full">
              <PainelEstatisticasAuxiliares
                ncm={null}
                estado={codigosEstados[estadoSelecionado as keyof typeof codigosEstados]?.[0]}
                pais={null}
              />
            </div>

            {/* Gráfico de barras - Setores Econômicos */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between w-full">
              <div className="w-11/12 lg:w-6/12 mx-auto">
                <h3 className="text-white mt-5 mb-0 sm:mb-5 text-xl font-semibold">
                  Exportações vs Importações por Setor: {estadoSelecionado}
                </h3>
                <p className="block mb-5 text-white/60 sm:hidden sm:mb-0">(Clique para visualizar detalhes)</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosSetores} >
                    <XAxis dataKey="setor" stroke="#E0E0E0" tick={{ fontSize: isSmallerScreen ? 0 : isSmallScreen ? 8 : 9, fill: "#ffffff" }} interval={0} />
                    <YAxis stroke="#E0E0E0" tick={{ fill: "#ffffff" }} domain={[0, 'dataMax']} allowDataOverflow={true} tickFormatter={formatarNumeroEixoY} minTickGap={15} interval="preserveStartEnd" />

                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="setor" fill="rgb(12, 10, 121)" name="Setor"/>
                    <Bar dataKey="exportacao" fill="rgb(35, 148, 20)" name="Exportações" radius={[4, 4, 0, 0]}/>
                    <Bar dataKey="importacao" fill="rgb(179, 15, 15)" name="Importações" radius={[4, 4, 0, 0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfico de barras - Exportações vs Importações */}
              <div className="w-11/12 lg:w-1/3 mx-auto">
                <h3 className="text-white mt-5 mb-5 text-xl font-semibold">
                  Exportações vs Importações: {estadoSelecionado}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosFiltrados}>
                    <XAxis dataKey="estado" stroke="#E0E0E0" />
                    <YAxis stroke="#E0E0E0" tickFormatter={formatarNumeroEixoY} />
                    <ChartTooltip formatter={(value: number) => `$ ${value?.toLocaleString('pt-BR')}`} />
                    <Bar dataKey="exportacao" fill="rgb(35, 148, 20)" name="Exportações" radius={[4, 4, 0, 0]}/>
                    <Bar dataKey="importacao" fill="rgb(179, 15, 15)" name="Importações" radius={[4, 4, 0, 0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
