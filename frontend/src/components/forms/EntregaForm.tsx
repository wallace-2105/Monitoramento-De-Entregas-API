import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Loader2 } from 'lucide-react';
import { apiService } from '../../services/apiService';
import type { Entregador, Pedido } from '../../services/apiService';
import { toast } from 'sonner';

interface EntregaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EntregaForm({ isOpen, onClose, onSuccess }: EntregaFormProps) {
  const [entregadores, setEntregadores] = useState<Entregador[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  
  const [selectedEntregador, setSelectedEntregador] = useState<string>('');
  const [selectedPedido, setSelectedPedido] = useState<string>('');
  
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [ents, peds] = await Promise.all([
        apiService.getEntregadores(),
        apiService.getPedidos()
      ]);
      setEntregadores(ents);
      setPedidos(peds);
    } catch (error) {
      toast.error('Erro ao carregar dados do sistema.');
    } finally {
      setIsLoadingData(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntregador || !selectedPedido) {
      toast.error('Selecione um motoboy e um pedido.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await apiService.createEntrega({ 
        pedidoId: Number(selectedPedido), 
        entregadorId: Number(selectedEntregador) 
      });
      toast.success('Entrega vinculada com sucesso!');
      setSelectedEntregador('');
      setSelectedPedido('');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar entrega.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex justify-between items-center p-5 border-b border-slate-800">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Package size={18} className="text-indigo-400" />
              Nova Entrega
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {isLoadingData ? (
              <div className="flex justify-center items-center py-6">
                <Loader2 size={24} className="animate-spin text-indigo-500" />
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs uppercase font-bold text-slate-500 mb-1 block">Motoboy</label>
                  <select 
                    value={selectedEntregador}
                    onChange={e => setSelectedEntregador(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 appearance-none"
                  >
                    <option value="" disabled>Selecione um motoboy...</option>
                    {entregadores.map(ent => (
                      <option key={ent.id} value={ent.id}>{ent.nome} - {ent.telefone}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-slate-500 mb-1 block">Pedido</label>
                  <select 
                    value={selectedPedido}
                    onChange={e => setSelectedPedido(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 appearance-none"
                  >
                    <option value="" disabled>Selecione um pedido...</option>
                    {pedidos.map(ped => (
                      <option key={ped.id} value={ped.id}>Pedido #{ped.id} - {ped.cliente}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            
            <div className="pt-4 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting || isLoadingData}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                Criar Entrega
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
