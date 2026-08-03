export interface LocationData {
  address: string;
  lat: number | null;
  lng: number | null;
}

export interface SavedAddress {
  id: number;
  label: string;
  address: string;
  lat: number | null;
  lng: number | null;
  referencia?: string | null;
  principal?: boolean;
}