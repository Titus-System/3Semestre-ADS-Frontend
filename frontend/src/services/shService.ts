export async function buscaVlFobSh4(
    sh4: number[],
    anos?: number[],
    estados?: number[],
){
    try {
        const baseUrl = "http://localhost:5000";
        
        const url = new URL(`${baseUrl}/busca_vlfob_sh4`);
        
        const appendListParams = (paramName: string, values?: number[]) => {
            values?.forEach(value => url.searchParams.append(paramName, value.toString()));
        };
        appendListParams('sh4', sh4);
        appendListParams('anos', anos);
        appendListParams('estados', estados);

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

    }catch (error) {
        console.error("Erro ao acessar servidor:", error);
        // alert(error instanceof Error ? error.message : 'Erro desconhecido');
        // throw error;
    }
}

export async function buscaVlFobSetores(
    anos?: number[],
    estados?: number[],
    paises?: number[]
){
    try {
        const baseUrl = "http://localhost:5000";
        
        const url = new URL(`${baseUrl}/busca_vlfob_setores`);
        
        const appendListParams = (paramName: string, values?: number[]) => {
            values?.forEach(value => url.searchParams.append(paramName, value.toString()));
        };
        appendListParams('anos', anos);
        appendListParams('estados', estados);
        appendListParams('paises', paises);

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
    }catch (error) {
        console.error("Erro ao acessar servidor:", error);
        // alert(error instanceof Error ? error.message : 'Erro desconhecido');
        // throw error;
    }
}