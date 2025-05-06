import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams ,useNavigate } from "react-router-dom";

const AddressForm = () => {
  const { isEditable } = useParams();
  const editable = isEditable === "true";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    region: "",
    province: "",
    commune: "",
    street: "",
    isDefault: false
  });

  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/public/addressDetails/Regions")
      .then(res => setRegions(res.data))
      .catch(err => console.error("Regions loading error", err));
  }, []);

  useEffect(() => {
    if (formData.region) {
      axios.get(`http://localhost:8080/public/addressDetails/Provinces?regionID=${formData.region}`)
        .then(res => setProvinces(res.data))
        .catch(err => console.error("Provinces loading error", err));
    }
  }, [formData.region]);

  useEffect(() => {
    if (formData.province) {
      axios.get(`http://localhost:8080/public/addressDetails/Communes?provinceID=${formData.province}`)
        .then(res => setCommunes(res.data))
        .catch(err => console.error("Communes loading error", err));
    }
  }, [formData.province]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCheckboxChange = () => {
    const newValue = !showCoordinates;
    if (newValue) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setShowCoordinates(true);
        },
        (error) => {
          console.error('Location permission denied:', error.message);
          setShowCoordinates(false);
        }
      );
    } else {
      setShowCoordinates(false);
      setLongitude('');
      setLatitude('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      title: formData.title,
      street: formData.street,
      regionID: Number(formData.region),
      provinceID: Number(formData.province),
      communeID: Number(formData.commune),
      latitude: showCoordinates ? parseFloat(latitude) : null,
      longitude: showCoordinates ? parseFloat(longitude) : null,
      isDefault: formData.isDefault,
      isCoordinationActivated: showCoordinates
    };
  
    // 👉 Récupérer le token
    const token = localStorage.getItem("authToken"); // ou sessionStorage, ou cookie si tu veux
  
    try {

      const response = await fetch("http://localhost:8080/user/address/addAddress", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
         },
        body: JSON.stringify(payload)
      });
      console.log("payload:",payload)
      if (response.status === 200) {
        alert("✅ Address added successfully!");
        navigate("../client/allAddress");
      } else {
        alert("❌ Something went wrong.");
      }
    } catch (error) {
      console.error("❌ Error submitting address:", error);
      alert("🚨 Failed to add address. Please check your token and try again.");
    }
  };
  

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h1 className="mb-4 text-xl font-bold leading-tight tracking-tight text-[#FD4C2A] md:text-2xl">
            Delivery Address
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Default Address */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="w-4 h-4 text-[#FD4C2A] focus:ring-[#FD4C2A] border-gray-300 rounded"
                disabled={!editable}
              />
              <label htmlFor="isDefault" className="text-sm text-gray-700 dark:text-white">
                Set as default address
              </label>
            </div>

            {/* Title */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Home, Office"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#FD4C2A] focus:border-[#FD4C2A] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={!editable}
              />
            </div>

            {/* Region */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">Region</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#FD4C2A] focus:border-[#FD4C2A] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={!editable}
              >
                <option value="">Select Region</option>
                {regions.map(r => (
                  <option key={r.id} value={r.id}>{r.regionName}</option>
                ))}
              </select>
            </div>

            {/* Province */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">Province</label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#FD4C2A] focus:border-[#FD4C2A] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={!editable}
              >
                <option value="">Select Province</option>
                {provinces.map(p => (
                  <option key={p.id} value={p.id}>{p.provinceName}</option>
                ))}
              </select>
            </div>

            {/* Commune */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">Commune</label>
              <select
                name="commune"
                value={formData.commune}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#FD4C2A] focus:border-[#FD4C2A] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={!editable}
              >
                <option value="">Select Commune</option>
                {communes.map(c => (
                  <option key={c.id} value={c.id}>{c.communeName}</option>
                ))}
              </select>
            </div>

            {/* Street */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">Street</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street, building number, etc."
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#FD4C2A] focus:border-[#FD4C2A] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={!editable}
              />
            </div>

            {/* Coordinates */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="coord"
                checked={showCoordinates}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-[#FD4C2A] focus:ring-[#FD4C2A] border-gray-300 rounded"
                disabled={!editable}
              />
              <label htmlFor="coord" className="text-sm text-gray-700 dark:text-white">
                Add GPS coordinates
              </label>
            </div>

            {showCoordinates && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">Longitude</label>
                  <input
                    type="text"
                    value={longitude}
                    readOnly
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">Latitude</label>
                  <input
                    type="text"
                    value={latitude}
                    readOnly
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:text-white"
                  />
                </div>
              </div>
            )}
            {!editable && (
  <div className="flex justify-between items-center space-x-4">
    
    <button
      type="button"
      onClick={() => navigate("../client/allAddress")}
      className="flex-1 text-white bg-[#FD4C2A] hover:bg-[#e04324] focus:ring-4 focus:outline-none focus:ring-[#fd6e4e] font-medium rounded-lg text-sm px-3 py-2.5 text-center"
      title="Back"
    >
      
    Previous
    </button>
  </div>
)}


{editable && (
  <div className="flex justify-between items-center space-x-4">
    <button
      type="submit"
      className="flex-1 text-white bg-[#FD4C2A] hover:bg-[#e04324] focus:ring-4 focus:outline-none focus:ring-[#fd6e4e] font-medium rounded-lg text-sm px-3 py-2.5 text-center"
    >
      Save address
    </button>
    <button
      type="button"
      onClick={() => navigate("../client/allAddress")}
      className="flex-1 text-white bg-[#FD4C2A] hover:bg-[#e04324] focus:ring-4 focus:outline-none focus:ring-[#fd6e4e] font-medium rounded-lg text-sm px-3 py-2.5 text-center"
      title="Back"
    >
      
    Previous
    </button>
  </div>
)}

          </form>
        </div>
      </div>
    </section>
  );
};

export default AddressForm;
