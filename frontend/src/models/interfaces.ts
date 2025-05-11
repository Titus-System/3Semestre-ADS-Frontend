export interface Mercadoria {
    id_ncm: number;
    descricao: string;
}

export interface Estado {
    id_estado: number;
    nome: string;
    sigla: string;
}

export interface Pais {
    id_pais: number;
    nome: string;
}

export interface RankingNcm {
    ncm: number;
    produto_descricao: string;
    sh4_descricao: string;
    total_kg_liquido: number;
    total_registros: number;
    total_valor_agregado: number;
    total_valor_fob: number;
}[];
export type RankingNcms = RankingNcm[];


export interface RankingPais {
    id_pais: number,
    nome_pais: string,
    total_kg_liquido: number,
    total_registros: number,
    total_valor_agregado: number,
    total_valor_fob: number
}
export type RankingPaises = RankingPais[];

export interface RankingEstado {
  id_estado: number;
  sigla_estado: string;
  nome_estado: string;
  total_valor_fob: number;
  total_kg_liquido: number;
  total_valor_agregado: number;
  total_registros: number;
}

export type RankingEstados = RankingEstado[];

export interface DadoSetor {
    KG_LIQUIDO_EXP: number
    KG_LIQUIDO_IMP: number
    VL_FOB_EXP: number
    VL_FOB_IMP: number
    setor: string,
    valor_agregado_exp: number,
    valor_agregado_imp: number
}
export type DadosSetores = DadoSetor[]
