import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    Accept: 'application/json',
  },
});

export async function buscaUrfPorNome(nome: string) {
  try {
    const response = await api.get('/busca_urf_por_nome', {
      params: { nome },
    });

    console.log('Resposta recebida:', response.data);

    if (Array.isArray(response.data.resposta)) {
      return response.data.resposta;
    } else {
      throw new Error(response.data.error || 'Erro desconhecido no formato da resposta');
    }
  } catch (error) {
    console.error('Erro ao acessar servidor:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    alert(errorMessage);
    throw error;
  }
}