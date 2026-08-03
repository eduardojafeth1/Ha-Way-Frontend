import { HiOutlineDocumentText, HiOutlineCheck, HiOutlineXMark } from "react-icons/hi2";

interface EditProfileButtonProps {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  saving?: boolean;
}

export default function EditProfileButton({
  isEditing,
  onEdit,
  onCancel,
  onSave,
  saving = false,
}: EditProfileButtonProps) {
  if (isEditing) {
    return (
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={saving}
          className="
            flex-1
            bg-gray-200
            text-gray-700
            rounded-xl
            py-3
            flex
            items-center
            justify-center
            gap-2
            font-medium
            shadow-sm
            hover:bg-gray-300
            transition
          "
        >
          <HiOutlineXMark size={20} />
          Cancelar
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="
            flex-1
            bg-[var(--primary)]
            text-white
            rounded-xl
            py-3
            flex
            items-center
            justify-center
            gap-2
            font-medium
            shadow-sm
            hover:opacity-90
            transition
            disabled:opacity-50
          "
        >
          <HiOutlineCheck size={20} />
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onEdit}
      className="
        w-full
        bg-[var(--primary)]
        text-white
        rounded-xl
        py-3
        flex
        items-center
        justify-center
        gap-2
        font-medium
        shadow-sm
        hover:opacity-90
        transition
      "
    >
      <HiOutlineDocumentText size={20} />
      Editar datos
    </button>
  );
}


export function EditProfileButtonConductor({
  isEditing,
  onEdit,
  onCancel,
  onSave,
  saving = false,
}: EditProfileButtonProps) {
  if (isEditing) {
    return (
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={saving}
          className="
            flex-1
            bg-gray-200
            text-gray-700
            rounded-xl
            py-3
            flex
            items-center
            justify-center
            gap-2
            font-medium
            shadow-sm
            hover:bg-gray-300
            transition
          "
        >
          <HiOutlineXMark size={20} />
          Cancelar
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="
            flex-1
            bg-[var(--secondary)]
            text-white
            rounded-xl
            py-3
            flex
            items-center
            justify-center
            gap-2
            font-medium
            shadow-sm
            hover:opacity-90
            transition
            disabled:opacity-50
          "
        >
          <HiOutlineCheck size={20} />
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onEdit}
      className="
        w-full
        bg-[var(--secondary)]
        text-white
        rounded-xl
        py-3
        flex
        items-center
        justify-center
        gap-2
        font-medium
        shadow-sm
        hover:opacity-90
        transition
      "
    >
      <HiOutlineDocumentText size={20} />
      Editar datos
    </button>
  );
}