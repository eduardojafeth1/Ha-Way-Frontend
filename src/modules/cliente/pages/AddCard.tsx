import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";

import CardNumberInput from "../components/AddCard/CardNumberInput";
import CardHolderInput from "../components/AddCard/CardHolderInput";
import ExpirationInput from "../components/AddCard/ExpirationInput";
import CVVInput from "../components/AddCard/CVVInput";
import SaveCardButton from "../components/AddCard/SaveCardButton";
import CardPreview from "../components/AddCard/CardPreview";

export default function AddCard() {

  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");

  const [holder, setHolder] = useState("");

  const [expiration, setExpiration] = useState("");

  const [cvv, setCvv] = useState("");

  const [loading, setLoading] = useState(false);

  const isValid = useMemo(() => {

    const numberValid =
      cardNumber.replace(/\s/g, "").length === 16;

    const holderValid =
      holder.trim().length >= 5;

    const expirationValid =
      expiration.length === 5;

    const cvvValid =
      cvv.length >= 3;

    return (
      numberValid &&
      holderValid &&
      expirationValid &&
      cvvValid
    );

  }, [cardNumber, holder, expiration, cvv]);

  const handleSave = async () => {

    if (!isValid) return;

    setLoading(true);

    /*
    ===================================================

    BACKEND

    await paymentService.addCard({

        number: cardNumber.replace(/\s/g, ""),

        holder,

        expiration,

        cvv,

    });

    navigate(-1);

    ===================================================
    */

    setTimeout(() => {

      setLoading(false);

      console.log({

        cardNumber,

        holder,

        expiration,

        cvv,

      });

      navigate(-1);

    }, 1200);

  };

  return (

    <div className="min-h-screen bg-gray-100">

      <PageHeader
        title="Añadir tarjeta"
        onClose={() => navigate(-1)}
      />

      <div className="px-5 py-6 pb-10">

        <CardPreview
            cardNumber={cardNumber}
            holder={holder}
            expiration={expiration}
        />

        <div className="space-y-6">

          <CardNumberInput
            value={cardNumber}
            onChange={setCardNumber}
          />

          <CardHolderInput
            value={holder}
            onChange={setHolder}
          />

          <div className="grid grid-cols-2 gap-4">

            <ExpirationInput
              value={expiration}
              onChange={setExpiration}
            />

            <CVVInput
              value={cvv}
              onChange={setCvv}
            />

          </div>

          <SaveCardButton
            disabled={!isValid}
            loading={loading}
            onClick={handleSave}
          />

        </div>

      </div>

    </div>

  );

}