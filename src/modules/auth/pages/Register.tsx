import logo from "../../../assets/images/logo.png";
import RegisterForm from "../components/RegisterForm";

interface RegisterProps {
  onBack: () => void;
}

export default function Register({ onBack }: RegisterProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 pt-10 pb-6">

      <img
        src={logo}
        alt="Ha'Way logo"
        className="w-52 mb-6"
      />

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Registrarse
      </h1>

      <RegisterForm />

      <button
        className="mt-4 text-sm text-gray-500 self-start"
        onClick={onBack}
      >
        &lt; Volver
      </button>

    </div>
  );
}