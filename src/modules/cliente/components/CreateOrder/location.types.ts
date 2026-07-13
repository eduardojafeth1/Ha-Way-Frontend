export interface LocationData {
  address: string;
  lat: number | null;
  lng: number | null;
}

export interface SavedAddress {
  id: number;
  label: string; // ej. "Casa", "Oficina"
  address: string;
  lat: number | null;
  lng: number | null;
}