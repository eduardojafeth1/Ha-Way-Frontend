import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../../../services/api';

interface GlobalNotificationProps {
  token: string | null;
  role: string | null;
}

export default function GlobalNotification({ token, role }: GlobalNotificationProps) {
  const location = useLocation();

  useEffect(() => {
    if (!token || !role) return;

    let rolePath = 'cliente';
    if (role === 'CONDUCTOR') rolePath = 'conductor';

    const url = `${API_URL}/${rolePath}/notificaciones/stream?token=${token}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const notificacion = JSON.parse(event.data);
        console.log('Notificación SSE recibida:', notificacion);
        
        // Aquí mostraremos el toast/alerta.
        // Dado que puede que no haya una librería de toast, usaremos alert()
        // o si prefieres, un componente visual. Pero primero, veamos si
        // podemos despachar un CustomEvent para que las páginas se refresquen.
        window.dispatchEvent(new CustomEvent('nueva_notificacion', { detail: notificacion }));
        
        // Opcional: mostrar un simple toast en el DOM temporalmente
        showToast(notificacion.titulo, notificacion.mensaje);
        
      } catch (e) {
        console.error('Error parseando notificación SSE', e);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Error en EventSource', error);
      eventSource.close();
      // Opcional: Reconnect logic could be added here if needed,
      // though EventSource usually auto-reconnects.
    };

    return () => {
      eventSource.close();
    };
  }, [token, role, location.pathname]); // Restart if necessary

  return null;
}

// Función auxiliar simple para mostrar un toast nativo
function showToast(titulo: string, mensaje: string) {
  // Comprobar si hay permisos de notificaciones del navegador (opcional)
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(titulo, { body: mensaje });
  } else if ("Notification" in window && Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(titulo, { body: mensaje });
      }
    });
  }

  // Toast UI simple en el DOM
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.bottom = '20px';
  div.style.right = '20px';
  div.style.backgroundColor = '#3b82f6'; // Azul Tailwind
  div.style.color = 'white';
  div.style.padding = '16px';
  div.style.borderRadius = '8px';
  div.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
  div.style.zIndex = '9999';
  div.style.transition = 'opacity 0.5s ease-in-out';
  div.style.maxWidth = '300px';

  div.innerHTML = `
    <h4 style="margin: 0; font-weight: bold; font-size: 16px;">${titulo}</h4>
    <p style="margin: 4px 0 0; font-size: 14px;">${mensaje}</p>
  `;

  document.body.appendChild(div);

  setTimeout(() => {
    div.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(div);
    }, 500);
  }, 5000);
}
