import React from 'react';
import"../css/feed_back.css";
const ContactForm = () => {
  return (
    <div id="body" className="flex justify-center items-center min-h-screen bg-white px-10">
      <div className="max-w-4xl w-full border-2 border-[#FD4C2A] shadow-lg rounded-lg overflow-hidden ">
        {/* Titre centré en haut */}
        <h2 className="text-3xl text-white font-bold mb-6 bg-[#FD4C2A] px-2 py-3 rounded-lg">
          Get In Touch With Us
        </h2>

        {/* Conteneur principal pour les deux colonnes */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Colonne de gauche : Informations de contact */}
          <div className="w-full md:w-1/3 px-10">
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold">Phone Number</label>
              <p className="text-gray-900">0012334566</p>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold">Email Address</label>
              <p className="text-gray-900">johndoe@example.com</p>
            </div>
          </div>

          {/* Colonne de droite : Message d'instruction et formulaire de contact */}
          <div className="w-full md:w-2/3 px-10">
            <div className="mb-6">
              <p className="text-gray-700 font-bold">Send us a message</p>
              <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla fringilla nunc in molestie feugiat.</p>
            </div>

            {/* Formulaire de contact */}
            <form>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 font-black">Your Name</label>
                  <input type="text" placeholder="Your Name" className="w-full mt-2 p-3 border-2 border-[#D7D2D0] rounded-full bg-gray-50 focus:outline-none" />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-black">Your Email</label>
                  <input type="email" placeholder="Your Email" className="w-full mt-2 p-3 border-2 border-[#D7D2D0] rounded-full bg-gray-50 focus:outline-none" />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-black">Phone Number</label>
                  <input type="tel" placeholder="Phone Number" className="w-full mt-2 p-3 border-2 border-[#D7D2D0] rounded-full bg-gray-50 focus:outline-none" />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-black">Subject</label>
                  <input type="text" placeholder="Subject" className="w-full mt-2 p-3 border-2 border-[#D7D2D0] rounded-full bg-gray-50 focus:outline-none" />
                </div>

                <div className="mb-4 col-span-2">
                  <label className="block text-gray-700 font-black">Message</label>
                  <textarea placeholder="Message" className="w-full mt-2 p-3 border-2 border-[#D7D2D0] rounded-lg bg-gray-50 focus:outline-none" rows="4"></textarea>
                </div>
              </div>

              <button type="submit" className="w-full bg-[#FD4C2A] text-white mb-3 p-3 rounded-full hover:bg-[#FD4C2A]/90">
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