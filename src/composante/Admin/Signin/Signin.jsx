import React,{useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Signin.css";

function Signin(){
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    // Error states
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [generalError, setGeneralError] = useState("");
  
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
    
    
      

    return(
        <div className="LoginAdmin">
            <div className="InfoAdmin">
                <h1 className="h2content8">Login</h1>
                <div>
                <form onSubmit={  handleLogin}>
  <label>Email or Phone</label>
  <input
    type="email"
    name="email"
    placeholder="example@example.com or phone number"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
  {emailError && <p className="error-message">{emailError}</p>}

  <label>Password</label>
  <div className="password-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="******"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <span
    className="toggle-password"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>
{passwordError && <p className="error">{passwordError}</p>}


  <button type="submit" >Login</button>
  {generalError && <p className="error-message">{generalError}</p>}

  <Link to="/auth/ForgotPasswordForm" className="ForgotPassword">Forgot Password</Link>
</form>

                </div>
            </div>
            <div className="AdminImageWrapper">
                <img className="Adminimg" alt="" src="/image/Admin.png" />
            </div>
        </div>
    );
}
export default Signin;