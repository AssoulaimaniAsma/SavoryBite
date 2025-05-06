import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditAddress = () => {
  const { id } = useParams();
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
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [showCoordinates, setShowCoordinates] = useState(false);

  // 🔄 Charger les données d'une adresse existante
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    axios.get(`http://localhost:8080/user/address/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      const addr = res.data;
      setFormData({
        title: addr.title,
        street: addr.street,
        region: addr.region.id,
        province: addr.province.id,
        commune: addr.commune.id,
        isDefault: addr.isDefault
      });
      if (addr.latitude && addr.longitude) {
        setLatitude(addr.latitude);
        setLongitude(addr.longitude);
        setShowCoordinates(true);
      }
    })
    .catch((err) => console.error("❌ Failed to load address", err));
  }, [id]);

  // 🔄 Load regions
  useEffect(() => {
    axios.get("http://localhost:8080/public/addressDetails/Regions")
      .then(res => setRegions(res.data))
      .catch(err => console.error("Regions loading error", err));
  }, []);

  // 🔄 Load provinces when region changes
  useEffect(() => {
    if (formData.region) {
      axios.get(`http://localhost:8080/public/addressDetails/Provinces?regionID=${formData.region}`)
        .then(res => setProvinces(res.data));
    }
  }, [formData.region]);

  // 🔄 Load communes when province changes
  useEffect(() => {
    if (formData.province) {
      axios.get(`http://localhost:8080/public/addressDetails/Communes?provinceID=${formData.province}`)
        .then(res => setCommunes(res.data));
    }
  }, [formData.province]);

  // 📝 Gestion des changements dans les champs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // 📍 Gestion des coordonnées GPS
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
          console.error("Location permission denied:", error.message);
          setShowCoordinates(false);
        }
      );
    } else {
      setShowCoordinates(false);
      setLatitude("");
      setLongitude("");
    }
  };

  // 📤 Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    const payload = {
      title: formData.title,
      street: formData.street,
      regionID: Number(formData.region),
      provinceID: Number(formData.province),
      communeID: Number(formData.commune),
      isDefault: formData.isDefault,
      latitude: showCoordinates ? parseFloat(latitude) : null,
      longitude: showCoordinates ? parseFloat(longitude) : null,
      isCoordinationActivated: showCoordinates
    };

    try {
      await axios.post(`http://localhost:8080/user/address/${id}/update`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Address updated!");
      navigate("/client/allAddress");
    } catch (error) {
      console.error("❌ Error updating address:", error);
      alert("Failed to update address.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-[#FD4C2A] mb-6">Edit Address</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Region</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select region</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>{r.regionName}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Province</label>
          <select
            name="province"
            value={formData.province}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select province</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>{p.provinceName}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Commune</label>
          <select
            name="commune"
            value={formData.commune}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select commune</option>
            {communes.map((c) => (
              <option key={c.id} value={c.id}>{c.communeName}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Street</label>
          <input
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label>Set as default address</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showCoordinates}
            onChange={handleCheckboxChange}
            className="w-4 h-4"
          />
          <label>Add GPS coordinates</label>
        </div>

        {showCoordinates && (
          <div className="space-y-2">
            <input value={latitude} readOnly className="w-full p-2 border rounded bg-gray-100" />
            <input value={longitude} readOnly className="w-full p-2 border rounded bg-gray-100" />
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-[#FD4C2A] text-white rounded hover:bg-[#e04324]"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate("/client/allAddress")}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAddress;
