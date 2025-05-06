/*import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function RestaurantAddresses() {
  const [address, setAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    axios
      .get("http://localhost:8080/restaurant/address/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAddress(res.data))
      .catch((err) => console.error("Error fetching address", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    axios
      .post(
        "http://localhost:8080/restaurant/address/update",
        {
          ...address,
          // si tu veux envoyer seulement les id des relations
          region: { id: address.region.id },
          province: { id: address.province.id },
          commune: { id: address.commune.id },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setIsEditing(false);
      })
      .catch((err) => console.error("Error updating address", err));
  };

  if (!address) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-orange-500 mb-6">Your Address</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            name="title"
            type="text"
            value={address.title}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Street</label>
          <input
            name="street"
            type="text"
            value={address.street}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Commune</label>
          <input
            type="text"
            value={address.commune.communeName}
            disabled
            className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Province</label>
          <input
            type="text"
            value={address.province.provinceName}
            disabled
            className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Region</label>
          <input
            type="text"
            value={address.region.regionName}
            disabled
            className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100"
          />
        </div>

        <div className="flex gap-4 mt-6">
          {!isEditing ? (
           <div className="flex space-x-2">
           <button
             onClick={() => setIsEditing(true)}
             className="flex-1 text-white bg-[#FD4C2A] hover:bg-[#e04324] focus:ring-4 focus:outline-none focus:ring-[#fd6e4e] font-medium rounded-lg text-sm px-3 py-2.5 text-center"
           >
             Edit
           </button>
           <Link to={`/restaurant/account_settings/`} className="flex-1">
             <button
               type="button"
               className="w-full text-white bg-[#FD4C2A] hover:bg-[#e04324] focus:ring-4 focus:outline-none focus:ring-[#fd6e4e] font-medium rounded-lg text-sm px-3 py-2.5 text-center"
               title="Back"
             >
               Cancel
             </button>
           </Link>
         </div>
         
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RestaurantAddresses;
*/


import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaSave } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

function RestaurantAddress() {
  const [address, setAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);
  const token = localStorage.getItem("authToken");

  // Load address on mount
  useEffect(() => {
    axios
      .get("http://localhost:8080/restaurant/address/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAddress(res.data);
      })
      .catch((err) => console.error("Error fetching address", err));
  }, []);

  // Load regions on mount
  useEffect(() => {
    axios
      .get("http://localhost:8080/public/addressDetails/Regions")
      .then((res) => setRegions(res.data));
  }, []);

  const handleChange = (field, value) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "region") {
      axios
        .get(`http://localhost:8080/public/addressDetails/Provinces?regionID=${value}`)
        .then((res) => setProvinces(res.data));
    }

    if (field === "province") {
      axios
        .get(`http://localhost:8080/public/addressDetails/Communes?provinceID=${value}`)
        .then((res) => setCommunes(res.data));
    }
  };

  const handleSave = () => {
    const payload = {
      id: address.id,
      title: address.title,
      street: address.street,
      regionID: address.region?.id || address.region,
      provinceID: address.province?.id || address.province,
      communeID: address.commune?.id || address.commune,
      latitude: address.latitude,
      longitude: address.longitude,
    };

    axios
      .post("http://localhost:8080/restaurant/address/update", payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("✅ Address updated!");
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Error updating address", err);
        alert("❌ Failed to update address");
      });
  };

  if (!address) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-orange-500 mb-6">Restaurant Address</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={address.title}
            onChange={(e) => handleChange("title", e.target.value)}
            disabled={!isEditing}
            className="w-full mt-1 px-3 py-2 border rounded bg-gray-50 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Street</label>
          <input
            type="text"
            value={address.street}
            onChange={(e) => handleChange("street", e.target.value)}
            disabled={!isEditing}
            className="w-full mt-1 px-3 py-2 border rounded bg-gray-50 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Region</label>
          {isEditing ? (
            <select
              value={address.region?.id || address.region}
              onChange={(e) => handleChange("region", e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded"
            >
              <option value="">Select region</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.regionName}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-700">{address.region.regionName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Province</label>
          {isEditing ? (
            <select
              value={address.province?.id || address.province}
              onChange={(e) => handleChange("province", e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded"
            >
              <option value="">Select province</option>
              {provinces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.provinceName}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-700">{address.province?.provinceName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Commune</label>
          {isEditing ? (
            <select
              value={address.commune?.id || address.commune}
              onChange={(e) => handleChange("commune", e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded"
            >
              <option value="">Select commune</option>
              {communes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.communeName}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-700">{address.commune?.communeName}</p>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          {!isEditing ? (
             <div className="flex space-x-2">
             <button
               onClick={() => setIsEditing(true)}
               className="flex-1 text-white bg-[#FD4C2A] hover:bg-[#e04324] focus:ring-4 focus:outline-none focus:ring-[#fd6e4e] font-medium rounded-lg text-sm px-3 py-2.5 text-center"
             >
               Edit
             </button>
             <Link to={`/restaurant/account_settings/`} className="flex-1">
               <button
                 type="button"
                 className="w-full text-white bg-[#FD4C2A] hover:bg-[#e04324] focus:ring-4 focus:outline-none focus:ring-[#fd6e4e] font-medium rounded-lg text-sm px-3 py-2.5 text-center"
                 title="Back"
               >
                 Cancel
               </button>
             </Link>
           </div>
          ) : (
            <>
             <div className="flex space-x-2">
           <button
             onClick={handleSave}
             className="flex-1 text-white bg-[#FD4C2A] hover:bg-[#e04324] focus:ring-4 focus:outline-none focus:ring-[#fd6e4e] font-medium rounded-lg text-sm px-3 py-2.5 text-center"
           >
             Save
           </button>
           <button
                onClick={() => setIsEditing(false)}
               type="button"
               className="w-full text-white bg-[#FD4C2A] hover:bg-[#e04324] focus:ring-4 focus:outline-none focus:ring-[#fd6e4e] font-medium rounded-lg text-sm px-3 py-2.5 text-center"
               title="Back"
             >
               Cancel
             </button>
         
         </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RestaurantAddress;
