export async function busca_transacoes_por_ncm(
    ncm: number,
    tipo: string, 
    qtd?: number, 
    anos?: number[], 
    meses?: number[], 
    paises?: number[], 
    estados?: number[], 
    vias?: number[], 
    urfs?: number[]
): Promise<any> {
    try {
        // Constrói a URL com parâmetros de query
        const url = new URL('http://localhost:5000/busca_transacoes_por_ncm');
        
        // Adiciona parâmetros obrigatórios
        url.searchParams.append('tipo', tipo);
        url.searchParams.append('ncm', ncm.toString());
        if (qtd) url.searchParams.append('qtd', qtd.toString());

        // Adiciona listas de parâmetros
        const appendListParams = (paramName: string, values?: number[]) => {
            values?.forEach(value => url.searchParams.append(paramName, value.toString()));
        };

        appendListParams('anos', anos);
        appendListParams('meses', meses);
        appendListParams('paises', paises);
        appendListParams('estados', estados);
        appendListParams('vias', vias);
        appendListParams('urfs', urfs);

        console.log(url.toString());
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                "Accept": "application/json"
            }
        });

        const data = await response.json();

        if (response.status === 200) {
            const res = data.resposta;
            console.log("Dados recebidos:", res);
            return res;
        } else {
            throw new Error(data.error || 'Erro desconhecido');
        }

    } catch (error) {
        console.error("Erro ao acessar servidor:", error);
        alert(error instanceof Error ? error.message : 'Erro desconhecido');
        throw error;
    }
}


export async function buscarRankingNcm(
    tipo: string,
    qtd: number,
    paises?: number[],
    estados?: number[],
    anos?: number[],
    meses?: number[],
    vias?: number[],
    urfs?: number[],
    crit?:  "valor_fob"|"kg_liquido"|"valor_agregado"|"registros",
    cresc?: 0 | 1

) {
    try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const url = new URL(`${baseUrl}/busca_ncm_ranking`);
        url.searchParams.append('tipo', tipo);
        url.searchParams.append('qtd', qtd.toString());

        if (crit) url.searchParams.append('crit', crit);
        if (cresc !== undefined) url.searchParams.append('cresc', cresc.toString());

        const appendListParams = (paramName: string, values?: number[]) => {
            values?.forEach(value => url.searchParams.append(paramName, value.toString()));
        };
        appendListParams('paises', paises);
        appendListParams('estados', estados);
        appendListParams('anos', anos);
        appendListParams('meses', meses);
        appendListParams('vias', vias);
        appendListParams('urfs', urfs);

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
        alert(error instanceof Error ? error.message : 'Erro desconhecido');
        throw error;
    }
}

export async function buscarNcmHist(
    tipo:"exp" | "imp",
    ncm: number[],
    anos: number[],
    meses: number[],
    paises: number[],
    estados: number[],
    vias: number[],
    urfs: number[]
) {
    try {
            const baseUrl = import.meta.env.VITE_BACKEND_URL;
            const url = new URL(`${baseUrl}/busca_ncm_hist`);
            url.searchParams.append('tipo', tipo);
        
            const appendListParams = (paramName: string, values?: number[]) => {
                values?.forEach(value => url.searchParams.append(paramName, value.toString()));
            };
            appendListParams('ncm', ncm);
            appendListParams('paises', paises);
            appendListParams('estados', estados);
            appendListParams('anos', anos);
            appendListParams('meses', meses);
            appendListParams('vias', vias);
            appendListParams('urfs', urfs);
        
            const response = await fetch (url.toString(), {
                method:"GET",
                headers:{
                    "Accept": "application/json"
                }
            });
        
            const data = await response.json();
        
            if (data.status == 200){
                console.log(data.resposta);
                return data.resposta;
            }else {
                throw new Error(data.error || "Erro desconhecido")
            }
    } catch (error) {
        console.error("Erro ao acessar servidor:", error);
        alert(error instanceof Error ? error.message : 'Erro desconhecido');
        throw error;
    }
}


export async function buscaNcmInfo(
    ncm: number[],
    anos: number[],
    meses: number[],
    paises: number[],
    vias: number[],
    urfs: number[]
){
    try {
        const baseUrl = "http://localhost:5000";
        const url = new URL(`${baseUrl}/busca_por_ncm`);
        
        const appendListParams = (paramName: string, values?: number[]) => {
            values?.forEach(value => url.searchParams.append(paramName, value.toString()));
        };
        appendListParams('ncm', ncm);
        appendListParams('anos', anos);
        appendListParams('meses', meses);
        appendListParams('paises', paises);
        appendListParams('vias', vias);
        appendListParams('urfs', urfs);

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
        alert(error instanceof Error ? error.message : 'Erro desconhecido');
        throw error;
    }
}


export async function buscaNcmPorNome(nome: string) {
    try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const url = new URL(`${baseUrl}/pesquisa_ncm_por_nome`);
        url.searchParams.append('nome', nome);

        console.log(url.toString());

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        const data = await response.json();
        console.log("Resposta recebida:", data);

        if (Array.isArray(data.resposta)) {
            return data.resposta;
        } else {
            throw new Error(data.error || "Erro desconhecido no formato da resposta");
        }

    } catch (error) {
        console.error("Erro ao acessar servidor:", error);
        alert(error instanceof Error ? error.message : 'Erro desconhecido');
        throw error;
    }
}
