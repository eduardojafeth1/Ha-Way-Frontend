//import { FaPlus } from "react-icons/fa";
import FileUpload from "../FileUpload";

interface TruckData {
  plate: string;
  brand: string;
  model: string;
  year: string;
  capacity: string;
  color: string;
  technicalRevisionDate: string;
  inspectionPhoto: File | null;
  truckPhoto: File | null;
}

interface StepTruckProps {
  formData: TruckData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function StepTruck({
  formData,
  setFormData,
}: StepTruckProps) {

  const handleChange = (
    field: keyof TruckData,
    value: string
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (
    field: keyof TruckData,
    file: File | null
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: file,
    }));
  };

  return (
    <div className="w-full flex flex-col gap-5">

      {/* Placa */}

      <div>
        <label className="block text-sm font-medium mb-2">
          Placa
        </label>

        <input
          type="text"
          placeholder="Ej. AAB1234"
          value={formData.plate}
          onChange={(e) =>
            handleChange("plate", e.target.value)
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--secondary)]"
        />
      </div>

      {/* Marca */}

      <div>
        <label className="block text-sm font-medium mb-2">
          Marca
        </label>

        <input
          type="text"
          placeholder="Ej. Hino"
          value={formData.brand}
          onChange={(e) =>
            handleChange("brand", e.target.value)
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--secondary)]"
        />
      </div>

      {/* Modelo */}

      <div>
        <label className="block text-sm font-medium mb-2">
          Modelo
        </label>

        <input
          type="text"
          placeholder="Ej. 500 Series"
          value={formData.model}
          onChange={(e) =>
            handleChange("model", e.target.value)
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--secondary)]"
        />
      </div>

      {/* Año */}

      <div>
        <label className="block text-sm font-medium mb-2">
          Año
        </label>

        <input
          type="number"
          placeholder="Ej. 2018"
          value={formData.year}
          onChange={(e) =>
            handleChange("year", e.target.value)
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--secondary)]"
        />
      </div>

      {/* Capacidad */}

      <div>
        <label className="block text-sm font-medium mb-2">
          Capacidad (Galones)
        </label>

        <input
          type="number"
          placeholder="Ej. 5000"
          value={formData.capacity}
          onChange={(e) =>
            handleChange("capacity", e.target.value)
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--secondary)]"
        />
      </div>

      {/* Color */}

      <div>
        <label className="block text-sm font-medium mb-2">
          Color
        </label>

        <input
          type="text"
          placeholder="Ej. Blanco"
          value={formData.color}
          onChange={(e) =>
            handleChange("color", e.target.value)
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--secondary)]"
        />
      </div>

      {/* Fecha de revisión técnica */}

      <div>
        <label className="block text-sm font-medium mb-2">
          Fecha de revisión técnica
        </label>

        <input
          type="date"
          value={formData.technicalRevisionDate}
          onChange={(e) =>
            handleChange("technicalRevisionDate", e.target.value)
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--secondary)]"
        />
      </div>

      <FileUpload
        label="Foto de revisión del camión"
        file={formData.inspectionPhoto}
        accept="image/*"
        onFileChange={(file) =>
          handleFileChange("inspectionPhoto", file)
        }
      />

      <FileUpload
        label="Foto del camión cisterna"
        file={formData.truckPhoto}
        accept="image/*"
        onFileChange={(file) =>
          handleFileChange("truckPhoto", file)
        }
      />

    </div>
  );
}

