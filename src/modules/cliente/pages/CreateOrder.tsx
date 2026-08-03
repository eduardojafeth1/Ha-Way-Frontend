import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/path";
import { PREPARATION_TIME, OPENING_HOUR, CLOSING_HOUR } from "../../../constants/schedule";

import OrderQuantitySelector from "../components/CreateOrder/OrderQuantitySelector";
import DeliveryLocationCard from "../components/CreateOrder/DeliveryLocationCard";
import DeliverySchedule from "../components/CreateOrder/DeliverySchedule";
import TimeSelector from "../components/CreateOrder/TimeSelector";
import SavedAddressesModal from "../components/CreateOrder/Savedaddressesmodal";
import MapPickerModal from "../components/CreateOrder/Mappickermodal";
import AddAddressDetailsModal from "../components/CreateOrder/AddAddressDetailsModal";
import PageHeader from "../components/PageHeader";
import type { LocationData, SavedAddress } from "../components/CreateOrder/location.types";
import { getJson, postJson } from "../../../services/api";

type DeliveryOption = "now" | "today" | "tomorrow";
type UnidadMedida = "BARRILES" | "CISTERNA" | "GALONES";

export default function CreateOrder() {
  const navigate = useNavigate();

  // Direcciones guardadas
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState<LocationData | null>(null);

  // Cargar direcciones al inicio
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await getJson("/cliente/direcciones");
        setSavedAddresses(data);
        // Si hay direcciones y no se ha seleccionado ninguna, usar la principal (la primera)
        if (data.length > 0 && !location) {
          setSelectedAddressId(data[0].id);
          setLocation({
            address: data[0].address,
            lat: data[0].lat,
            lng: data[0].lng,
          });
        }
      } catch (err) {
        console.error("Error al cargar direcciones:", err);
      }
    };
    fetchAddresses();
  }, []);

  // Estados de pedido
  const [unidadMedida, setUnidadMedida] = useState<UnidadMedida>("BARRILES");
  const [quantity, setQuantity] = useState(20);
  const [descripcion, setDescripcion] = useState("");
  const [schedule, setSchedule] = useState<DeliveryOption>("today");
  const [time, setTime] = useState<string | null>(null);

  // Estados de control
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Ajustar cantidad por defecto según unidad de medida seleccionada
  useEffect(() => {
    if (unidadMedida === "CISTERNA") {
      setQuantity(1);
    } else if (unidadMedida === "GALONES") {
      setQuantity(500);
    } else {
      setQuantity(20); // BARRILES
    }
  }, [unidadMedida]);

  // Límite disponible según unidad
  const availableQuantity = useMemo(() => {
    if (unidadMedida === "CISTERNA") return 5;
    if (unidadMedida === "GALONES") return 5000;
    return 50; // BARRILES
  }, [unidadMedida]);

  const isWithinWorkingHoursNow = useMemo(() => {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const opening = OPENING_HOUR * 60;
    const closing = CLOSING_HOUR * 60;

    return (
      nowMinutes >= opening &&
      nowMinutes + PREPARATION_TIME <= closing
    );
  }, []);

  const isValid = useMemo(() => {
    if (!location) return false;
    if (schedule === "now") {
      return isWithinWorkingHoursNow;
    }
    if (!time) return false;
    return true;
  }, [location, schedule, time, isWithinWorkingHoursNow]);

  const handleSelectSavedAddress = (item: SavedAddress) => {
    setSelectedAddressId(item.id);
    setLocation({
      address: item.address,
      lat: item.lat,
      lng: item.lng,
    });
    setIsAddressModalOpen(false);
  };

  const handleConfirmMapLocation = (newLocation: LocationData) => {
    setTempLocation(newLocation);
    setIsMapModalOpen(false);
    setIsDetailsModalOpen(true);
  };

  const handleSaveNewAddress = async (data: { nombre: string; referencia: string; lat: number; lng: number; direccion: string }) => {
    // Guardar la nueva dirección en el backend
    const res = await postJson("/cliente/direcciones", {
      nombre: data.nombre,
      direccion: data.direccion,
      latitud: data.lat,
      longitud: data.lng,
      referencia: data.referencia,
    });
    
    // Obtener la dirección devuelta por el servidor (con el ID)
    const newAddress: SavedAddress = res.direccion;

    // Actualizar la lista
    setSavedAddresses(prev => [...prev, newAddress]);
    
    // Seleccionarla automáticamente
    setSelectedAddressId(newAddress.id);
    setLocation({
      address: newAddress.address,
      lat: newAddress.lat,
      lng: newAddress.lng,
    });

    setIsDetailsModalOpen(false);
    setTempLocation(null);
  };

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    // Calcular fechas y horas programadas
    let fechaProgramada = "";
    let horaProgramada = "";

    const hoy = new Date();
    if (schedule === "now") {
      fechaProgramada = hoy.toISOString().split("T")[0];
      horaProgramada = hoy.toTimeString().split(" ")[0]; // HH:MM:SS
    } else if (schedule === "today") {
      fechaProgramada = hoy.toISOString().split("T")[0];
      horaProgramada = time ? `${time}:00` : "";
    } else if (schedule === "tomorrow") {
      const mañana = new Date();
      mañana.setDate(mañana.getDate() + 1);
      fechaProgramada = mañana.toISOString().split("T")[0];
      horaProgramada = time ? `${time}:00` : "";
    }

    const payload = {
      id_direccion: selectedAddressId,
      cantidad: quantity,
      unidad_medida: unidadMedida,
      fecha_programada: fechaProgramada,
      hora_programada: horaProgramada,
      descripcion: descripcion.trim() || null,
    };

    try {
      const res = await postJson("/cliente/solicitudes", payload);
      navigate(PATHS.CLIENT.WAITING(res.solicitud.id_solicitud));
    } catch (err: any) {
      setError(err.message || "Error al registrar la solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <PageHeader
        title="Pedido"
        onClose={() => navigate(PATHS.CLIENT.HOME)}
      />

      <div className="px-5 py-6 space-y-8">
        
        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-medium p-4 rounded-2xl border border-red-200">
            {error}
          </div>
        )}

        {/* Unidad de Medida */}
        <section>
          <h2 className="font-bold text-xl mb-4">
            Unidad de medida
          </h2>
          <div className="flex bg-white p-1 rounded-2xl border border-gray-200">
            {(["BARRILES", "CISTERNA", "GALONES"] as UnidadMedida[]).map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => setUnidadMedida(unit)}
                className={`
                  flex-1 py-3 text-sm font-semibold rounded-xl transition-all
                  ${unidadMedida === unit
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                  }
                `}
              >
                {unit === "BARRILES" ? "Barriles" : unit === "CISTERNA" ? "Cisterna" : "Galones"}
              </button>
            ))}
          </div>
        </section>

        {/* Cantidad */}
        <section>
          <h2 className="font-bold text-xl mb-4">
            Cantidad de {unidadMedida === "BARRILES" ? "barriles" : unidadMedida === "CISTERNA" ? "cisternas" : "galones"}
          </h2>
          <OrderQuantitySelector
            key={unidadMedida} // Re-renderizar al cambiar la unidad
            available={availableQuantity}
            onQuantityChange={setQuantity}
          />
        </section>

        {/* Dirección */}
        <section>
          <h2 className="font-bold text-xl mb-4">
            Lugar de entrega
          </h2>
          <DeliveryLocationCard
            address={location?.address ?? null}
            onAddressClick={() => setIsAddressModalOpen(true)}
            onMapClick={() => setIsMapModalOpen(true)}
          />
        </section>

        {/* Programación */}
        <section>
          <h2 className="font-bold text-xl mb-4">
            Programar entrega
          </h2>
          <DeliverySchedule
            onScheduleChange={(value) => {
              setSchedule(value);
            }}
          />
        </section>

        {/* Hora */}
        <section>
          <h2 className="font-bold text-xl mb-4">
            Hora de entrega
          </h2>
          <TimeSelector
            schedule={schedule}
            onTimeChange={(value) => {
              setTime(value);
            }}
          />
        </section>

        {schedule === "now" && !isWithinWorkingHoursNow && (
          <p className="text-sm text-red-500 font-medium -mt-4">
            Ya no es posible enviar tu pedido de inmediato, estamos fuera de horario.
            Selecciona "Hoy" o "Mañana" para elegir una hora.
          </p>
        )}

        {/* Notas adicionales */}
        <section>
          <h2 className="font-bold text-xl mb-4">
            Notas adicionales
          </h2>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Especificaciones de la entrega (ej. timbre, portón negro, cisterna en el patio trasero)"
            className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[var(--primary)] h-24 resize-none"
          />
        </section>

        {/* Botón */}
        <button
          disabled={!isValid || isSubmitting}
          onClick={handleSubmit}
          className={`
            w-full
            py-4
            rounded-2xl
            font-bold
            text-lg
            transition
            flex items-center justify-center gap-2
            ${
              !isValid || isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[var(--primary)] text-white hover:opacity-90 active:scale-95"
            }
          `}
        >
          {isSubmitting ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Buscando proveedores...
            </>
          ) : (
            "Buscar proveedores"
          )}
        </button>
      </div>

      {/* Modales */}
      <SavedAddressesModal
        isOpen={isAddressModalOpen}
        addresses={savedAddresses}
        selectedId={selectedAddressId}
        onSelect={handleSelectSavedAddress}
        onAddNew={() => {
          setIsAddressModalOpen(false);
          setIsMapModalOpen(true);
        }}
        onClose={() => setIsAddressModalOpen(false)}
      />

      <MapPickerModal
        isOpen={isMapModalOpen}
        initialAddress={location?.address ?? null}
        onConfirm={handleConfirmMapLocation}
        onClose={() => setIsMapModalOpen(false)}
      />

      <AddAddressDetailsModal
        isOpen={isDetailsModalOpen}
        location={tempLocation}
        onSave={handleSaveNewAddress}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
}