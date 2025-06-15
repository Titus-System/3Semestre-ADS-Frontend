import { baseUrl } from "./serviceUtils";

async function buscaGeral(
    rota: string,
    tipo: "exp" | "imp",
    ncm?: number[],
    anos?: number[],
    paises?: number[],
    estados?: number[],
    vias?: number[],
    urfs?: number[]
){
    try {
        const url = new URL(`${baseUrl}/${rota}`);
        url.searchParams.append('tipo', tipo);
        const appendListParams = (paramName: string, values?: number[]) => {
            values?.forEach(value => url.searchParams.append(paramName, value.toString()));
        };
        appendListParams('ncm', ncm);
        appendListParams('anos', anos);
        appendListParams('paises', paises);
        appendListParams('estados', estados);
        appendListParams('vias', vias);
        appendListParams('urfs', urfs)

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        const data = await response.json();

        if (response.status == 200) {
            console.log(data.resposta);
            return data.resposta;
        } else {
            throw new Error(data.error || "Erro desconhecido");
        }

    } catch (error) {
        console.error("Erro ao acessar servidor:", error);
        // alert(error instanceof Error ? error.message : 'Erro desconhecido');
        // throw error;
        return{erro:error}
    }
}

export async function buscaInfoGeral(
    tipo: "exp" | "imp",
    ncm?: number[],
    anos?: number[],
    paises?: number[],
    estados?: number[],
    vias?: number[],
    urfs?: number[]
) {
    if (ncm && isNaN(ncm[0])){
        ncm = []
    }
    const res = await buscaGeral('busca_info_geral',tipo, ncm, anos, paises, estados, vias, urfs);
    return res[0]
}

export async function buscaHistGeral(
    tipo: "exp" | "imp",
    ncm?: number[],
    paises?: number[],
    estados?: number[],
    vias?: number[],
    urfs?: number[]
) {
    const res = await buscaGeral('busca_hist_geral',tipo, ncm, undefined, paises, estados, vias, urfs);
    return res
}