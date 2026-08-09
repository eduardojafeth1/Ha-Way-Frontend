// Constantes de capacidad para el pedido de agua.
//
// Fuente única de verdad: todas las cantidades disponibles y valores
// sugeridos por unidad de medida se derivan de acá, para que sean
// coherentes entre sí (Barriles, Galones, Cisterna).
//
// Referencias usadas:
// - Un barril/tambo estándar de agua equivale a 55 galones (medida
//   industrial habitual de un tambo/drum de 55 gal).
// - Un camión cisterna ("pipa") de reparto residencial de agua
//   transporta típicamente entre 2,000 y 5,000 galones. Usamos 5,000
//   galones como capacidad de referencia de un camión.

export const GALONES_POR_BARRIL = 55;

// Capacidad de un solo camión cisterna, en galones.
export const GALONES_POR_CISTERNA = 5000;

// Capacidad de un solo camión cisterna, expresada en barriles.
export const BARRILES_POR_CISTERNA = Math.floor(
  GALONES_POR_CISTERNA / GALONES_POR_BARRIL
); // ≈ 90 barriles

// Máximo de camiones cisterna que se pueden solicitar en un mismo pedido.
// (A diferencia de Barriles/Galones, "Cisterna" no es una fracción de la
// carga de un camión sino la cantidad de camiones completos solicitados).
export const MAX_CISTERNAS_POR_PEDIDO = 5;

export type UnidadMedida = "BARRILES" | "CISTERNA" | "GALONES";

interface UnidadConfig {
  /** Cantidad máxima disponible para esta unidad en un pedido. */
  available: number;
  /** Cantidad sugerida por defecto al seleccionar esta unidad. */
  defaultQuantity: number;
  /** Valores rápidos de selección, proporcionales a la unidad. */
  quickValues: [number, number, number];
  /** Nombre en singular, para mensajes de error. */
  singularLabel: string;
  /** Nombre en plural, para mostrar disponibilidad y totales. */
  pluralLabel: string;
}

export const UNIDAD_CONFIG: Record<UnidadMedida, UnidadConfig> = {
  BARRILES: {
    available: BARRILES_POR_CISTERNA, // ≈ 90, la carga de un camión en barriles
    defaultQuantity: 20,
    quickValues: [20, 30, 50],
    singularLabel: "barril",
    pluralLabel: "barriles",
  },
  GALONES: {
    available: GALONES_POR_CISTERNA, // 5000, la carga de un camión en galones
    defaultQuantity: 500,
    quickValues: [500, 1000, 2000],
    singularLabel: "galón",
    pluralLabel: "galones",
  },
  CISTERNA: {
    available: MAX_CISTERNAS_POR_PEDIDO, // 5 camiones completos
    defaultQuantity: 1,
    quickValues: [1, 2, 3],
    singularLabel: "cisterna",
    pluralLabel: "cisternas",
  },
};
