//import { FaPlus } from "react-icons/fa";
import FileUpload from "../FileUpload";

interface TruckData {
  plate: string;
  model: string;
  capacity: string;
  color: string;
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
          value={formData.plate}
          onChange={(e) =>
            handleChange("plate", e.target.value)
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--secondary)]"
        />
      </div>

      {/* Año y modelo */}

      <div>
        <label className="block text-sm font-medium mb-2">
          Año y modelo
        </label>

        <input
          type="text"
          value={formData.model}
          onChange={(e) =>
            handleChange("model", e.target.value)
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--secondary)]"
        />
      </div>

      {/* Capacidad */}

      <div>
        <label className="block text-sm font-medium mb-2">
          Capacidad
        </label>

        <input
          type="text"
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
          value={formData.color}
          onChange={(e) =>
            handleChange("color", e.target.value)
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
        label="Foto del camión"
        file={formData.truckPhoto}
        accept="image/*"
        onFileChange={(file) =>
          handleFileChange("truckPhoto", file)
        }
      />

    </div>
  );
}

