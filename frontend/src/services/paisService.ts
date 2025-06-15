import { baseUrl } from "./serviceUtils";

export async function buscaPaisPorNome(nome:string){
    try {
        const url = new URL(`${baseUrl}/pesquisa_pais_por_nome`);
        url.searchParams.append('nome', nome);
    
        const response = await fetch (url.toString(),{
            method:"GET",
            headers: {
                "Accept" : "application/json"
            } 
        });
    
        const data = await response.json();
    
        if (response.status == 200) {
            console.log(data.resposta);
            return data.resposta
        } else {
            throw new Error (data.error || "Erro desconhecido")
        }
    } catch (error) {
        console.error("Erro ao acessar servidor:", error);
        // alert(error instanceof Error ? error.message : 'Erro desconhecido');
        // throw error;
    }
}


export async function buscarRankingPaises(
    tipo: "exp"|"imp",
    qtd: number,
    ncm?: number[],
    paises?: number[],
    estados?: number[],
    anos?: number[],
    meses?: number[],
    crit?:  "valor_fob"|"kg_liquido"|"valor_agregado"|"registros",
    cresc: 0 | 1 = 0
){
    try {
        const url = new URL(`${baseUrl}/ranking_pais`);
        url.searchParams.append('tipo', tipo);
        url.searchParams.append('qtd', qtd.toString());
        // console.log("🔗 URL da requisição (país):", url.toString());
        if (crit) {
            url.searchParams.append('crit', crit );
        }
        
        url.searchParams.append('cresc', cresc.toString())
        
        const appendListParams = (paramName: string, values?: number[]) => {
            values?.forEach(value => url.searchParams.append(paramName, value.toString()));
        };
        appendListParams('ncm', ncm);
        appendListParams('paises', paises);
        appendListParams('estados', estados);
        appendListParams('anos', anos);
        appendListParams('meses', meses);
        console.log(url.toString())
        const response = await fetch (url.toString(),{
            method:"GET",
            headers: {
                "Accept" : "application/json"
            } 
        });

        const data = await response.json();

        if (response.status == 200) {
            console.log(data.resposta);
            return data.resposta
        } else{
            throw new Error (data.error || "Erro desconhecido")
        }

    } catch (error) {
        console.error("Erro ao acessar servidor:", error);
        // alert(error instanceof Error ? error.message : 'Erro desconhecido');
        // throw error;
    }
}

export async function buscarHistoricoPais(
    tipo: string,
    paises: number[],
    ncm?: number[],
    estados?: number[],
    anos?: number[],
    meses?: number[],
    via?: number[],
    urfs?: number[]
){
    try {
        const url = new URL(`${baseUrl}/busca_pais_hist`);
        url.searchParams.append('tipo', tipo);
        const appendListParams = (paramName: string, values?: number[]) => {
            values?.forEach(value => url.searchParams.append(paramName, value.toString()));
        };
        appendListParams('paises', paises);
        appendListParams('ncm', ncm);
        appendListParams('estados', estados);
        appendListParams('anos', anos);
        appendListParams('meses', meses);
        appendListParams('via', via);
        appendListParams('urfs', urfs);
        
        console.log(url.toString())
        const response = await fetch (url.toString(),{
            method:"GET",
            headers: {
                "Accept" : "application/json"
            } 
        });

        const data = await response.json();

        if (response.status == 200) {
            console.log(data.resposta);
            return data.resposta
        } else{
            throw new Error (data.error || "Erro desconhecido")
        }
    } catch (error) {
        console.error("Erro ao acessar servidor:", error);
        // alert(error instanceof Error ? error.message : 'Erro desconhecido');
        // throw error;
    }
}


export async function buscaPaisExpImpInfo(
    paises: number[],
    ncm?: number[],
    estados?: number[],
    anos?: number[],
    meses?: number[]
){
    try {
        const url = new URL(`${baseUrl}/busca_pais_exp_imp_info`);
        const appendListParams = (paramName: string, values?: number[]) => {
            values?.forEach(value => url.searchParams.append(paramName, value.toString()));
        };
        appendListParams('ncm', ncm);
        appendListParams('paises', paises);
        appendListParams('estados', estados);
        appendListParams('anos', anos);
        appendListParams('meses', meses);

        const response = await fetch (url.toString(),{
            method:"GET",
            headers: {
                "Accept" : "application/json"
            } 
        });
        console.log(url.toString())
        const data = await response.json();

        if (response.status == 200) {
            console.log(data.resposta);
            return data.resposta
        } else{
            throw new Error (data.error || "Erro desconhecido")
        }

    } catch (error) {
        console.error("Erro ao acessar servidor:", error);
        // alert(error instanceof Error ? error.message : 'Erro desconhecido');
        // throw error;
    }
}