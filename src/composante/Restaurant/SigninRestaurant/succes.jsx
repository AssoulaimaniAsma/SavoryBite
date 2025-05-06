import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Success() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const sendStripeResult = async () => {
      try {
        const response = await fetch("http://localhost:8080/restaurant/stripe/results?result=true", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            //"Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Erreur lors de l'envoi au serveur");
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    };

    sendStripeResult();

    const timer = setTimeout(() => {
      navigate("/restaurant");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, token]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white text-center p-4">
      <div className="text-green-600 text-5xl mb-4">
        <img src={require("./ok.gif")} alt="Payment Setup" className="w-64 h-48" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-green-700">
        Your account setup is completed successfully
      </h2>
      <p className="text-sm text-gray-500">
        You will be redirected shortly...
      </p>
    </div>
  );
}

export default Success;
