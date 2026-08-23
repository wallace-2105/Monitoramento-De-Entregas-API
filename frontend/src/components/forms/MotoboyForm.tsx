import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Loader2 } from 'lucide-react';
import { driverService } from '../../services/driverService';
import { toast } from 'sonner';

interface MotoboyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function MotoboyForm({ isOpen, onClose, onSuccess }: MotoboyFormProps) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !telefone) {
      toast.error('Preencha todos os campos.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await driverService.create({ nome, telefone });
      toast.success('Motoboy cadastrado com sucesso!');
      setNome('');
      setTelefone('');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar motoboy.');
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
              <User size={18} className="text-indigo-400" />
              Cadastrar Motoboy
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-xs uppercase font-bold text-slate-500 mb-1 block">Nome Completo</label>
              <input 
                type="text" 
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="Ex: Carlos Oliveira"
              />
            </div>
            <div>
              <label className="text-xs uppercase font-bold text-slate-500 mb-1 block">Telefone</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="text" 
                  value={telefone}
                  onChange={e => setTelefone(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
            
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
                disabled={isSubmitting}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                Cadastrar
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
