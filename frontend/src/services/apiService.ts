const BASE_URL = 'http://localhost:8080';

export interface Entregador {
  id: number;
  nome: string;
  telefone: string;
}

export interface Pedido {
  id: number;
  cliente: string;
  enderecoEntrega: string;
  status?: string;
}

export interface Entrega {
  id: number;
  status: string;
  // Dependendo do retorno da API, os detalhes vêm aninhados.
  // Assumimos um retorno genérico utilizável
  pedidoId?: number;
  entregadorId?: number;
  [key: string]: any;
}

export const apiService = {
  // Motoboys (Entregadores)
  async getEntregadores(): Promise<Entregador[]> {
    const res = await fetch(`${BASE_URL}/entregadores`);
    if (!res.ok) throw new Error('Erro ao buscar entregadores');
    return res.json();
  },
  async createEntregador(data: { nome: string; telefone: string }): Promise<Entregador> {
    const res = await fetch(`${BASE_URL}/entregadores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao cadastrar motoboy');
    return res.json();
  },

  // Pedidos
  async getPedidos(): Promise<Pedido[]> {
    const res = await fetch(`${BASE_URL}/pedidos`);
    if (!res.ok) throw new Error('Erro ao buscar pedidos');
    return res.json();
  },
  async createPedido(data: { cliente: string; enderecoEntrega: string }): Promise<Pedido> {
    const res = await fetch(`${BASE_URL}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao cadastrar pedido');
    return res.json();
  },

  // Entregas
  async getEntregas(): Promise<Entrega[]> {
    const res = await fetch(`${BASE_URL}/entregas`);
    if (!res.ok) throw new Error('Erro ao buscar entregas');
    return res.json();
  },
  async createEntrega(data: { pedidoId: number; entregadorId: number }): Promise<Entrega> {
    const res = await fetch(`${BASE_URL}/entregas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao criar entrega');
    return res.json();
  }
};
