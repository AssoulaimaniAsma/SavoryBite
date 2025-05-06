import { useNavigate } from "react-router-dom";

function Setup() {
  const navigate = useNavigate();

  const fetchOnboardingLink = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch("http://localhost:8080/restaurant/getOnboardingLink", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const onboardingUrl = await response.text(); // Récupère l'URL
        console.log("Lien Stripe récupéré:", onboardingUrl);

        // Redirige vers Stripe
        window.location.href = onboardingUrl;
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
      <div className="text-green-600 text-5xl mb-4">
        <img src={require("./payment.gif")} alt="Payment Setup" className="w-48 h-48" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-green-700">Complete Your Registration</h2>
      <p className="text-gray-700 mb-4 max-w-lg">
        To complete your registration, you need to set up payments with Stripe. 
        This will allow you to receive payments from customers. 
        Click the button below to continue to Stripe and provide your business and banking details.
      </p>

      {/* Le bouton pour lancer la fonction */}
      <button
        onClick={fetchOnboardingLink}
        className="mt-6 bg-[#FD4C2A] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-md transition"
      >
        Continue with Stripe
      </button>

      <p className="text-sm text-gray-500 mt-4">
        You must complete this step to start receiving payments.
      </p>
    </div>
  );
}

export default Setup;
