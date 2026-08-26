export interface RouteInfo {
  coordinates: [number, number][]; // [lat, lng] for Leaflet
  distanceKm: number;
  durationMinutes: number;
}

export const routingService = {
  /**
   * Converte um endereço em texto para coordenadas GPS usando o Nominatim (OpenStreetMap).
   */
  async geocodeAddress(address: string): Promise<[number, number]> {
    // Adicionamos "Brasil" para focar a busca e melhorar a precisão se não for especificado
    const query = address.toLowerCase().includes('brasil') ? address : `${address}, Brasil`;
    
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        // Nominatim exige um User-Agent para uso da API pública
        'User-Agent': 'MotoTrack-Delivery-App/1.0'
      }
    });

    if (!response.ok) {
      throw new Error('Falha ao comunicar com serviço de geocodificação.');
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      throw new Error(`Endereço não encontrado: ${address}`);
    }

    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    
    return [lat, lon];
  },

  /**
   * Busca a rota de condução (carro/moto) entre dois pontos usando a API pública do OSRM.
   */
  async getRoute(start: [number, number], end: [number, number]): Promise<RouteInfo> {
    // OSRM espera longitude,latitude na URL
    const coordinates = `${start[1]},${start[0]};${end[1]},${end[0]}`;
    const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Falha ao calcular a rota no OSRM.');
    }

    const data = await response.json();
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('Não foi possível traçar uma rota entre esses pontos.');
    }

    const route = data.routes[0];
    
    // OSRM retorna GeoJSON line string, onde cada ponto é [longitude, latitude].
    // Leaflet precisa de [latitude, longitude].
    const rawCoords = route.geometry.coordinates;
    const mappedCoords: [number, number][] = rawCoords.map((coord: number[]) => [coord[1], coord[0]]);

    return {
      coordinates: mappedCoords,
      distanceKm: route.distance / 1000, // OSRM retorna em metros
      durationMinutes: route.duration / 60 // OSRM retorna em segundos
    };
  }
};
