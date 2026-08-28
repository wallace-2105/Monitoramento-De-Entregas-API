import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Wifi, WifiOff } from 'lucide-react';
import type { ConnectionStatus, WebSocketEvent } from '../../types';
import { cn, formatRelativeTime } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface TopbarProps {
  title: string;
  breadcrumb?: string;
  connectionStatus: ConnectionStatus;
  eventsCount: number;
  events?: WebSocketEvent[];
}

export function Topbar({ title, breadcrumb, connectionStatus, eventsCount, events = [] }: TopbarProps) {
  const isConnected = connectionStatus === 'CONNECTED';
  const { user } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o menu se clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Função para pegar as iniciais do nome (ex: Wallace Coimbra -> WC)
  const getInitials = (name?: string) => {
    if (!name) return 'OP';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 border-b backdrop-blur-md"
      style={{
        background: 'rgba(6, 6, 11, 0.8)',
        borderColor: 'var(--color-border-subtle)',
      }}
    >
      {/* Left: Title + Breadcrumb */}
      <div>
        {breadcrumb && (
          <p className="text-xs text-slate-500 mb-0.5">{breadcrumb}</p>
        )}
        <h1 className="text-lg font-semibold text-slate-100">{title}</h1>
      </div>

      {/* Right: Search + Status + Notifications */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400"
          style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)' }}>
          <Search size={14} />
          <span className="text-xs">Buscar...</span>
          <kbd className="ml-4 px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-slate-500">⌘K</kbd>
        </div>

        {/* WebSocket indicator */}
        <div className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border',
          isConnected
            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
            : 'text-red-400 bg-red-500/10 border-red-500/20'
        )}>
          {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
          <div className={cn(
            'pulse-dot',
            isConnected ? 'pulse-dot-success' : 'pulse-dot-danger'
          )} style={{ width: 6, height: 6 }} />
          <span className="hidden sm:inline">
            {isConnected ? 'WebSocket' : 'Offline'}
          </span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={cn(
              "relative p-2 rounded-lg transition-colors",
              isNotificationsOpen ? "text-indigo-400 bg-indigo-500/10" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
            )}
          >
            <Bell size={18} />
            {eventsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                style={{ background: 'var(--color-accent)' }}>
                {eventsCount > 9 ? '9+' : eventsCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-700/60 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                  <h3 className="font-semibold text-slate-200 text-sm">Notificações</h3>
                  <span className="text-xs text-indigo-400 cursor-pointer hover:text-indigo-300">Marcar como lidas</span>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {events.length === 0 ? (
                    <div className="px-4 py-6 text-center text-slate-500 text-sm">
                      Nenhuma notificação recente.
                    </div>
                  ) : (
                    events.slice(0, 5).map(event => (
                      <div key={event.id} className="px-4 py-3 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold",
                            event.type === 'status' ? 'bg-blue-500/10 text-blue-400' :
                            event.type === 'error' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                          )}>
                            {event.type === 'status' ? '📦' : event.type === 'error' ? '⚠️' : '📍'}
                          </div>
                          <div>
                            <p className="text-sm text-slate-300 line-clamp-2">
                              {event.type === 'status' && `Entrega #${event.entregaId}: Status atualizado`}
                              {event.type === 'location' && `Entrega #${event.entregaId}: Nova localização`}
                              {event.type === 'error' && `Alerta: ${event.message || 'Erro reportado'}`}
                            </p>
                            <span className="text-[10px] text-slate-500">{formatRelativeTime(String(event.timestamp))}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {events.length > 5 && (
                  <div className="px-4 py-2 bg-slate-800/30 text-center border-t border-slate-800">
                    <a href="/historico" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Ver todo o histórico</a>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border-subtle)' }}
          title={user?.name || 'Operador'}
        >
          {getInitials(user?.name)}
        </div>
      </div>
    </header>
  );
}
