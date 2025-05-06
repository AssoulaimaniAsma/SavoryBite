/*import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, FaMapMarkerAlt, FaEdit, FaTrash } from "react-icons/fa";

function UserAddresses() {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    axios
      .get("http://localhost:8080/user/address/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => setAddresses(res.data))
      .catch((err) => console.error("Error fetching addresses", err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#FD4C2A]">Your Addresses</h2>
        <button className="flex items-center gap-2 text-sm font-medium text-white bg-[#FD4C2A] px-4 py-2 rounded-full hover:bg-[#e04323] transition-all">
          <FaMapMarkerAlt /> Add Address
        </button>
      </div>

      <div className="grid gap-6">
        {addresses.map((addr, index) => (
          <div
            key={index}
            className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 border border-gray-200 rounded-xl shadow-sm p-5 bg-white hover:shadow-md transition-all relative"
          >
            {addr.isDefault && (
              <span className="absolute top-1 right-4 bg-[#FD4C2A] text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
                Default
              </span>
            )}

            <div className="flex-1 min-w-[150px]">
              <p className="text-sm font-semibold text-[#FD4C2A]">Title</p>
              <p className="text-sm text-gray-800">{addr.title}</p>
            </div>

            <div className="flex-1 min-w-[150px]">
              <p className="text-sm font-semibold text-[#FD4C2A]">Street</p>
              <p className="text-sm text-gray-800">{addr.street}</p>
            </div>

            <div className="flex-1 min-w-[150px]">
              <p className="text-sm font-semibold text-[#FD4C2A]">Commune</p>
              <p className="text-sm text-gray-800">{addr.commune.communeName}</p>
            </div>

            <div className="flex-1 min-w-[150px]">
              <p className="text-sm font-semibold text-[#FD4C2A]">Province</p>
              <p className="text-sm text-gray-800">{addr.province.provinceName}</p>
            </div>

            <div className="flex-1 min-w-[150px]">
              <p className="text-sm font-semibold text-[#FD4C2A]">Region</p>
              <p className="text-sm text-gray-800">{addr.region.regionName}</p>
            </div>

            <div className="flex gap-3 mt-3 md:mt-0">
              <button className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm">
                <FaEdit /> Edit
              </button>
              <button className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm">
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}

        {addresses.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No address found.
          </div>
        )}
      </div>
    </div>
  );
}

export default UserAddresses;
*/

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaEdit, FaTrash } from "react-icons/fa";

function UserAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = () => {
    axios
      .get("http://localhost:8080/user/address/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)
        );
        setAddresses(sorted);
      })
      .catch((err) => console.error("Error fetching addresses", err));
  };

  const handleDelete = (id) => {
    setAddressToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.post(
        `http://localhost:8080/user/address/${addressToDelete}/delete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressToDelete));
    } catch (err) {
      console.error("Error deleting address", err);
    } finally {
      setShowModal(false);
      setAddressToDelete(null);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-500">Your Addresses</h2>
          <Link to="/client/Address/true">
            <button className="flex items-center gap-2 text-sm font-medium text-white bg-orange-500 px-4 py-2 rounded-full hover:bg-[#e04323] transition-all">
              <FaMapMarkerAlt /> Add Address
            </button>
          </Link>
        </div>

        {addresses.map((addr, index) => (
            
          <div
            key={addr.id}
            className="border rounded-lg p-4 mb-4 shadow-sm relative flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white"
          >
            <Link to={`../client/Address/show/${addr.id}`}>
            <div>

              <p className="text-lg font-semibold text-[#FD4C2A]">{addr.title}</p>
              <p className="text-gray-600 text-sm mt-1">{addr.street}</p>
              <p className="text-gray-600 text-sm">
                {addr.commune.communeName}, {addr.province.provinceName}
              </p>
              <p className="text-gray-600 text-sm">{addr.region.regionName}</p>
            </div>
            </Link>
            <div className="flex gap-3 mt-3 md:mt-0">
              <Link to={`/client/Address/edit/${addr.id}`}>
                <button className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm">
                  <FaEdit /> Edit
                </button>
              </Link>
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
              >
                <FaTrash /> Delete
              </button>
            </div>
            {addr.isDefault && (
              <div className="absolute top-1 right-4">
                <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                  Default
                </span>
              </div>
            )}
          </div>
          
        ))}
        <Link to={`/client/account`}>
        <button
      type="button"
      //onClick={() => navigate("../client/allAddress")}
      className="flex-1 text-white bg-[#FD4C2A] hover:bg-[#e04324] focus:ring-4 focus:outline-none focus:ring-[#fd6e4e] font-medium rounded-lg text-sm px-3 py-2.5 text-center"
      title="Back"
    >
      
    Previous
    </button>
    </Link>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this address?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserAddresses;
