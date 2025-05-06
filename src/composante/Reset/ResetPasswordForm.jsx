import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from "../../image/favicon.png";
import { Link } from 'react-router-dom';

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isSuccess = message.toLowerCase().includes('success');

  function getRoleFromToken(token) {
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = atob(payloadBase64);
      const payload = JSON.parse(decodedPayload);
      return payload.role;
    } catch (e) {
      console.error('Erreur de décodage du token :', e);
      return null;
    }
  }

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    setMessage("Veuillez patienter...");

    const url = 'http://localhost:8080/auth/resetPassword';
    const params = new URLSearchParams({ token, newPassword: password });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });

      const text = await response.text();
      setMessage(text);

      if (response.ok && text === "Password reset successful") {
        // le useEffect ci-dessous va gérer la redirection
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de la réinitialisation.");
    } finally {
      setLoading(false);
    }
  };

  // Redirection après 3 secondes si le mot de passe a été réinitialisé avec succès
  useEffect(() => {
    if (message.toLowerCase().includes('success')) {
      const timer = setTimeout(() => {
        const role = getRoleFromToken(token);
        if (role === 'ROLE_USER') {
          navigate('/client/signin');
        } else if (role === 'ROLE_RESTAURANT') {
          navigate('/restaurant/SigninRestaurant');
        } else {
          navigate('/signin');
        }
      }, 2000);
  
      return () => clearTimeout(timer);
    }
  }, [message, navigate, token]);
  

  if (!token) return <p>Token invalide ou manquant.</p>;

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center space-x-2 font-bold mt-10 mb-10">
          <img src={logo} className="w-12 h-12" alt="Logo" />
          <Link to="/" className="text-black text-3xl">
            <span className="text-[#FD4C2A] font-extrabold">Savory</span>Bites
          </Link>
        </div>
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Set a new password
          </h1>
          <p className="font-light text-gray-500 dark:text-gray-400 mb-4">
            Please enter your new password below.
          </p>
          <form onSubmit={handleReset} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nouveau mot de passe"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#FD4C2A] focus:border-[#FD4C2A] block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#FD4C2A] dark:focus:border-[#FD4C2A]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="absolute top-2.5 right-3 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirmer le mot de passe"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#FD4C2A] focus:border-[#FD4C2A] block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#FD4C2A] dark:focus:border-[#FD4C2A]"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <span
                className="absolute top-2.5 right-3 text-gray-500 cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white bg-[#FD4C2A] hover:bg-[#e04324] focus:ring-4 focus:outline-none focus:ring-[#fd6e4e] font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Réinitialisation en cours...' : 'Réinitialiser'}
            </button>

            {message && (
             <p
             className={`text-sm text-center ${
               loading
                 ? 'text-gray-500'
                 : isSuccess
                 ? 'text-green-600' // ✅ ce qu'on veut
                 : 'text-red-600'
             }`}
           >
             {message}
           </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordForm;
