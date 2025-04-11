import { useState } from "react";
import { FaShip, FaPlane, FaGlobe, FaBox, FaTrain, FaRoad, FaWater, FaBroadcastTower} from "react-icons/fa";
import { IoBoat} from "react-icons/io5";
import { GiPipes } from "react-icons/gi";
import { busca_transacoes_por_ncm } from "../services/ncmService";

export default function BuscarNCM() {
  const transportModes = [
    { id: "fluvial", icon: <FaWater size={30} />, codigo: 2 },
    { id: "aéreo", icon: <FaPlane size={30} />, codigo: 4 },
    { id: "vicinal fronteirico", icon: <FaGlobe size={30} />, codigo: 15 },
    { id: "postal", icon: <FaBox size={30} />, codigo: 5 },
    { id: "maritimas", icon: <FaShip size={30} />, codigo: 1 },
    { id: "ferroviario", icon: <FaTrain size={30} />, codigo: 6 },
    { id: "rodoviario", icon: <FaRoad size={30} />, codigo: 7 },
    { id: "lacustre", icon: <IoBoat size={30} />, codigo: 3 },
    { id: "rede de transmissão", icon: <FaBroadcastTower size={30} />, codigo: 8 },
    { id: "dutos", icon: <GiPipes className="text-gray-800 w-8 h-8" />, codigo: 14 },
  ];

  const [selectedModes, setSelectedModes] = useState<number[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
  const [mercadoria, setMercadoria] = useState("");
  const [estado, setEstado] = useState("");
  const [tipoProcesso, setTipoProcesso] = useState<"exp" | "imp" | null>(null);
  const [localDestino, setLocalDestino] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [urf, setUrf] = useState("");

  const toggleModeSelection = (id: number) => {
    setSelectedModes((prev) =>
      prev.includes(id) ? prev.filter((mode) => mode !== id) : [...prev, id]
    );
  };

  const togglePeriodSelection = (id: number) => {
    setSelectedPeriods((prev) =>
      prev.includes(id) ? prev.filter((period) => period !== id) : [...prev, id]
    );
  };

  const [transacoes, setTransacoes] = useState<any[]>([]);

  const buscarTransacoes = async () => {
    try {
      const ncm = parseInt(mercadoria);
      const qtd = quantidade ? parseInt(quantidade) : undefined;
      const destino = localDestino ? [parseInt(localDestino)] : undefined;
      const estadoDestino = estado ? [parseInt(estado)] : undefined;
      const urfSelecionada = urf ? [parseInt(urf)] : undefined;

      const modosSelecionados = selectedModes.length > 0 ? selectedModes : undefined;

      const resultados = await busca_transacoes_por_ncm(
        ncm,
        tipoProcesso || "",
        qtd,
        selectedPeriods,
        undefined,
        destino,
        estadoDestino,
        modosSelecionados,
        urfSelecionada
      );

      setTransacoes(resultados);
    } catch (err) {
      console.error("Erro ao buscar transações", err);
    }
  };

  const analysisPeriod = Array.from({ length: 11 }, (_, i) => ({
    id: 2014 + i,
    icon: `${2014 + i}`,
  }));

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#656586] p-6">
      <h1 className="text-4xl font-bold text-gray-900 mt-6 mb-4 text-center">Busca por NCM</h1>
      <h3 className="text-2xl font-medium text-gray-900 mt-6 mb-9 text-center">Seção</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center justify-center mt-9 mb-9 w-full max-w-5xl">
        <div className="flex flex-col space-y-2 w-full">
          <label className="text-black text-xl font-semibold">Defina a mercadoria:</label>
          <input
            type="text"
            value={mercadoria}
            onChange={(e) => setMercadoria(e.target.value)}
            className="bg-white text-gray-900 text-md font-medium p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-16"
          />
        </div>

        <div className="flex flex-col space-y-2 w-full">
          <label className="text-black text-xl font-semibold">Defina o estado:</label>
          <input
            type="text"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="bg-white text-gray-900 text-md font-medium p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-16"
          />
        </div>

        <div className="flex flex-col space-y-2 w-full">
          <label className="text-black text-xl font-semibold">Tipo de processo:</label>
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setTipoProcesso("exp")}
              className={`p-3 border border-gray-300 rounded-l-full w-1/2 h-16 font-bold ${
                tipoProcesso === "exp"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-900 hover:bg-gray-300"
              }`}
            >
              Exportação
            </button>
            <button
              onClick={() => setTipoProcesso("imp")}
              className={`p-3 border border-gray-300 border-l-0 rounded-r-full w-1/2 h-16 font-bold ${
                tipoProcesso === "imp"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-900 hover:bg-gray-300"
              }`}
            >
              Importação
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-2 w-full">
          <label className="text-black text-xl font-semibold">Defina o país de origem/destino:</label>
          <input
            type="text"
            value={localDestino}
            onChange={(e) => setLocalDestino(e.target.value)}
            className="bg-white text-gray-900 text-md font-medium p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-16"
          />
        </div>

        <div className="flex flex-col space-y-2 w-full">
          <label className="text-black text-xl font-semibold">Defina a quantidade mínima (kg):</label>
          <input
            type="text"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="bg-white text-gray-900 text-md font-medium p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-16"
          />
        </div>

        <div className="flex flex-col space-y-2 w-full">
          <label className="text-black text-xl font-semibold">Defina a URF:</label>
          <input
            type="text"
            value={urf}
            onChange={(e) => setUrf(e.target.value)}
            className="bg-white text-gray-900 text-md font-medium p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-16"
          />
        </div>
      </div>

      {/* Modal de Transporte */}
      <div className="flex flex-col space-y-4 h-auto w-full max-w-5xl">
        <p className="text-black text-xl font-semibold text-center">Defina o modal de transporte</p>

        {/* Dropdown para telas menores */}
        <div className="block md:hidden">
          <select
            className="bg-white text-gray-900 text-md font-medium p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-16 w-full appearance-none pr-10"
            style={{
              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>')`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.5rem',
            }}
            onChange={(e) => toggleModeSelection(parseInt(e.target.value))}
          >
            <option value="">Selecione um modal</option>
            {transportModes.map((mode) => (
              <option key={mode.codigo} value={mode.codigo}>
                {mode.id.charAt(0).toUpperCase() + mode.id.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Botões para telas maiores */}
        <div className="hidden md:flex bg-white text-gray-900 font-bold p-3 border border-gray-300 rounded-full shadow-md flex-wrap justify-center w-full gap-10">
          {transportModes.map((mode) => {
            const isSelected = selectedModes.includes(mode.codigo);
            return (
              <button
                key={mode.codigo}
                className={`relative group p-4 rounded-full text-xl transition-all duration-200 ${
                  isSelected
                    ? "bg-gray-900 text-white border-2 border-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => toggleModeSelection(mode.codigo)}
              >
                {mode.icon}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {mode.id.charAt(0).toUpperCase() + mode.id.slice(1)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Período de Análise */}
      <div className="flex flex-col space-y-2 h-auto w-full max-w-5xl mt-6">
        <p className="text-black text-xl font-semibold text-center">Defina o período de análise</p>

        {/* Dropdown para telas menores */}
        <div className="block md:hidden">
          <select
            className="bg-white text-gray-900 text-md font-medium p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-16 w-full appearance-none pr-10"
            style={{
              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>')`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.5rem',
            }}
            onChange={(e) => togglePeriodSelection(parseInt(e.target.value))}
          >
            <option value="">Selecione um período</option>
            {analysisPeriod.map((period) => (
              <option key={period.id} value={period.id}>
                {period.icon}
              </option>
            ))}
          </select>
        </div>

        {/* Botões para telas maiores */}
        <div className="hidden md:flex bg-white text-gray-900 text-md font-bold p-3 border border-gray-300 rounded-full shadow-md hover:bg-gray-100 flex-wrap justify-center gap-4">
          {analysisPeriod.map((period) => (
            <button
              key={period.id}
              className={`p-3 rounded-md text-xl transition-all duration-200 ${
                selectedPeriods.includes(period.id)
                  ? "bg-gray-900 text-white border-2 border-white"
                  : "text-gray-700"
              } hover:bg-gray-300`}
              onClick={() => togglePeriodSelection(period.id)}
            >
              {period.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Botão Final */}
      <div className="flex flex-col space-y-2 w-full max-w-md h-28 mt-9 mb-9">
        <button
          className="bg-gray-900 text-white p-4 text-md font-bold rounded-full shadow-md hover:bg-[#11114E] w-full h-16"
          onClick={buscarTransacoes}
        >
          Buscar Transações
        </button>
      </div>

      <div className="w-full max-w-5xl overflow-x-auto">
        {transacoes.length > 0 ? (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th></th>
                <th className="px-4 py-2 text-left">id_transacao</th>
                <th className="px-4 py-2 text-left">pais</th>
                <th className="px-4 py-2 text-left">ano</th>
                <th className="px-4 py-2 text-left">tipo</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((linha, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{linha.id_transacao}</td>
                  <td className="px-4 py-2">{linha.id_pais}</td>
                  <td className="px-4 py-2">{linha.ano}</td>
                  <td className="px-4 py-2">{tipoProcesso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
