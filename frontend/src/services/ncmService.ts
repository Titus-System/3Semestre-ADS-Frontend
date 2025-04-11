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

        // realiza a requisição
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                "Accept": "application/json"
            }
        });

        const data = await response.json();

        if (response.status === 200) {
            let res = data.resposta;
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


export async function busca_ncm_por_descricao(descricao: string): Promise<any> {
    try {

        const url = new URL('http://localhost:5000/pesquisa_ncm_por_nome');
        
        // Adiciona parâmetros obrigatórios
        url.searchParams.append('nome', descricao);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                "Accept": "application/json"
            }
        });

        const data = await response.json();

        if (response.status === 200) {
            let res = data.resposta;
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

