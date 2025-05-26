import { useState } from "react";
import { Estado, Mercadoria, Pais, Sh4 } from "../../models/interfaces";
import GraficoTendencias from "../graficos/GraficoTendencias";
import GraficoTendenciasSh4 from "../graficos/GraficoTendenciasSh4";

type Props = {
    estado?: Estado | null,
    pais?: Pais | null,
    ncm?: Mercadoria | null,
    sh4?: Sh4 | null
}

export default function PainelTendencias({ estado, pais, ncm, sh4 }: Props) {
    const [exibicao, setExibicao] = useState<string>('valor_fob');
    const [resumo, setResumo] = useState<any>(null);
    const [dadosGrafico, setDadosGrafico] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);



    return (
        <div className="">
            {sh4 ? (
                <GraficoTendenciasSh4 sh4={sh4.id_sh4} estado={estado?.id_estado} pais={pais?.id_pais} />
            ) : (
                <GraficoTendencias
                    estado={estado}
                    pais={pais}
                    ncm={ncm}
                />
            )}
        </div>
    );
}