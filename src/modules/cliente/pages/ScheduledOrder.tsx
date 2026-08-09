import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJson, putJson } from "../../../services/api";
import { PATHS } from "../../../routes/path";

import PageHeader from "../components/PageHeader";
import { FaCalendarCheck, FaMapMarkerAlt, FaClock } from "react-icons/fa";

interface Solicitud {
  id_solicitud: number;
  cantidad: number;
  unidad_medida: "BARRILES" | "CISTERNA" | "GALONES";
  fecha_programada: string | null;
  hora_programada: string | null;
  descripcion: string | null;
  estado: string;
  direccion: string;
  referencia: string | null;
  nombre_direccion: string | null;
}

const UNIDAD_LABEL: Record<Solicitud["unidad_medida"], string> = {
  BARRILES: "barriles",
  CISTERNA: "cisternas",
  GALONES: "galones",
};

function formatFecha(fecha: string | null) {
  if (!fecha) return "";
  // fecha viene como "YYYY-MM-DD"
  // El driver "pg" devuelve las columnas DATE como fecha ISO completa
  // (ej. "2026-07-29T00:00:00.000Z"), no como texto plano "YYYY-MM-DD".
  // Tomamos solo la parte de fecha antes de la "T" para evitar
  // desfaces de zona horaria y parseos inválidos.
  const soloFecha = fecha.split("T")[0]; // "2026-07-29"
  const [year, month, day] = soloFecha.split("-").map(Number);

  if (!year || !month || !day) return "";

  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("es-HN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatHora(hora: string | null) {
  if (!hora) return "";
  // hora viene como "HH:MM:SS"
  const [h, m] = hora.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return date.toLocaleTimeString("es-HN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ScheduledOrder() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchSolicitud = async () => {
      try {
        setLoading(true);
        const data: Solicitud[] = await getJson("/cliente/solicitudes");
        const found = data.find((s) => String(s.id_solicitud) === String(id));
        if (!found) {
          setError("No se encontró la solicitud.");
        } else {
          setSolicitud(found);
        }
      } catch (err: any) {
        setError(err.message || "Error al cargar la solicitud.");
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitud();
  }, [id]);

  const handleCancel = async () => {
    if (!id || isCancelling) return;
    if (!window.confirm("¿Estás seguro de que deseas cancelar esta solicitud?")) return;

    try {
      setIsCancelling(true);
      await putJson(`/cliente/solicitudes/${id}/cancelar`, {});
      alert("Solicitud cancelada exitosamente");
      navigate(PATHS.CLIENT.HISTORY);
    } catch (err: any) {
      alert(err.message || "Error al cancelar la solicitud");
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader
        title="PEDIDO"
        onBack={() => navigate(PATHS.CLIENT.HOME)}
        onClose={() => navigate(PATHS.CLIENT.HOME)}
      />

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {solicitud && (
        <div className="flex-1 flex flex-col items-center px-5 py-8">
          {/* Icono principal */}
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
            <FaCalendarCheck className="text-[var(--primary)]" size={38} />
          </div>

          <h2 className="text-2xl font-bold text-[var(--primary)] text-center">
            Pedido programado
          </h2>
          <p className="mt-2 text-center text-gray-600 text-base max-w-xs leading-relaxed">
            Te notificaremos cuando un conductor confirme tu pedido cerca de la fecha
            y hora programada.
          </p>

          {/* Resumen del pedido */}
          <div className="w-full max-w-sm mt-8 bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <FaClock className="text-[var(--primary)] mt-1" />
              <div>
                <p className="text-sm text-gray-500">Entrega programada</p>
                <p className="font-semibold text-gray-800 capitalize">
                  {formatFecha(solicitud.fecha_programada)} · {formatHora(solicitud.hora_programada)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-gray-100 pt-4">
              <FaMapMarkerAlt className="text-[var(--primary)] mt-1" />
              <div>
                <p className="text-sm text-gray-500">Lugar de entrega</p>
                <p className="font-semibold text-gray-800">
                  {solicitud.nombre_direccion || solicitud.direccion}
                </p>
                {solicitud.referencia && (
                  <p className="text-sm text-gray-500">{solicitud.referencia}</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between text-sm">
              <span className="text-gray-500">Cantidad</span>
              <span className="font-semibold text-gray-800">
                {solicitud.cantidad} {UNIDAD_LABEL[solicitud.unidad_medida]}
              </span>
            </div>

            {solicitud.descripcion && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500 mb-1">Notas</p>
                <p className="text-sm text-gray-700">{solicitud.descripcion}</p>
              </div>
            )}
          </div>

          <div className="w-full max-w-sm mt-8">
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="w-full bg-red-50 text-red-600 border border-red-200 py-3 rounded-xl font-bold hover:bg-red-100 transition shadow-sm disabled:opacity-50"
            >
              {isCancelling ? "Cancelando..." : "Cancelar Solicitud"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
