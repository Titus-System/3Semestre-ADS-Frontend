export async function buscaVlFobSh4(
    sh4: number[],
    anos?: number[],
    estados?: number[],
) {
    try {
        const baseUrl = "http://localhost:5000";

        const url = new URL(`${baseUrl}/busca_vlfob_sh4`);

        const appendListParams = (paramName: string, values?: number[]) => {
            values?.forEach(value => url.searchParams.append(paramName, value.toString()));
        };
        appendListParams('sh4', sh4);
        appendListParams('anos', anos);
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
            return data.resposta
        } else {
            throw new Error(data.error || "Erro desconhecido")
        }

    } catch (error) {
        console.error("Erro ao acessar servidor:", error);
        // alert(error instanceof Error ? error.message : 'Erro desconhecido');
        // throw error;
    }
}

export async function buscaVlFobSetores(
    anos?: number[],
    estados?: number[],
    paises?: number[]
) {
    try {
        const baseUrl = "http://localhost:5000";

        const url = new URL(`${baseUrl}/busca_vlfob_setores`);

        const appendListParams = (paramName: string, values?: number[]) => {
            values?.forEach(value => url.searchParams.append(paramName, value.toString()));
        };
        appendListParams('anos', anos);
        appendListParams('estados', estados);
        appendListParams('paises', paises);

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        const data = await response.json();

        if (response.status == 200) {
            console.log(data.resposta);
            return data.resposta
        } else {
            throw new Error(data.error || "Erro desconhecido")
        }
    } catch (error) {
        console.error("Erro ao acessar servidor:", error);
        // alert(error instanceof Error ? error.message : 'Erro desconhecido');
        // throw error;
    }
}


export async function buscaSh4Info(sh4: string) {
    try {
        const baseUrl = "http://localhost:5000";

        const url = new URL(`${baseUrl}/busca_sh4_info`);
        url.searchParams.append('sh4', sh4);
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        const data = await response.json();

        if (response.status == 200) {
            console.log(data.resposta);
            return data.resposta
        } else {
            throw new Error(data.error || "Erro desconhecido")
        }
    } catch (error) {
        console.error("Erro ao acessar servidor:", error);
        // alert(error instanceof Error ? error.message : 'Erro desconhecido');
        // throw error;
    }
}

export async function buscaSh4PorNome(nome: string) {
    try {
        const baseUrl = "http://localhost:5000";

        const url = new URL(`${baseUrl}/busca_sh4_por_nome`);
        url.searchParams.append('nome', nome);
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        const data = await response.json();

        if (response.status == 200) {
            console.log(data.resposta);
            return data.resposta
        } else {
            throw new Error(data.error || "Erro desconhecido")
        }
    } catch (error) {
        console.error("Erro ao acessar servidor:", error);
        // alert(error instanceof Error ? error.message : 'Erro desconhecido');
        // throw error;
    }
}


export async function buscaRankingSh4(
    tipo: "exp" | "imp",
    qtd: number,
    anos?: number[],
    estados?: number[],
    paises?: number[],
    crit?: "valor_fob" | "kg_liquido" | "valor_agregado" | "registros",
    cresc: 0 | 1 = 0
) {
    try {
        const base_url = "http://localhost:5000";
        const url = new URL(`http://localhost:5000/busca_ranking_sh4`);
        url.searchParams.append('tipo', tipo);
        url.searchParams.append('qtd', qtd.toString());

        if (crit) {
            url.searchParams.append('crit', crit);
        }

        url.searchParams.append('cresc', cresc.toString())

        const appendListParams = (paramName: string, values?: number[]) => {
            values?.forEach(value => url.searchParams.append(paramName, value.toString()));
        };
        appendListParams('paises', paises);
        appendListParams('estados', estados);
        appendListParams('anos', anos);

        console.log(url.toString())
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        const data = await response.json();

        if (response.status == 200) {
            console.log(data.resposta);
            return data.resposta
        } else {
            throw new Error(data.error || "Erro desconhecido")
        }

    } catch (error) {
        console.error("Erro ao acessar servidor:", error);
        // alert(error instanceof Error ? error.message : 'Erro desconhecido');
        // throw error;
    }
}


export async function buscaHistSh4(
    tipo: "exp" | "imp",
    sh4: string[],
    estados?: number[],
    paises?: number[],
    anos?:number[]
) {
    try {
        const base_url = "http://localhost:5000";
        const url = new URL(`http://localhost:5000/busca_sh4_hist`);
        url.searchParams.append('tipo', tipo);

        const appendListParams = (paramName: string, values?: number[]|string[]) => {
            values?.forEach(value => url.searchParams.append(paramName, value.toString()));
        };
        appendListParams('paises', paises);
        appendListParams('estados', estados);
        appendListParams('sh4', sh4);
        appendListParams('anos', anos);

        console.log(url.toString())
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        const data = await response.json();

        if (response.status == 200) {
            console.log(data.resposta);
            return data.resposta
        } else {
            throw new Error(data.error || "Erro desconhecido")
        }

    } catch (error) {
        console.error("Erro ao acessar servidor:", error);
        // alert(error instanceof Error ? error.message : 'Erro desconhecido');
        // throw error;
    }
}