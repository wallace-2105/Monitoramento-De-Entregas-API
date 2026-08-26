import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StatusEntrega, StatusEntregador, StatusPedido } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return '—';
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ptBR });
  } catch {
    return '—';
  }
}

export function formatDateTime(dateString: string | null): string {
  if (!dateString) return '—';
  try {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch {
    return '—';
  }
}

export function formatTime(date: Date): string {
  return format(date, 'HH:mm:ss');
}

export const statusEntregaConfig: Record<StatusEntrega, { label: string; color: string; bgColor: string; emoji: string }> = {
  [StatusEntrega.CRIADO]: { label: 'Criado', color: 'text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/20', emoji: '📋' },
  [StatusEntrega.AGUARDANDO_ENTREGADOR]: { label: 'Aguardando', color: 'text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/20', emoji: '⏳' },
  [StatusEntrega.EM_ROTA]: { label: 'Em Trânsito', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/20', emoji: '🏍️' },
  [StatusEntrega.ENTREGUE]: { label: 'Entregue', color: 'text-green-400', bgColor: 'bg-green-500/10 border-green-500/20', emoji: '✅' },
  [StatusEntrega.CANCELADO]: { label: 'Cancelado', color: 'text-red-400', bgColor: 'bg-red-500/10 border-red-500/20', emoji: '❌' },
  [StatusEntrega.FALHA]: { label: 'Falha', color: 'text-rose-400', bgColor: 'bg-rose-500/10 border-rose-500/20', emoji: '⚠️' },
};

export const statusEntregadorConfig: Record<StatusEntregador, { label: string; color: string; bgColor: string }> = {
  [StatusEntregador.DISPONIVEL]: { label: 'Disponível', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/20' },
  [StatusEntregador.EM_ENTREGA]: { label: 'Em Entrega', color: 'text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/20' },
  [StatusEntregador.OFFLINE]: { label: 'Offline', color: 'text-zinc-400', bgColor: 'bg-zinc-500/10 border-zinc-500/20' },
};

export const statusPedidoConfig: Record<StatusPedido, { label: string; color: string; bgColor: string }> = {
  [StatusPedido.PENDENTE]: { label: 'Pendente', color: 'text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/20' },
  [StatusPedido.EM_ROTA]: { label: 'Em Rota', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/20' },
  [StatusPedido.ENTREGUE]: { label: 'Entregue', color: 'text-green-400', bgColor: 'bg-green-500/10 border-green-500/20' },
  [StatusPedido.CANCELADO]: { label: 'Cancelado', color: 'text-red-400', bgColor: 'bg-red-500/10 border-red-500/20' },
  [StatusPedido.FALHA]: { label: 'Falha', color: 'text-rose-400', bgColor: 'bg-rose-500/10 border-rose-500/20' },
};

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Haversine formula to calculate distance in KM between two points
export function calculateDistanceKM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in KM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
