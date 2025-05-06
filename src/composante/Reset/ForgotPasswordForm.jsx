import React, { useState } from 'react';
import { Link } from "react-router-dom";
import logo from "../../image/favicon.png";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Please wait...");

    try {
      const response = await fetch('http://localhost:8080/auth/forgotPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email }),
      });

      const text = await response.text();
      setMessage(text);
    } catch (error) {
      setMessage("Erreur lors de l'envoi de la demande.");
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = message === 'Password reset link sent to your email.';

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="flex items-center space-x-2 font-bold mt-10 mb-10">
        <img src={logo} className="w-12 h-12" alt="Logo" />
        <Link to="/" className="text-black text-3xl">
          <span className="text-[#FD4C2A] font-extrabold">Savory</span>Bites
        </Link>
      </div>
      <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Forgot your password?
          </h1>
          <p className="font-light text-gray-500 dark:text-gray-400">
            Don't fret! Just type in your email and we will send you a code to reset your password!
          </p>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 lg:mt-5 md:space-y-5">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#FD4C2A] focus:border-[#FD4C2A] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#FD4C2A] dark:focus:border-[#FD4C2A]"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="w-4 h-4 rounded border border-gray-300 accent-[#FD4C2A] focus:ring-2 focus:ring-[#FD4C2A] dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
                  I accept the{' '}
                  <a className="font-medium text-[#FD4C2A] hover:underline" href="#">
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className={`w-full text-white bg-[#FD4C2A] hover:bg-[#e04324] focus:ring-4 focus:outline-none focus:ring-[#fd6e4e] font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : 'Reset password'}
            </button>

            {message && (
              <p
                className={`text-sm text-center ${
                  loading
                    ? 'text-gray-500'
                    : isSuccess
                    ? 'text-green-600'
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

export default ForgotPasswordForm;