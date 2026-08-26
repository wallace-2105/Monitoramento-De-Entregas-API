import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { deliveryService } from '../services/deliveryService';
import { locationService } from '../services/locationService';
import type { EntregaResponse, LocalizacaoResponse } from '../types';
import { StatusEntrega } from '../types';
import { statusEntregaConfig, cn } from '../lib/utils';
import { RefreshCw, PlayCircle } from 'lucide-react';
import { RouteSimulator } from '../components/map/RouteSimulator';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet icon issue
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: iconUrl,
  shadowUrl: iconShadow,
});

function createStatusIcon(status: StatusEntrega) {
  const config = statusEntregaConfig[status];
  const color = status === StatusEntrega.EM_ROTA ? '#22c55e' :
                status === StatusEntrega.ENTREGUE ? '#3b82f6' :
                status === StatusEntrega.FALHA ? '#ef4444' : '#6366f1';

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 28px; height: 28px; border-radius: 50%;
      background: ${color}; border: 3px solid rgba(255,255,255,0.9);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px;
    ">${config.emoji}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function MapBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions.map(p => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [positions, map]);
  return null;
}

interface DeliveryLocation {
  delivery: EntregaResponse;
  location: LocalizacaoResponse;
}

export function MapPage() {
  const [deliveryLocations, setDeliveryLocations] = useState<DeliveryLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const deliveries = await deliveryService.list();
      const activeDeliveries = deliveries.filter(d =>
        d.status === StatusEntrega.EM_ROTA || d.status === StatusEntrega.ENTREGUE
      );

      const results: DeliveryLocation[] = [];
      for (const delivery of activeDeliveries) {
        try {
          const locs = await locationService.listByDelivery(delivery.id);
          if (locs.length > 0) {
            results.push({ delivery, location: locs[locs.length - 1] });
          }
        } catch { /* skip */ }
      }
      setDeliveryLocations(results);
    } catch { /* empty */ } finally {
      setLoading(false);
    }
  }

  const positions = deliveryLocations
    .map(dl => {
      const lat = parseFloat(dl.location.latitude);
      const lng = parseFloat(dl.location.longitude);
      return (!isNaN(lat) && !isNaN(lng)) ? [lat, lng] as [number, number] : null;
    })
    .filter((p): p is [number, number] => p !== null);

  const defaultCenter: [number, number] = positions.length > 0 ? positions[0] : [-23.5505, -46.6333];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Mapa de Rastreamento</h2>
          <p className="text-xs text-slate-500 mt-0.5">{deliveryLocations.length} entregas com localização</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSimulating(!isSimulating)} 
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
              isSimulating ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            )}
          >
            <PlayCircle size={16} />
            Simulador
          </button>
          
          <button onClick={loadData} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-colors" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)' }}>
            <RefreshCw size={14} className={cn(loading && 'animate-spin')} />
            Atualizar
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
        <MapContainer
          center={defaultCenter}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          
          {isSimulating ? (
            <RouteSimulator 
              isActive={isSimulating} 
              onClose={() => setIsSimulating(false)} 
            />
          ) : (
            <>
              <MapBounds positions={positions} />
              {deliveryLocations.map(dl => {
                const lat = parseFloat(dl.location.latitude);
                const lng = parseFloat(dl.location.longitude);
                if (isNaN(lat) || isNaN(lng)) return null;

                return (
                  <Marker
                    key={dl.delivery.id}
                    position={[lat, lng]}
                    icon={createStatusIcon(dl.delivery.status)}
                  >
                    <Popup>
                      <div style={{ color: '#f1f5f9', minWidth: 160 }}>
                        <p style={{ fontWeight: 600, marginBottom: 4 }}>Entrega #{dl.delivery.id}</p>
                        <p style={{ fontSize: 12, color: '#94a3b8' }}>
                          Status: {statusEntregaConfig[dl.delivery.status].label}
                        </p>
                        <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                          Lat: {dl.location.latitude}<br />
                          Lng: {dl.location.longitude}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </>
          )}
        </MapContainer>
      </motion.div>
    </div>
  );
}
