import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./feed_back.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Assure-toi que ton token est stocké ici
        const response = await axios.get('http://localhost:8080/user/accountDetails', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        console.log(data);
        setFormData(prev => ({
          ...prev,
          firstName: data.firstName || '',
          email: data.email || '',
          phone: data.phone || '',
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Tu peux envoyer le formData ici vers ton backend
  };

  return (
    <div id="body" className="flex justify-center items-center min-h-screen bg-white px-10">
      <div className="max-w-4xl w-full border-2 border-[#FD4C2A] shadow-lg rounded-lg overflow-hidden">
        <h2 className="text-3xl text-white font-bold mb-6 bg-[#FD4C2A] px-2 py-3 rounded-lg">
          Get In Touch With Us
        </h2>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Colonne de gauche */}
          <div className="w-full md:w-1/3 px-10">
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold">Phone Number</label>
              <p className="text-gray-900">{formData.phone || 'Not Provided'}</p>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold">Email Address</label>
              <p className="text-gray-900">{formData.email || 'Not Provided'}</p>
            </div>
          </div>

          {/* Colonne de droite */}
          <div className="w-full md:w-2/3 px-10">
            <div className="mb-6">
              <p className="text-gray-700 font-bold">Send us a message</p>
              <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla fringilla nunc in molestie feugiat.</p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 font-black">Your Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full mt-2 p-3 border-2 border-[#D7D2D0] rounded-full bg-gray-50 focus:outline-none"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-black">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className="w-full mt-2 p-3 border-2 border-[#D7D2D0] rounded-full bg-gray-50 focus:outline-none"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-black">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full mt-2 p-3 border-2 border-[#D7D2D0] rounded-full bg-gray-50 focus:outline-none"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-black">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="w-full mt-2 p-3 border-2 border-[#D7D2D0] rounded-full bg-gray-50 focus:outline-none"
                  />
                </div>

                <div className="mb-4 col-span-2">
                  <label className="block text-gray-700 font-black">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
                    className="w-full mt-2 p-3 border-2 border-[#D7D2D0] rounded-lg bg-gray-50 focus:outline-none"
                    rows="4"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FD4C2A] text-white mb-3 p-3 rounded-full hover:bg-[#FD4C2A]/90"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
