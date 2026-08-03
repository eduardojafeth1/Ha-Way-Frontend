export const PATHS = {
  HOME: "/",

  CLIENT: {
    LOGIN: "/cliente/login",
    REGISTER: "/cliente/register",
    HOME: "/cliente/home",
    CREATEORDER:"/cliente/createorder",
    WAITING: (id: number | string) => `/cliente/esperando-conductor/${id}`,
    WAITING_CONFIG: "/cliente/esperando-conductor/:id",
    CHECKOUT: (id: number | string) => `/cliente/checkout/${id}`,
    CHECKOUT_CONFIG: "/cliente/checkout/:id",
    ORDER_DETAIL: (id: number | string) => `/cliente/pedido/${id}`,
    ORDER_DETAIL_CONFIG: "/cliente/pedido/:id",
    PROFILE: "/cliente/perfil",
    HISTORY: "/cliente/historial",
    NOTIFICATIONS: "/cliente/notificaciones",
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