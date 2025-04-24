export async function buscaEstadoPorNome(nome:string){
    try {
        const baseUrl = "http://localhost:5000";
        
        const url = new URL(`${baseUrl}/pesquisa_estado_por_nome`);
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
    }
    catch (error) {
        console.error("Erro ao acessar servidor:", error);
        alert(error instanceof Error ? error.message : 'Erro desconhecido');
        throw error;
    }
}

export async function buscarRankingEstados(
    tipo: string[],
    qtd: number,
    anos?: number[],
    meses?: number[],
    ncm?: number[],
    paises?: number[],
    crit?: "valor_fob"|"kg_liquido"|"valor_agregado"|"registros",
    cresc: 0 | 1 = 0
){
    try {
        const base_url = "http://localhost:5000";
        const url = new URL(`${base_url}/ranking_estado`);
        url.searchParams.append('qtd', qtd.toString());
        if (crit) {
            url.searchParams.append('crit', crit);
        }
        url.searchParams.append('cresc', cresc.toString());
        
        const appendListParams = (paramName: string, values?: number[]|string[]) => {
            values?.forEach(value => url.searchParams.append(paramName, value.toString()));
        };
        appendListParams('tipo', tipo);
        appendListParams('ncm', ncm);
        appendListParams('paises', paises);
        appendListParams('anos', anos);
        appendListParams('meses', meses);
        console.log("🔗 URL da requisição:", url.toString());
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
        alert(error instanceof Error ? error.message : 'Erro desconhecido');
        throw error;
    }
}


export async function buscarHistoricoEstado(
    tipo: string,
    estados: number[],
    ncm?: number[],
    anos?: number[],
    meses?: number[],
    paises?: number[],
    via?: number[],
    urfs?: number[]
){
    try {
        const base_url = "http://localhost:5000";
        const url = new URL(`${base_url}/busca_estado_hist`);
        url.searchParams.append('tipo', tipo);

        const appendListParams = (paramName: string, values?: number[]) => {
            values?.forEach(value => url.searchParams.append(paramName, value.toString()));
        };
        appendListParams('estados', estados);
        appendListParams('ncm', ncm);
        appendListParams('anos', anos);
        appendListParams('meses', meses);
        appendListParams('paises', paises);
        appendListParams('via', via);
        appendListParams('urfs', urfs);

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
        alert(error instanceof Error ? error.message : 'Erro desconhecido');
        throw error;
    }
}
