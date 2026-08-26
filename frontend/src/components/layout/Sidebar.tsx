import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Radio, Map, Clock, Settings,
  ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import type { ConnectionStatus } from '../../types';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  connectionStatus: ConnectionStatus;
  messagesReceived: number;
}

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/entregas', icon: Package, label: 'Entregas' },
  { path: '/monitoramento', icon: Radio, label: 'Monitoramento' },
  { path: '/mapa', icon: Map, label: 'Mapa' },
  { path: '/historico', icon: Clock, label: 'Histórico' },
  { path: '/configuracoes', icon: Settings, label: 'Configurações' },
];

export function Sidebar({ connectionStatus, messagesReceived }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();

  const isConnected = connectionStatus === 'CONNECTED';

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col border-r"
      style={{
        background: 'var(--color-surface-1)',
        borderColor: 'var(--color-border-subtle)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <img src="/favicon.svg" alt="MotoTrack Logo" className="w-full h-full object-contain" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-lg whitespace-nowrap overflow-hidden"
            >
              MotoTrack
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              )
            }
            style={({ isActive }) =>
              isActive
                ? { background: 'var(--color-accent-glow)', color: 'var(--color-accent-hover)' }
                : undefined
            }
          >
            <item.icon size={20} className="flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Footer — Connection Status */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <div className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg',
          collapsed ? 'justify-center' : '',
        )} style={{ background: 'var(--color-surface-2)' }}>
          <div className={cn(
            'pulse-dot flex-shrink-0',
            isConnected ? 'pulse-dot-success' : 'pulse-dot-danger'
          )} />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <p className="text-xs font-medium text-slate-300 whitespace-nowrap">
                  {isConnected ? 'Conectado' : connectionStatus === 'CONNECTING' ? 'Conectando...' : 'Desconectado'}
                </p>
                {isConnected && (
                  <p className="text-[10px] text-slate-500 whitespace-nowrap">
                    {messagesReceived} msg recebidas
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User / Logout */}
        <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden text-left flex-1"
                >
                  Sair
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(prev => !prev)}
          className="w-full mt-2 flex items-center justify-center py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </motion.aside>
  );
}
