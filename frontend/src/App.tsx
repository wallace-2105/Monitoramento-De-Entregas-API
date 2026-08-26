import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { useWebSocket } from './hooks/useWebSocket';
import { DashboardPage } from './pages/Dashboard';
import { DeliveriesPage } from './pages/Deliveries';
import { DeliveryDetailPage } from './pages/DeliveryDetail';
import { MonitoringPage } from './pages/Monitoring';
import { MapPage } from './pages/Map';
import { HistoryPage } from './pages/History';
import { SettingsPage } from './pages/Settings';
import { LoginPage } from './pages/LoginPage';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Toaster } from 'sonner';

export default function App() {
  const ws = useWebSocket();

  return (
    <>
      <Toaster theme="dark" position="top-right" />
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <MainLayout
                  connectionStatus={ws.status}
                  messagesReceived={ws.messagesReceived}
                  eventsCount={ws.events.length}
                  events={ws.events}
                />
              }
            >
          <Route index element={<DashboardPage events={ws.events} />} />
          <Route path="entregas" element={<DeliveriesPage />} />
          <Route
            path="entregas/:id"
            element={
              <DeliveryDetailPage
                connectionStatus={ws.status}
                onSubscribe={ws.subscribe}
                subscribedEntregaId={ws.subscribedEntregaId}
              />
            }
          />
          <Route
            path="monitoramento"
            element={
              <MonitoringPage
                connectionStatus={ws.status}
                events={ws.events}
                messagesReceived={ws.messagesReceived}
                reconnections={ws.reconnections}
                onConnect={ws.connect}
                onDisconnect={ws.disconnect}
                onSubscribe={ws.subscribe}
                onUnsubscribe={ws.unsubscribe}
                onSendLocation={(id, lat, lng) => ws.sendLocation(id, { latitude: lat, longitude: lng })}
                onClearEvents={ws.clearEvents}
                subscribedEntregaId={ws.subscribedEntregaId}
              />
            }
          />
          <Route path="mapa" element={<MapPage />} />
          <Route path="historico" element={<HistoryPage />} />
          <Route path="configuracoes" element={<SettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </>
  );
}
