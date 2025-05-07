import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext"; // adapte le chemin selon ta structure
import { FaExchangeAlt } from "react-icons/fa";

function Signin() {
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [reverseLayout, setReverseLayout] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    // Réinitialise les erreurs
    setEmailError("");
    setPasswordError("");
    setGeneralError("");
  
    try {
      const response = await fetch("http://localhost:8080/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Donnees recues",data);
        console.log("Token reçu:", data.jwt);
        localStorage.setItem("authToken", data.jwt);
        localStorage.setItem("role","admin");
        navigate("/admin");
      } else {
        const errorData = await response.json();
        console.error("Erreur de connexion:", errorData);
  
        // Affiche les messages d'erreur sous les bons inputs
        if (errorData.message === "User not found") {
          setEmailError("User not found. Please check your email.");
        } else if (errorData.message === "Incorrect password") {
          setPasswordError("Incorrect password.");
        } else {
          setGeneralError(errorData.message || "Login failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la requête de connexion:", error);
      setGeneralError("Something went wrong. Please check your internet connection.");
    }
  };

  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <div className="spinner">
            <img src={require("../../../image/Pizza.gif")} alt="Loading..." />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen bg-white px-4">
          <div
            className={`max-w-4xl w-full bg-white grid grid-cols-1 md:grid-cols-2 shadow-lg rounded-lg overflow-hidden transition-transform duration-500 ${
              reverseLayout ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Formulaire */}
            <div className="p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-black">Login</h2>

              {/* Champ Email ou Téléphone */}
              <div className="mt-6">
                <label className="block text-gray-700">
                  Enter Your Email Or Phone
                </label>
                <input
                  type="text" // Changed to 'text' to accept both email and phone
                  placeholder="exemple@exemple.com ou votre numéro"
                  className="w-full mt-2 p-3 focus:border-2 focus:border-[#FD4C2A] rounded-md bg-gray-50 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Mot de passe */}
              <div className="mt-4 relative">
                <label className="block text-gray-700">Enter Your Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="******"
                  className="w-full mt-2 p-3 focus:border-2 focus:border-[#FD4C2A] rounded-md bg-gray-50 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute top-10 right-4 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {passwordError && (
                <p className="text-red-500 mt-4">{passwordError}</p>
              )}

              {/* Bouton Login */}
              <button
                onClick={handleLogin}
                className="w-full mt-6 bg-[#FD4C2A] text-white py-3 rounded-md font-bold text-lg hover:bg-orange-600 transition"
              >
                Login
              </button>
              {generalError && <p className="error-message text-[#FF0000]">{generalError}</p>}
            </div>

            {/* L'image */}
            <div className=" pl-10 hidden md:block h-full">
              <img
                id="image"
                src={require("./Admin.png")}
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-4 left-4 z-50">
      <Link to="/restaurant/SigninRestaurant" className="text-[#FD4C2A] font-bold  flex items-center gap-2 ...">
            <FaExchangeAlt />
              Switch User
        </Link>
      </div>
      
          
    </div>
  );
}

export default Signin;