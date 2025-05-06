import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ShowAddress = () => {
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

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [showCoordinates, setShowCoordinates] = useState(false);

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
        region: addr.region.regionName,
        province: addr.province.provinceName,
        commune: addr.commune.communeName,
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

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-[#FD4C2A] mb-6">View Address</h2>

      <div className="space-y-4">

        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            value={formData.title}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Region</label>
          <input
            value={formData.region}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Province</label>
          <input
            value={formData.province}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Commune</label>
          <input
            value={formData.commune}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Street</label>
          <input
            value={formData.street}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isDefault}
            readOnly
            className="w-4 h-4"
          />
          <label>This is the default address</label>
        </div>

        {showCoordinates && (
          <div className="space-y-2">
            <input value={latitude} readOnly className="w-full p-2 border rounded bg-gray-100" />
            <input value={longitude} readOnly className="w-full p-2 border rounded bg-gray-100" />
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/client/allAddress")}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowAddress;
