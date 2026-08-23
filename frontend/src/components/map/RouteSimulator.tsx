import { useState, useEffect } from 'react';
import { Polyline, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Play, Pause, Square, RotateCcw, Search, Loader2, MapPin, Navigation } from 'lucide-react';
import { calculateDistanceKM } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { routingService, RouteInfo } from '../../services/routingService';
import { toast } from 'sonner';

const SIMULATION_SPEED = 1000; // ms per step

interface RouteSimulatorProps {
  isActive: boolean;
  onClose: () => void;
}

export function RouteSimulator({ isActive, onClose }: RouteSimulatorProps) {
  const map = useMap();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);

  const [originAddress, setOriginAddress] = useState('Avenida Capitão Casa 1391 São Bernardo SP');
  const [destAddress, setDestAddress] = useState('Rua Aguapei 371 Santa Maria Santo Andre');
  const [isSearching, setIsSearching] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  const handleSearchRoute = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!originAddress || !destAddress) {
      toast.error('Preencha os dois endereços.');
      return;
    }

    setIsSearching(true);
    try {
      toast.loading('Buscando coordenadas...', { id: 'route-search' });
      const startCoords = await routingService.geocodeAddress(originAddress);
      const endCoords = await routingService.geocodeAddress(destAddress);
      
      toast.loading('Traçando rota pelas ruas...', { id: 'route-search' });
      const info = await routingService.getRoute(startCoords, endCoords);
      
      setRouteInfo(info);
      toast.success('Rota traçada com sucesso!', { id: 'route-search' });
      
      // Reset simulation
      setIsPlaying(false);
      setCurrentIndex(0);
      setDistanceKm(0);
      
      // Fit bounds to new route
      const bounds = L.latLngBounds(info.coordinates.map(p => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });

    } catch (error: any) {
      toast.error(error.message || 'Erro ao buscar rota.', { id: 'route-search' });
    } finally {
      setIsSearching(false);
    }
  };

  // Simulation tick
  useEffect(() => {
    if (!routeInfo || !isPlaying || currentIndex >= routeInfo.coordinates.length - 1) {
      if (routeInfo && currentIndex >= routeInfo.coordinates.length - 1) setIsPlaying(false);
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        const next = prev + 1;
        const p1 = routeInfo.coordinates[prev];
        const p2 = routeInfo.coordinates[next];
        const dist = calculateDistanceKM(p1[0], p1[1], p2[0], p2[1]);
        setDistanceKm(d => d + dist);
        map.panTo(L.latLng(p2[0], p2[1]), { animate: true, duration: 1 });
        return next;
      });
    }, SIMULATION_SPEED);

    return () => clearInterval(timer);
  }, [isPlaying, currentIndex, routeInfo, map]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setDistanceKm(0);
    if (routeInfo && routeInfo.coordinates.length > 0) {
      map.panTo(L.latLng(routeInfo.coordinates[0][0], routeInfo.coordinates[0][1]));
    }
  };

  if (!isActive) return null;

  const traversedRoute = routeInfo ? routeInfo.coordinates.slice(0, currentIndex + 1) : [];
  const currentPos = routeInfo ? routeInfo.coordinates[currentIndex] : null;

  const motoIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 38px; height: 38px; border-radius: 50%;
      background: #12121a; border: 2px solid #6366f1;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      padding: 4px;
    ">
      <img src="/favicon.svg" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });

  return (
    <>
      {routeInfo && (
        <Polyline 
          positions={routeInfo.coordinates} 
          color="#334155" 
          weight={4} 
          opacity={0.5} 
        />
      )}
      
      {routeInfo && traversedRoute.length > 0 && (
        <Polyline 
          positions={traversedRoute} 
          color="#6366f1" 
          weight={5} 
          dashArray="10, 10" 
          className="animate-pulse" 
        />
      )}
      
      {currentPos && (
        <Marker position={currentPos} icon={motoIcon} />
      )}
      
      {/* HUD Control Panel over the map */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-4">
        
        {/* Formulário de Busca de Rota */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/95 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-5 shadow-2xl w-[320px]"
        >
          <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Search size={16} className="text-indigo-400" />
            Traçar Rota por Endereço
          </h3>
          
          <form onSubmit={handleSearchRoute} className="space-y-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Origem (Restaurante)</label>
              <div className="relative mt-1">
                <MapPin size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="text" 
                  value={originAddress}
                  onChange={e => setOriginAddress(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="Ex: Av. Paulista, 1000"
                />
              </div>
            </div>
            
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Destino (Cliente)</label>
              <div className="relative mt-1">
                <Navigation size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="text" 
                  value={destAddress}
                  onChange={e => setDestAddress(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="Ex: Rua Augusta, 500"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSearching}
              className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              {isSearching ? 'Buscando...' : 'Calcular Rota'}
            </button>
          </form>

          {routeInfo && (
            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-400">
              <span>Distância Total: <strong>{routeInfo.distanceKm.toFixed(1)} km</strong></span>
              <span>Tempo Estimado: <strong>{routeInfo.durationMinutes.toFixed(0)} min</strong></span>
            </div>
          )}
        </motion.div>

        {/* Simulador Controls */}
        <AnimatePresence>
          {routeInfo && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-5 shadow-2xl flex flex-col items-center gap-4 min-w-[220px]"
            >
              <div className="text-center w-full">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rodado até agora</h3>
                <div className="text-4xl font-black text-indigo-400 tabular-nums tracking-tight font-mono">
                  {distanceKm.toFixed(2)} <span className="text-sm font-bold text-indigo-500/50">KM</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full justify-center border-t border-slate-700/50 pt-4">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 bg-gradient-to-tr from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/30"
                  title={isPlaying ? "Pausar" : "Iniciar Rota"}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                </button>
                
                <button 
                  onClick={handleReset}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
                  title="Reiniciar"
                >
                  <RotateCcw size={20} />
                </button>

                <button 
                  onClick={() => { handleReset(); onClose(); setRouteInfo(null); }}
                  className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all ml-auto"
                  title="Sair da Simulação"
                >
                  <Square size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
