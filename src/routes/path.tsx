export const PATHS = {
  HOME: "/",

  CLIENT: {
    LOGIN: "/cliente/login",
    REGISTER: "/cliente/register",
    HOME: "/cliente/home",
    CREATEORDER:"/cliente/createorder",
  },

  DRIVER: {
    LOGIN: "/conductor/login",
    REGISTER: "/conductor/register",
    HOME: "/conductor/home",
    HISTORY: "/conductor/historial",
    SEARCH: "/conductor/buscar-pedidos",
    PROFILE: "/conductor/perfil", 
    NOTIFICATIONS: "/conductor/notificaciones",
    TRACKING: (id: number | string) => `/conductor/pedido/${id}/seguimiento`,
    TRACKING_CONFIG: "/conductor/pedido/:id/seguimiento", // Para el archivo AppRoutes.tsx
  },
};