import { useState } from "react";
import { busca_transacoes_por_ncm } from "../services/ncmService";
import SelecionaModalTransporte from "../components/selecionaModalTransporte";
import SelecionaPeriodo from "../components/selecionaPeriodo";
import SelecionaTipoProcesso from "../components/SelecionaTipoProcesso";
import InputPesquisa from "../components/InputPesquisa";
import TabelaResultados from "../components/TabelaResultados";

interface Transacao {
    id_transacao: number;
    id_pais: number;
    ano: number;
    // Adicione outros campos necessários aqui
    [key: string]: string | number | boolean | null;
}

export default function BuscarNCM() {
  const [selectedModes, setSelectedModes] = useState<number[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
  const [mercadoria, setMercadoria] = useState("");
  const [estado, setEstado] = useState("");
  const [tipoProcesso, setTipoProcesso] = useState<"exp" | "imp" | null>(null);
  const [localDestino, setLocalDestino] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [urf, setUrf] = useState("");
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  const handleModaisSelecionados = (modais: number[]) => {
      setSelectedModes(modais);
  };

  const handlePeriodosSelecionados = (periodos: number[]) => {
      setSelectedPeriods(periodos);
  };

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

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#656586] p-6">
      <h1 className="text-4xl font-bold text-gray-900 mt-6 mb-4 text-center">Busca por NCM</h1>
      <h3 className="text-2xl font-medium text-gray-900 mt-6 mb-9 text-center">Seção</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center justify-center mt-9 mb-9 w-full max-w-5xl">
        <InputPesquisa
          label="Defina a mercadoria:"
          value={mercadoria}
          onChange={setMercadoria}
          placeholder="Digite o NCM"
        />

        <InputPesquisa
          label="Defina o estado:"
          value={estado}
          onChange={setEstado}
          placeholder="Digite o código do estado"
        />

        <SelecionaTipoProcesso
          tipoProcesso={tipoProcesso}
          setTipoProcesso={setTipoProcesso}
        />

        <InputPesquisa
          label="Defina o país de origem/destino:"
          value={localDestino}
          onChange={setLocalDestino}
          placeholder="Digite o código do país"
        />

        <InputPesquisa
          label="Defina a quantidade mínima (kg):"
          value={quantidade}
          onChange={setQuantidade}
          placeholder="Digite a quantidade"
        />

        <InputPesquisa
          label="Defina a URF:"
          value={urf}
          onChange={setUrf}
          placeholder="Digite o código da URF"
        />
      </div>

      <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Selecione os Modais de Transporte</h1>

          <SelecionaModalTransporte onModaisSelecionados={handleModaisSelecionados} />
      </div>

      <div className="flex flex-col space-y-4 h-auto w-full max-w-5xl mt-6">
          <SelecionaPeriodo onPeriodosSelecionados={handlePeriodosSelecionados} />
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
          <TabelaResultados transacoes={transacoes} tipoProcesso={tipoProcesso} />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
