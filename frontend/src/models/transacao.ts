export default interface Transacao {
    ano: number;
    id_transacao: number;
    kg_liquido: number;
    mercadoria: string;
    nome_pais: string;
    sigla_estado: string;
    transporte: string;
    unidade_receita_federal: string;
    valor_agregado: number;
    valor_fob: number;
}