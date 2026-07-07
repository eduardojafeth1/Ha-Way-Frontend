//import { FaPlus } from "react-icons/fa";
import FileUpload from "../FileUpload";

interface DocumentsData {
  reason: string;
  cv: File | null;
  license: File | null;
  profilePhoto: File | null;
}

interface StepDocumentsProps {
  formData: DocumentsData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function StepDocuments({
  formData,
  setFormData,
}: StepDocumentsProps) {

  const handleFileChange = (
    field: keyof DocumentsData,
    file: File | null
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: file,
    }));
  };

  return (
    <div className="w-full flex flex-col gap-5">

      {/* Motivo */}
      <div>

        <label className="block text-sm font-medium mb-2">
          Motivo de solicitud
        </label>

        <textarea
          rows={5}
          value={formData.reason}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              reason: e.target.value,
            }))
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-[var(--secondary)]"
        />

      </div>

      <FileUpload
        label="CV (Documento PDF o imagen)"
        file={formData.cv}
        accept=".pdf,image/*"
        onFileChange={(file) => handleFileChange("cv", file)}
      />

      <FileUpload
        label="Licencia de conducir (Documento PDF o imagen)"
        file={formData.license}
        accept=".pdf,image/*"
        onFileChange={(file) => handleFileChange("license", file)}
      />

      <FileUpload
        label="Foto de perfil"
        file={formData.profilePhoto}
        accept="image/*"
        onFileChange={(file) => handleFileChange("profilePhoto", file)}
      />

    </div>
  );
}

