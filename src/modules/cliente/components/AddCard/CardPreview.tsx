import visaLogo from "../../../../assets/images/cards/visa.svg";
import mastercardLogo from "../../../../assets/images/cards/mastercard.svg";

interface CardPreviewProps {
  cardNumber: string;
  holder: string;
  expiration: string;
}

type CardBrand = "visa" | "mastercard" | "unknown";

export default function CardPreview({
  cardNumber,
  holder,
  expiration,
}: CardPreviewProps) {

  const digits = cardNumber.replace(/\s/g, "");

  let brand: CardBrand = "unknown";

  if (digits.startsWith("4")) {

    brand = "visa";

  } else if (
    digits.startsWith("5") ||
    /^2[2-7]/.test(digits)
  ) {

    brand = "mastercard";

  }

  return (

    <div
      className="
        relative
        w-full
        max-w-sm
        mx-auto
        rounded-3xl
        p-6
        text-white
        shadow-xl
        bg-gradient-to-br
        from-[var(--primary)]
        to-[var(--secondary)]
      "
    >

      {/* Logo */}

      <div className="flex justify-end h-10">

        {brand === "visa" && (

          <img
            src={visaLogo}
            alt="Visa"
            className="h-8"
          />

        )}

        {brand === "mastercard" && (

          <img
            src={mastercardLogo}
            alt="Mastercard"
            className="h-8"
          />

        )}

      </div>

      {/* Chip */}

      <div
        className="
          w-14
          h-10
          rounded-lg
          bg-yellow-300/80
          mt-4
          mb-8
        "
      />

      {/* Número */}

      <p
        className="
          text-2xl
          tracking-[0.20em]
          font-semibold
          mb-8
        "
      >

        {cardNumber || "•••• •••• •••• ••••"}

      </p>

      <div className="flex justify-between">

        <div>

          <p className="text-xs opacity-80">

            Titular

          </p>

          <p className="font-semibold uppercase">

            {holder || "NOMBRE APELLIDO"}

          </p>

        </div>

        <div>

          <p className="text-xs opacity-80">

            Expira

          </p>

          <p className="font-semibold">

            {expiration || "MM/AA"}

          </p>

        </div>

      </div>

    </div>

  );

}