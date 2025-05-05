export async function buscaBalancaComercial(
    anos?: number[],
    estados?: number[],
    meses?: number[],
    paises?: number[],
) {
    try {
        const baseUrl = "http://localhost:5000";
        const url = new URL(`http://localhost:5000/busca_balanca_comercial`);
        const appendListParams = (paramName: string, values?: number[]) => {
            values?.forEach(value => url.searchParams.append(paramName, value.toString()));
        };
        appendListParams('anos', anos);
        appendListParams('meses', meses);
        appendListParams('paises', paises);
        appendListParams('estados', estados);

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