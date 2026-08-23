import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Package, RefreshCw } from 'lucide-react';
import { deliveryService } from '../services/deliveryService';
import { orderService } from '../services/orderService';
import { driverService } from '../services/driverService';
import { StatusBadge } from '../components/ui/StatusBadge';
import { MotoboyForm } from '../components/forms/MotoboyForm';
import { PedidoForm } from '../components/forms/PedidoForm';
import type { EntregaResponse, PedidoResponse, EntregadorResponse } from '../types';
import { StatusEntrega } from '../types';
import { formatRelativeTime, cn } from '../lib/utils';

export function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<EntregaResponse[]>([]);
  const [orders, setOrders] = useState<PedidoResponse[]>([]);
  const [drivers, setDrivers] = useState<EntregadorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMotoboyModal, setShowMotoboyModal] = useState(false);
  const [showPedidoModal, setShowPedidoModal] = useState(false);
  const [newDelivery, setNewDelivery] = useState({ pedidoId: '', entregadorId: '' });
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    try {
      const [d, o, dr] = await Promise.all([
        deliveryService.list(),
        orderService.list(),
        driverService.list(),
      ]);
      setDeliveries(d);
      setOrders(o);
      setDrivers(dr);
    } catch { /* empty */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAction = async (id: number, action: 'start' | 'complete' | 'cancel' | 'fail') => {
    setActionLoading(id);
    try {
      const actions = {
        start: () => deliveryService.start(id),
        complete: () => deliveryService.complete(id),
        cancel: () => deliveryService.cancel(id),
        fail: () => deliveryService.fail(id),
      };
      await actions[action]();
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao executar ação');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreate = async () => {
    if (!newDelivery.pedidoId || !newDelivery.entregadorId) return;
    try {
      await deliveryService.create({
        pedidoId: Number(newDelivery.pedidoId),
        entregadorId: Number(newDelivery.entregadorId),
      });
      setShowCreateModal(false);
      setNewDelivery({ pedidoId: '', entregadorId: '' });
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao criar entrega');
    }
  };

  const filtered = deliveries.filter(d => {
    const matchSearch = search === '' || String(d.id).includes(search);
    const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getDriverName = (id: number | null) => {
    if (!id) return '—';
    return drivers.find(d => d.id === id)?.nome || `#${id}`;
  };

  const getOrderClient = (id: number) => {
    return orders.find(o => o.id === id)?.cliente || `Pedido #${id}`;
  };

  const statusFilters = ['ALL', ...Object.values(StatusEntrega)];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Gerenciamento de Entregas</h2>
          <p className="text-sm text-slate-500 mt-1">{deliveries.length} entregas registradas</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-3 sm:mt-0 justify-end">
          <button onClick={loadData} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-colors" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)' }} title="Atualizar Dados">
            <RefreshCw size={14} />
          </button>
          
          <button onClick={() => setShowMotoboyModal(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors border border-slate-700 bg-slate-800/50">
            Cadastrar Motoboy
          </button>
          
          <button onClick={() => setShowPedidoModal(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors border border-slate-700 bg-slate-800/50">
            Cadastrar Pedido
          </button>

          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors" style={{ background: 'var(--color-accent)' }}>
            <Plus size={14} />
            Nova Entrega
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)' }}>
          <Search size={14} className="text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500 w-full"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {statusFilters.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border',
                statusFilter === s
                  ? 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-300 border-transparent'
              )}
            >
              {s === 'ALL' ? 'Todos' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg animate-pulse" style={{ background: 'var(--color-surface-2)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-slate-500">
            <Package size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-medium">Nenhuma entrega encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">Cliente</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">Entregador</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">Atualização</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(delivery => (
                  <tr
                    key={delivery.id}
                    onClick={() => navigate(`/entregas/${delivery.id}`)}
                    className="border-b cursor-pointer hover:bg-white/[0.02] transition-colors"
                    style={{ borderColor: 'var(--color-border-subtle)' }}
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-mono text-slate-300">#{delivery.id}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={delivery.status} />
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-slate-400">{getOrderClient(delivery.pedidoId)}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-sm text-slate-400">{getDriverName(delivery.entregadorId)}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="text-xs text-slate-500">
                        {delivery.dataInicio ? formatRelativeTime(delivery.dataInicio) : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                        {delivery.status === StatusEntrega.CRIADO && (
                          <>
                            <button
                              onClick={() => handleAction(delivery.id, 'start')}
                              disabled={actionLoading === delivery.id}
                              className="px-2 py-1 rounded text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                            >
                              Iniciar
                            </button>
                            <button
                              onClick={() => handleAction(delivery.id, 'cancel')}
                              disabled={actionLoading === delivery.id}
                              className="px-2 py-1 rounded text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                        {delivery.status === StatusEntrega.EM_ROTA && (
                          <>
                            <button
                              onClick={() => handleAction(delivery.id, 'complete')}
                              disabled={actionLoading === delivery.id}
                              className="px-2 py-1 rounded text-xs font-medium text-green-400 hover:bg-green-500/10 transition-colors"
                            >
                              Concluir
                            </button>
                            <button
                              onClick={() => handleAction(delivery.id, 'fail')}
                              disabled={actionLoading === delivery.id}
                              className="px-2 py-1 rounded text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                              Falha
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 w-full max-w-md mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Nova Entrega</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Pedido</label>
                <select
                  value={newDelivery.pedidoId}
                  onChange={e => setNewDelivery(prev => ({ ...prev, pedidoId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm text-slate-200 outline-none"
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)' }}
                >
                  <option value="">Selecione um pedido</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>#{o.id} — {o.cliente}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Entregador</label>
                <select
                  value={newDelivery.entregadorId}
                  onChange={e => setNewDelivery(prev => ({ ...prev, entregadorId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm text-slate-200 outline-none"
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)' }}
                >
                  <option value="">Selecione um entregador</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.nome} — {d.telefone}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-colors">
                Cancelar
              </button>
              <button onClick={handleCreate} className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors" style={{ background: 'var(--color-accent)' }}>
                Criar Entrega
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Auxiliary Modals */}
      <MotoboyForm 
        isOpen={showMotoboyModal} 
        onClose={() => setShowMotoboyModal(false)} 
        onSuccess={loadData} 
      />
      <PedidoForm 
        isOpen={showPedidoModal} 
        onClose={() => setShowPedidoModal(false)} 
        onSuccess={loadData} 
      />
    </div>
  );
}
