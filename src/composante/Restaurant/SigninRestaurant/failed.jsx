import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Failed() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const sendStripeResult = async () => {
      try {
        const response = await fetch("http://localhost:8080/restaurant/stripe/results?result=false", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
           // "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Erreur lors de l'envoi du résultat au serveur");
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    };

    sendStripeResult();
  }, [token]);

  const fetchOnboardingLink = async () => {
    try {
      const response = await fetch("http://localhost:8080/restaurant/getOnboardingLink", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const onboardingUrl = await response.text(); // Lien Stripe récupéré en texte
        console.log("Lien Stripe récupéré :", onboardingUrl);

        window.location.href = onboardingUrl; // Redirige vers Stripe
      } else {
        console.error("Erreur pour récupérer l'URL d'onboarding.");
        navigate("/restaurant/SigninRestaurant");
      }
    } catch (error) {
      console.error("Erreur de requête pour onboarding:", error);
      navigate("/restaurant/SigninRestaurant");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white text-center p-4">
      <div className="text-red-600 text-5xl mb-4">
        <img src={require("./no.gif")} alt="Payment Failed" className="w-48 h-48" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-red-700">
        Payment setup failed
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Your Stripe account setup failed. Please retry to complete the onboarding process.
      </p>
      <button
        onClick={fetchOnboardingLink}
        className="mt-4 bg-[#FD4C2A] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-md transition"
      >
        Retry Onboarding
      </button>
    </div>
  );
}

export default Failed;
