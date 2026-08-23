import { Search, Bell, Wifi, WifiOff } from 'lucide-react';
import type { ConnectionStatus } from '../../types';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

interface TopbarProps {
  title: string;
  breadcrumb?: string;
  connectionStatus: ConnectionStatus;
  eventsCount: number;
}

export function Topbar({ title, breadcrumb, connectionStatus, eventsCount }: TopbarProps) {
  const isConnected = connectionStatus === 'CONNECTED';
  const { user } = useAuth();
  
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
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors">
          <Bell size={18} />
          {eventsCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
              style={{ background: 'var(--color-accent)' }}>
              {eventsCount > 9 ? '9+' : eventsCount}
            </span>
          )}
        </button>

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
