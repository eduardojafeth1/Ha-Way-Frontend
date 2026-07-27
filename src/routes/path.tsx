export const PATHS = {
  HOME: "/",

  CLIENT: {
    LOGIN: "/cliente/login",
    REGISTER: "/cliente/register",
    HOME: "/cliente/home",
    CREATEORDER:"/cliente/createorder",
    WAITING: "/cliente/waiting",
    NEARBY_PROVIDERS: "/cliente/nearby-providers",
    //WAITING: "/cliente/esperando-conductor",
    PROFILE: "/cliente/perfil",
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