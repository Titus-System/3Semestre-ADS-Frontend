export async function buscarTendenciaBalancaComercial(estado?:number|null, pais?:number|null, ncm?:number|null) {
    try {
        const baseUrl = "http://localhost:5000";
        const url = new URL(`${baseUrl}/busca_tendencia_balanca_comercial`);
        if(ncm) {
            url.searchParams.append("ncm", ncm?.toString());
        }
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

export async function buscarTendenciaVlFob(tipo:"exp"|"imp", estado?:number|null, pais?:number|null, ncm?:number|null) {
    try {
        const baseUrl = "http://localhost:5000";
        const url = new URL(`${baseUrl}/busca_tendencia_vlfob`);
        url.searchParams.append("tipo", tipo);
        if (ncm) {
            url.searchParams.append("ncm", ncm.toString())
        }
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
            console.log(`tendenciavlfob estado:${estado} - pais:${pais}`, data.resposta);
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

async function baseBuscaEstatVlFob(tipo:"exp"|"imp", estado?:number|null, pais?:number|null, rota?:string, ncm?:number|null) {
        try {
        const baseUrl = "http://localhost:5000";
        const url = new URL(`${baseUrl}/${rota}`);
        url.searchParams.append("tipo", tipo);
        if (estado) {
            url.searchParams.append("estado", estado?.toString());
        }
        if (pais) {
            url.searchParams.append("pais", pais.toString());
        }
        if (ncm) {
            url.searchParams.append('ncm',ncm.toString());
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

// Valor Fob
export async function buscarCrescimentoMensalVlFob(tipo:"exp"|"imp", ncm?:number | null, estado?:number|null, pais?:number|null) {
    return baseBuscaEstatVlFob(tipo, estado, pais, 'crescimento_mensal_vlfob', ncm);
}

export async function buscarVolatilidadeVlfob(tipo:"exp"|"imp", ncm?:number | null, estado?:number|null, pais?:number|null) {
    return baseBuscaEstatVlFob(tipo, estado, pais, 'volatilidade_vlfob', ncm);
}

export async function buscarRegressaoLinearVlfob(tipo:"exp"|"imp", ncm?:number | null, estado?:number|null, pais?:number|null) {
    return baseBuscaEstatVlFob(tipo, estado, pais, 'regressao_linear_vlfob', ncm);
}

// Balança comercial
export async function buscarCrescimentoMensalBalancaComercial(ncm?:number | null, estado?:number|null, pais?:number|null) {
    return baseBuscaEstatVlFob('exp', estado, pais, 'crescimento_mensal_balanca_comercial', ncm);
}

export async function buscarVolatilidadeBalancaComercial(ncm?:number | null, estado?:number|null, pais?:number|null) {
    return baseBuscaEstatVlFob('exp', estado, pais, 'volatilidade_balanca_comercial', ncm);
}

export async function buscarRegressaoLinearBalanca(ncm?:number | null, estado?:number|null, pais?:number|null) {
    return baseBuscaEstatVlFob('exp', estado, pais, '/regressao_linear_balanca_comercial', ncm);
}

export async function buscarAnalisesEstatisticasAuxiliaresVlfob(ncm?:number|null, estado?:number|null, pais?:number|null) {
    return baseBuscaEstatVlFob('exp', estado, pais, 'estatisticas_auxiliares_vlfob', ncm)
}