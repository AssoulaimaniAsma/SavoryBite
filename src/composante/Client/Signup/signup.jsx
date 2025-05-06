import { useState, useEffect } from "react";
import { Link ,useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./signup.css";

function Signup() {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const validateForm = () => {
    let newErrors = {};

    if (!/^[A-Za-z\s]+$/.test(formData.username)) {
      newErrors.username= "The full name should not contain numbers.";
    }

    if (!/^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail|outlook|live|protonmail|icloud|aol|zoho|mail|yandex|gmx|fastmail)\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)) {
      newErrors.password = "Invalid password. Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!isTermsAccepted) {
      newErrors.terms = "You must accept the Terms of Service and Privacy Policy.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setIsTermsAccepted(false);
    setErrors({});
  };
  const handleSignup = async () => {
    if (validateForm()) {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
  
      console.log("Sending data:", userData); // Vérification avant l'envoi
    
      try {
        const response = await fetch("http://localhost:8080/auth/user/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      
        if (response.ok) {
          setSuccessMessage("Account created successfully!");
          setShowSuccessAlert(true);
          setTimeout(() => navigate("/client/signin"), 3000);
        } else {
          // Essayer de lire le message d'erreur si backend envoie du JSON
          let errorMessage = "Signup failed";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (err) {
            console.warn("Pas de JSON dans la réponse d'erreur");
          }
      
          setErrorMessage(errorMessage);
          setShowErrorAlert(true);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setErrors({ api: "Server error, please try again later." });
        setShowErrorAlert(true);
      }
    }
  };
  
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="text-primary flex justify-center items-center min-h-screen bg-white px-5">
      {/* Overlay flou */}
      {showSuccessAlert && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
          onClick={() => setShowSuccessAlert(false)} // Masquer l'overlay et l'alerte au clic
        >
          {/* Alerte de succès */}
          <div
            className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-100"
            onClick={(e) => e.stopPropagation()} // Empêcher la fermeture au clic sur l'alerte
          >
            <div className="flex items-center">
              <svg className="shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
              </svg>
              <span className="sr-only">Info</span>
              <h3 className="text-lg font-medium">This is a success alert</h3>
            </div>
            <div className="mt-2 mb-4 text-sm">
            Verification email has been sent to your email address!
            </div>
            <div className="flex justify-center"> {/* Centrer le bouton */}
              <button
                type="button"
                className="text-green-800 bg-transparent border border-green-900 hover:bg-green-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-10 py-2 text-center dark:hover:bg-green-600 dark:border-green-600 dark:text-green-400 dark:hover:text-white dark:focus:ring-green-800"
                onClick={() => {
                  setShowSuccessAlert(false); // Masquer l'alerte
                  navigate("/client/signin"); // Rediriger vers la page de connexion
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Alerte d'erreur */}
{showErrorAlert && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
    onClick={() => setShowErrorAlert(false)}
  >
    <div
      className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-100"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center">
        <svg className="shrink-0 w-4 h-4 me-2 text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <span className="sr-only w-">Error</span>
        <h3 className="text-lg font-medium text-red-500">Error</h3>
      </div>
      <div className="mt-2 mb-4 text-sm">
        {errorMessage}
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          className="text-red-800 bg-transparent border border-red-900 hover:bg-red-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-10 py-2 text-center"
          onClick={() => {setShowErrorAlert(false);
            resetForm();
          }}
        >
          Ok
        </button>
      </div>
    </div>
  </div>
)}
      {/* Formulaire */}
      <motion.div
  className="max-w-4xl w-full bg-white flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden"
  initial={{ opacity: 0, x: -100 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 100 }}
  transition={{ duration: 0.5 }}
>
  {/* Image à gauche */}
  <motion.div
    className="md:w-1/2 w-full"
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    <img
      src={require("../../../image/client.jpg")}
      alt="Food"
      className="w-full h-full object-cover"
    />
  </motion.div>

  {/* Formulaire à droite */}
  <motion.div
    className="md:w-1/2 w-full p-8"
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
          <h2 className="text-3xl font-bold text-black">Sign up</h2>
          <p className="text-gray-600 mt-2">
            Already have an Account?{" "}
            <Link
              to="/client/signin"
              className="text-[#FD4C2A] font-medium underline"
            >
              Login.
            </Link>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-gray-700">User Name</label>
              <input
                type="text"
                placeholder="Enter your Full name"
                value={formData.username}
                className="w-full mt-2 p-3 focus:border-2 focus:border-[#FD4C2A] rounded-full bg-gray-50 focus:outline-none"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              {errors.username&& <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email} 
                placeholder="exemple@exemple.com"
                className="w-full mt-2 p-3 focus:border-2 focus:border-[#FD4C2A] rounded-full bg-gray-50 focus:outline-none"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="relative">
              <label className="block text-gray-700">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="******"
                value={formData.password}
                className="w-full mt-2 p-3 focus:border-2 focus:border-[#FD4C2A] rounded-full bg-gray-50 focus:outline-none"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <span className="absolute top-10 right-4 text-gray-500 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div className="relative">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="******"
                value={formData.confirmPassword}
                className="w-full mt-2 p-3 focus:border-2 focus:border-[#FD4C2A] rounded-full bg-gray-50 focus:outline-none"
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              <span className="absolute top-10 right-4 text-gray-500 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="terms"
              className="mr-2"
              checked={isTermsAccepted}
              onChange={(e) => setIsTermsAccepted(e.target.checked)}
            />
            <label htmlFor="terms" className="text-gray-700 text-sm">
              I have read and agreed to the Terms of Service and Privacy Policy
            </label>
          </div>
          {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

          <button
            className="w-full mt-6 bg-[#FD4C2A] text-white py-3 rounded-full font-bold text-lg hover:bg-orange-600 transition"
            onClick={handleSignup}
          >
            Create Account
          </button>

          {successMessage && <p className="text-green-500 text-sm mt-4">{successMessage}</p>}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Signup;