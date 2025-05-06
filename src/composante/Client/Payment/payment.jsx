import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51RHm1SFWUQXfDIlGmKVLISKhH3LpY6Sf9Pp4RC62PoaUcovgWn35VVnAQ5we4xhyd2oMfqz6xjixvonrppTmTFxW000z9mc5cG");
const baseURL = "http://localhost:8080/user/paymentMethods";
const jwt = localStorage.getItem("authToken");

const AddCardForm = ({ onCardSaved, setSuccessMessage, setShowAlert }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      if (!jwt) { 
        alert("You are not logged in. Please log in to access this page."); 
        navigate("/client/signin");
        return;
      }

      
    }, []);
  

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!stripe || !elements) return;
    
      try {
        const setupIntentRes = await fetch(`${baseURL}/setupIntent`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${jwt}`
          }
        });
    
        if (!setupIntentRes.ok) {
          throw new Error("Failed to create setup intent");
        }
    
        const { clientSecret, platformPaymentId } = await setupIntentRes.json();
        console.log("ClientSecret:", clientSecret);
        console.log("PlatFormPayment ID:", platformPaymentId);
    
        const cardElement = elements.getElement(CardElement);
        const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });
    
        if (error) {
          alert(error.message);
          return;
        }
    
        const saveRes = await fetch(`${baseURL}/savePaymentMethod`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
          },
          body: JSON.stringify({ 
            paymentMethodId: setupIntent.payment_method,
            platformPaymentId: platformPaymentId 
          })
        });
    
        if (!saveRes.ok) {
          throw new Error("Failed to save payment method");
        }
    
        setSuccessMessage("Card saved successfully!"); 
        setShowAlert(true); 
        onCardSaved();
        
      } catch (error) {
        console.error("Error in card submission:", error);
        alert("An error occurred while saving the card. Please try again.");
      }
    };
    return (
      <form  className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-6">
        <h2 className="text-xl font-semibold text-[#FD4C2A]">Add New Card</h2>
        <div className="border p-4 rounded-md">
          <CardElement />
        </div>
        <button
          type="submit"
          className="bg-[#FD4C2A] hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleSubmit}
        >
          Save Card
        </button>
      </form>
    );
  };
  

const PaymentMethods = () => {
  const [cards, setCards] = useState([]);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
const navigate = useNavigate();
  const jwt = localStorage.getItem("authToken");

  const loadCards = async () => {
    try {
      const res = await fetch(`${baseURL}/`, {
        headers: {
          "Authorization": `Bearer ${jwt}`
        }
      });

      if (!res.ok) {
        console.error('Erreur lors de la récupération des cartes');
        return;
      }

      const text = await res.text();
      if (!text) {
        console.warn('Réponse vide');
        setCards([]);
        return;
      }

      const data = JSON.parse(text);
      const formattedCards = data.map(card => ({
        id: card.id,
        number: `**** **** **** ${card.last4}`,
        name: card.name || "N/A",
        cvc: "***",
        expiry: `${card.expMonth}/${card.expYear}`,
        isDefault: card.isDefault,
        brand: card.brand,
      }));

      setCards(formattedCards);
    } catch (error) {
      console.error('Erreur de parsing JSON:', error);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

 

  const setDefaultCard = async (index) => {
    try {
      const cardId = cards[index].id;
      await fetch(`${baseURL}/${cardId}/default`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${jwt}`
        }
      });
      setSuccessMessage("Card set as default");
      setShowAlert(true);
      loadCards();
    } catch (error) {
      console.error('Erreur pour définir la carte par défaut:', error);
    }
  };

  const removeCard = async (index) => {
    try {
      const cardId = cards[index].id;
      await fetch(`${baseURL}/${cardId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${jwt}`
        }
      });
      setSuccessMessage("Card removed");
      setShowAlert(true);
      loadCards();
    } catch (error) {
      console.error('Erreur pour supprimer la carte:', error);
    }
  };

  const addNewCard = () => {
    setShowAddCardForm(true);
  };

  return (
    <div className="p-6">
      {showAlert && (
        <div className="mb-4">
          <div className="flex items-center p-4 text-sm text-black rounded-lg bg-[#f0b9ae]">
            <svg className="shrink-0 inline w-4 h-4 me-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Z" />
              <path d="M9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <div><span className="font-medium">{successMessage}</span></div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-[#FD4C2A] mb-6">Payment Methods</h2>

      {showAddCardForm && (
        <Elements stripe={stripePromise}>
          <AddCardForm onCardSaved={() => {
            setShowAddCardForm(false);
            loadCards();
          }}
          setSuccessMessage={setSuccessMessage} // <-- ajoute ça
      setShowAlert={setShowAlert}           />
        </Elements>
      )}

      <div className="space-y-4">
        {cards.map((card, index) => (
          <div key={card.id} className="border rounded-md p-4 flex items-center justify-between relative">
            <div className="flex flex-col space-y-2 w-full">
              <div className="flex items-center space-x-4">
                <div className="w-1/3">
                  <label className="block text-xs text-gray-600">Card Number</label>
                  <input
                    type="text"
                    value={card.number}
                    disabled
                    className="w-full border rounded-full px-4 py-2 bg-gray-100 text-gray-700"
                  />
                </div>


                <div className="w-1/3">
                  <label className="block text-xs text-gray-600">CVC</label>
                  <input
                    type="text"
                    value={card.cvc}
                    disabled
                    className="w-full border rounded-full px-4 py-2 bg-gray-100 text-gray-700"
                  />
                </div>

                <div className="w-1/3">
                  <label className="block text-xs text-gray-600">Expiry Date</label>
                  <input
                    type="text"
                    value={card.expiry}
                    disabled
                    className="w-full border rounded-full px-4 py-2 bg-gray-100 text-gray-700"
                  />
                </div>
              </div>
            </div>

            {card.isDefault ? (
              <span className="absolute top-2 right-14 bg-[#FD4C2A] text-white text-xs px-2 py-1 rounded-full">
                Default
              </span>
            ) : (
              <button
                onClick={() => setDefaultCard(index)}
                className="absolute top-4 right-14 text-xs text-[#FD4C2A] underline"
              >
                Set Default
              </button>
            )}

            <button
              onClick={() => removeCard(index)}
              className="text-black text-xl font-bold ml-4"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
      type="button"
      onClick={() => navigate("../client/account")}
      className="flex-1 mt-2 text-white bg-[#FD4C2A] hover:bg-[#e04324] focus:ring-4 focus:outline-none focus:ring-[#fd6e4e] font-medium rounded-lg text-sm px-3 py-2.5 text-center"
      title="Back"
    >
      
    Previous
    </button>
      <div className="mt-6 flex justify-center">
        <button
          onClick={addNewCard}
          className="bg-[#FD4C2A] text-white font-bold py-2 px-6 rounded-full hover:bg-orange-600"
        >
          Add New Card
        </button>
      </div>
    </div>
  );
};

export default PaymentMethods;
