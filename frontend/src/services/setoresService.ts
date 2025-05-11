export async function buscaPaisPorNome(nome:string){
    try {
        const baseUrl = "http://localhost:5000";
        
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
        alert(error instanceof Error ? error.message : 'Erro desconhecido');
        throw error;
    }
}

export async function buscaInfoSetores(anos:number[]|null, pais:number|null, estado:string|null) {
    try {
        const baseUrl = "http://localhost:5000";
        
        const url = new URL(`${baseUrl}/busca_info_setores`);
        if (pais) {
            url.searchParams.append('pais', pais.toString());
        }
        if(estado) {
            url.searchParams.append('estado_sigla', estado);
        }
        if(anos){
            const appendListParams = (paramName: string, values?: number[]) => {
                values?.forEach(value => url.searchParams.append(paramName, value.toString()));
            };
            appendListParams('anos', anos);
        }
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
        alert(error instanceof Error ? error.message : 'Erro desconhecido');
        throw error;
    }
}