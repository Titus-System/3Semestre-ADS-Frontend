import { useEffect, useState } from "react";
import GraficoBalancaComercial from "../components/tendencias/GraficoBalancaComercial";

interface Data {
    ds: string;
    yhat: number;
}

export default function Previsao() {
    const dados = [
  {
    "ds": "2025-01-01",
    "yhat": 2852701494.778069
  },
  {
    "ds": "2025-02-01",
    "yhat": 2627489317.4206176
  },
  {
    "ds": "2025-03-01",
    "yhat": 6709880911.159237
  },
  {
    "ds": "2025-04-01",
    "yhat": 6635673883.326174
  },
  {
    "ds": "2025-05-01",
    "yhat": 7153975694.936579
  },
  {
    "ds": "2025-06-01",
    "yhat": 6919247987.7843685
  },
  {
    "ds": "2025-07-01",
    "yhat": 6047493900.843933
  },
  {
    "ds": "2025-08-01",
    "yhat": 5144873728.716126
  },
  {
    "ds": "2025-09-01",
    "yhat": 5028519491.729018
  },
  {
    "ds": "2025-10-01",
    "yhat": 4180701367.1618147
  },
  {
    "ds": "2025-11-01",
    "yhat": 4695877625.518236
  },
  {
    "ds": "2025-12-01",
    "yhat": 4901194370.149957
  },
  {
    "ds": "2026-01-01",
    "yhat": 2131751945.7743185
  },
  {
    "ds": "2026-02-01",
    "yhat": 2914918094.3611
  },
  {
    "ds": "2026-03-01",
    "yhat": 6399807407.917589
  },
  {
    "ds": "2026-04-01",
    "yhat": 6741852375.252485
  },
  {
    "ds": "2026-05-01",
    "yhat": 6956395705.053032
  },
  {
    "ds": "2026-06-01",
    "yhat": 6973568690.212089
  },
  {
    "ds": "2026-07-01",
    "yhat": 5912354722.314599
  },
  {
    "ds": "2026-08-01",
    "yhat": 5162696522.231892
  },
  {
    "ds": "2026-09-01",
    "yhat": 4954637457.293419
  },
  {
    "ds": "2026-10-01",
    "yhat": 4166694481.1143556
  },
  {
    "ds": "2026-11-01",
    "yhat": 4580052867.243141
  },
  {
    "ds": "2026-12-01",
    "yhat": 4880284719.634406
  }
]

    const [siglaEstado, setSiglaEstado] = useState<string>("");
    const [nomePais, setNomePais] = useState<string>("");

    const [estadoSelecionado, setEstadoSelecionado] = useState<number>();
    const [paisSelecionado, setPaisSelecionado] = useState<number>();

    const [balComSelecionada, setBalComSelecionada] = useState<Data[]>([]);

    useEffect(() => {
        setBalComSelecionada(dados)

    }, [])

    return (
        <div className="p-8 mt-10 relative z-10">
            <h2 className="text-white mb-4 text-4xl font-bold text-center">
                Séries históricas e análises de tendências
            </h2>
            <div className="p-8 bg-white text-white">
                <div className="p-8">
                    <GraficoBalancaComercial dados={balComSelecionada} estado={siglaEstado} pais={nomePais} />
                </div>
            </div>

            
        </div>
    );
}