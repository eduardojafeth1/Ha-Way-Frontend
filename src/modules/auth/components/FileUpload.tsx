import { FaPlus } from "react-icons/fa";

interface FileUploadProps {
  label: string;
  file: File | null;
  accept?: string;
  onFileChange: (file: File | null) => void;
}

export default function FileUpload({
  label,
  file,
  accept = "image/*,.pdf",
  onFileChange,
}: FileUploadProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>

      <label className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col justify-center items-center cursor-pointer transition hover:border-[var(--secondary)] hover:bg-gray-50">

        {file ? (
          <>
            <p className="text-sm font-medium text-gray-700">
              {file.name}
            </p>

            <p className="text-xs text-green-600 mt-1">
              Archivo seleccionado
            </p>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center mb-2">
              <FaPlus className="text-white" />
            </div>

            <p className="text-xs text-gray-500">
              Seleccionar archivo
            </p>
          </>
        )}

        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) =>
            onFileChange(
              e.target.files ? e.target.files[0] : null
            )
          }
        />
      </label>
    </div>
  );
}