export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RouteData {

  // Coordenadas que forman la ruta
  coordinates: Coordinates[];

  // Distancia en kilómetros
  distanceKm: number;

  // Duración en minutos
  durationMinutes: number;

}

export async function getRoute(
  start: Coordinates,
  end: Coordinates
): Promise<RouteData> {

  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${start.lng},${start.lat};${end.lng},${end.lat}` +
    `?overview=full&geometries=geojson`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("No se pudo obtener la ruta.");
  }

  const data = await response.json();

  const route = data.routes[0];

  return {

    coordinates: route.geometry.coordinates.map(
      ([lng, lat]: [number, number]) => ({
        lat,
        lng,
      })
    ),

    distanceKm: Number((route.distance / 1000).toFixed(1)),

    durationMinutes: Math.ceil(route.duration / 60),

  };

}