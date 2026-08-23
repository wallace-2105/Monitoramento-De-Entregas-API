import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import type { ConnectionStatus, WebSocketEvent } from '../../types';

interface MainLayoutProps {
  connectionStatus: ConnectionStatus;
  messagesReceived: number;
  eventsCount: number;
  events: WebSocketEvent[];
}

const pageTitles: Record<string, { title: string; breadcrumb: string }> = {
  '/': { title: 'Dashboard', breadcrumb: 'Visão Geral' },
  '/entregas': { title: 'Entregas', breadcrumb: 'Gerenciamento' },
  '/monitoramento': { title: 'Monitoramento', breadcrumb: 'Tempo Real' },
  '/mapa': { title: 'Mapa', breadcrumb: 'Rastreamento' },
  '/historico': { title: 'Histórico', breadcrumb: 'Eventos' },
  '/configuracoes': { title: 'Configurações', breadcrumb: 'Sistema' },
};

export function MainLayout({ connectionStatus, messagesReceived, eventsCount, events }: MainLayoutProps) {
  const location = useLocation();
  const basePath = '/' + (location.pathname.split('/')[1] || '');
  const pageInfo = pageTitles[basePath] || pageTitles['/'];

  return (
    <div className="flex min-h-screen">
      <Sidebar connectionStatus={connectionStatus} messagesReceived={messagesReceived} />

      {/* Main content area — shifts based on sidebar */}
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen transition-all duration-200">
        <Topbar
          title={pageInfo.title}
          breadcrumb={pageInfo.breadcrumb}
          connectionStatus={connectionStatus}
          eventsCount={eventsCount}
          events={events}
        />

        <main className="flex-1 p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
