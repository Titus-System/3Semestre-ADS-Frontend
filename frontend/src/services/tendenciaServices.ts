export async function buscarTendenciaBalancaComercial(estado?:number|null, pais?:number|null) {
    try {
        const baseUrl = "http://localhost:5000";
        const url = new URL(`${baseUrl}/busca_tendencia_balanca_comercial`);
        
        if (estado) {
            url.searchParams.append("estado", estado?.toString());
        }
        if (pais) {
            url.searchParams.append("pais", pais.toString());
        }

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

export async function buscarTendenciaVlFob(tipo:"exp"|"imp", estado?:number|null, pais?:number|null) {
    try {
        const baseUrl = "http://localhost:5000";
        const url = new URL(`${baseUrl}/busca_tendencia_vlfob`);
        url.searchParams.append("tipo", tipo);
        if (estado) {
            url.searchParams.append("estado", estado?.toString());
        }
        if (pais) {
            url.searchParams.append("pais", pais.toString());
        }

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


export async function buscarTendenciaVa(tipo:"exp"|"imp", estado?:number|null, pais?:number|null) {
    try {
        const baseUrl = "http://localhost:5000";
        const url = new URL(`${baseUrl}/busca_tendencia_va`);
        url.searchParams.append("tipo", tipo);
        if (estado) {
            url.searchParams.append("estado", estado?.toString());
        }
        if (pais) {
            url.searchParams.append("pais", pais.toString());
        }

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

