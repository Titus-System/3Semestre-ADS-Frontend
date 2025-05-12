import { DadosSetores, RankingDados, RankingEstado, RankingEstados, RankingNcm, RankingPais, RankingPaises } from "../models/interfaces"
import { buscarRankingEstadosPorNcm } from "../services/estadoService"
import { buscarRankingNcm } from "../services/ncmService";
import { buscarRankingPaises } from "../services/paisService";
import { buscaInfoSetores } from "../services/setoresService";

export async function estadosMaisExpImpPorNcm(tipo:"exp"|"imp"|null, anos:number[]|null, ncm:number|null, pais: number|null, cresc:boolean = false){
    const dados: any = await buscarRankingEstadosPorNcm(
        tipo ? tipo : "exp",
        anos ? anos : undefined,
        ncm ? ncm : undefined,
        pais ? pais : undefined,
        cresc
    );
    const rankingEstados = dados[0].dados.map((item: RankingEstado) => ({
        ...item,
        total_valor_fob: Number(item.total_valor_fob),
        total_kg_liquido: Number(item.total_kg_liquido),
        total_valor_agregado: Number(item.total_valor_agregado)
    }));
    return rankingEstados;
}

export async function paisesMaisExpImpPorNcmPorEstado(tipo:"exp"|"imp"|null, anos:number[]|null, ncm:number|null, id_estado:number|null, cresc:boolean = false){
    const dados: any = await buscarRankingPaises(
        tipo ? tipo : "exp",
        10,
        ncm ? [ncm] : undefined,
        undefined,
        id_estado ? [id_estado] : undefined,
        anos ? anos : undefined,
        undefined,
        undefined,
        cresc ? 1 : 0
    );
    const rankingPaises = dados.map((item: RankingPais) => ({
        ...item,
        total_valor_fob: Number(item.total_valor_fob),
        total_kg_liquido: Number(item.total_kg_liquido),
        total_valor_agregado: Number(item.total_valor_agregado)
    }));
    return rankingPaises; 
}

export async function ncmMaisExpImpPorEstadoPorPais(tipo:"exp"|"imp"|null, anos:number[]|null, id_pais:number|null, id_estado:number|null, cresc:boolean = false){
    const dados : any = await buscarRankingNcm(
        tipo ? tipo : "exp",
        10,
        id_pais ? [id_pais] : undefined,
        id_estado ? [id_estado] : undefined,
        anos ? anos : undefined,
        undefined, undefined, undefined, undefined,
        cresc ? 1 : 0
    );
    const rankingNcm = dados.map((item: RankingNcm) => ({
        ...item,
        total_valor_fob: Number(item.total_valor_fob),
        total_kg_liquido: Number(item.total_kg_liquido),
        total_valor_agregado: Number(item.total_valor_agregado)
    }));
    return rankingNcm;
}

export async function buscarDados(
    anosSelecionados: number[] | null,
    ncmSelecionado: number | null,
    idEstadoSelecionado: number | null,
    idPaisSelecionado: number | null,
    tipoSelecionado: string | null,
    cresc: boolean = false,
    siglaEstadoSelecionado: string | null
) {
    if (tipoSelecionado !== "exp" && tipoSelecionado !== "imp") {
        tipoSelecionado = null;
    }
    const rankingEstadosPorNcm = await estadosMaisExpImpPorNcm(tipoSelecionado, anosSelecionados, ncmSelecionado, idPaisSelecionado, cresc);
    const rankingPaisPorNcmPorEstado = await paisesMaisExpImpPorNcmPorEstado(tipoSelecionado, anosSelecionados, ncmSelecionado, idEstadoSelecionado, cresc);
    const rankingNcmPorEstadoPorPais = await ncmMaisExpImpPorEstadoPorPais(tipoSelecionado, anosSelecionados, idPaisSelecionado, idEstadoSelecionado, cresc);
    const infoSetores = await buscaInfoSetores(anosSelecionados, idPaisSelecionado, siglaEstadoSelecionado)
    const dados: RankingDados = {
        rankingEstados: rankingEstadosPorNcm,
        rankingPaises: rankingPaisPorNcmPorEstado,
        rankingNcm: rankingNcmPorEstadoPorPais,
        infoSetores: infoSetores
    }
    return dados
}
