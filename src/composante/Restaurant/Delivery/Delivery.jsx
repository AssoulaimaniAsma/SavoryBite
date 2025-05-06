import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus, FaTrash, FaToggleOn, FaToggleOff, FaTimes } from "react-icons/fa";

export default function Delivery() {
  const [deliveries, setDeliveries] = useState([]);
  const [newDelivery, setNewDelivery] = useState({ 
    fullName: "", 
    phone: "", 
    email: "", 
    imageFile: null 
  });
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [editImagePreviewUrl, setEditImagePreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deliveryToDelete, setDeliveryToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  
  const token = localStorage.getItem("authToken");
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const triggerAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  useEffect(() => {
    fetchCouriers();
  }, []);

  const fetchCouriers = async () => {
    try {
      const res = await fetch("http://localhost:8080/restaurant/couriers/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Fetch failed");

      const contentType = res.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Received non-JSON response:", text);
        throw new Error("Expected JSON but got something else.");
      }

      const data = await res.json();
      const formatted = data.map((d) => ({
        id: d.id,
        fullName: d.fullName,
        email: d.email,
        phone: d.phone,
        image: d.profileImg,
        status: d.isAvailable,
      }));
      setDeliveries(formatted);
    } catch (error) {
      console.error("Error:", error);
      triggerAlert("Failed to load couriers");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      triggerAlert('File size exceeds 10MB');
      return;
    }
    setNewDelivery(prev => ({
      ...prev,
      imageFile: file
    }));
    setImagePreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      triggerAlert('File size exceeds 10MB');
      return;
    }
    setEditingDelivery(prev => ({
      ...prev,
      imageFile: file
    }));
    setEditImagePreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleAddDelivery = async () => {
    if (!newDelivery.fullName || !newDelivery.phone) {
      triggerAlert("Full name and phone are required");
      return;
    }

    try {
      const courierData = {
        fullName: newDelivery.fullName,
        email: newDelivery.email.toLowerCase(),
        phone: newDelivery.phone,
        isAvailable: true,
        profileImg: newDelivery.imageFile 
          ? `/image/${newDelivery.imageFile.name}`
          : "/image/default-profile.png"
      };

      const response = await fetch("http://localhost:8080/restaurant/couriers/addCourier", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(courierData),
      });

      if (response.ok) {
        fetchCouriers();
        setNewDelivery({ fullName: "", phone: "", email: "", imageFile: null });
        setImagePreviewUrl(null);
        triggerAlert("Courier added successfully!");
      } else {
        const errorText = await response.text();
        console.error("Failed to add courier:", errorText);
        triggerAlert(`Failed to add courier: ${errorText}`);
      }
    } catch (err) {
      console.error("Error adding courier:", err);
      triggerAlert("Error adding courier");
    }
  };

  const handleEditDelivery = async () => {
    if (!editingDelivery.fullName || !editingDelivery.phone) {
      triggerAlert("Full name and phone are required");
      return;
    }

    try {
      const courierData = {
        fullName: editingDelivery.fullName,
        email: editingDelivery.email.toLowerCase(),
        phone: editingDelivery.phone,
        isAvailable: editingDelivery.status,
        profileImg: editingDelivery.imageFile 
          ? `/image/${editingDelivery.imageFile.name}`
          : editingDelivery.image
      };

      const response = await fetch(`http://localhost:8080/restaurant/couriers/${editingDelivery.id}/update`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(courierData),
      });

      if (response.ok) {
        fetchCouriers();
        setShowEditModal(false);
        triggerAlert("Courier updated successfully!");
      } else {
        const errorText = await response.text();
        console.error("Failed to update courier:", errorText);
        triggerAlert(`Failed to update courier: ${errorText}`);
      }
    } catch (err) {
      console.error("Error updating courier:", err);
      triggerAlert("Error updating courier");
    }
  };

  const openEditModal = (delivery) => {
    setEditingDelivery({
      id: delivery.id,
      fullName: delivery.fullName,
      email: delivery.email,
      phone: delivery.phone,
      image: delivery.image,
      status: delivery.status,
      imageFile: null
    });
    setEditImagePreviewUrl(delivery.image);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    setDeliveryToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:8080/restaurant/couriers/${deliveryToDelete}/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setDeliveries(prev => prev.filter(d => d.id !== deliveryToDelete));
        triggerAlert("Courier deleted successfully!");
      } else {
        const errorText = await res.text();
        triggerAlert("Failed to delete courier");
      }
    } catch (err) {
      console.error("Delete error:", err);
      triggerAlert("Error deleting courier");
    }
    setShowModal(false);
    setDeliveryToDelete(null);
  };

  const toggleStatus = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/restaurant/couriers/${id}/toggleAvailability`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (res.ok) {
        fetchCouriers();
      } else {
        const errorText = await res.text();
        triggerAlert("Failed to update status");
      }
    } catch (err) {
      console.error("Toggle error:", err);
      triggerAlert("Error updating status");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDelivery(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingDelivery(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {showAlert && (
        <div className="fixed z-50 top-4 left-1/2 transform -translate-x-1/2 w-fit">
          <div className="flex items-center p-4 text-sm text-black rounded-lg bg-[#f0b9ae] shadow-lg">
            <span className="font-medium">{alertMessage}</span>
          </div>
        </div>
      )}

      <h1 className="text-2xl text-[#FD4C2A] font-bold mb-6">Courier List</h1>

      {/* Add Form */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={newDelivery.fullName}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-full px-4 py-2 w-[180px] focus:border-[#FD4C2A] focus:outline-none focus:ring-1 focus:ring-[#FD4C2A]"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newDelivery.email}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-full px-4 py-2 w-[180px] focus:border-[#FD4C2A] focus:outline-none focus:ring-1 focus:ring-[#FD4C2A]"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={newDelivery.phone}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-full px-4 py-2 w-[180px] focus:border-[#FD4C2A] focus:outline-none focus:ring-1 focus:ring-[#FD4C2A]"
        />
        
        <div className="flex items-center gap-2">
          <label
            htmlFor="fileInput"
            className="cursor-pointer bg-[#FD4C2A] text-white text-sm font-semibold px-3 py-2 ml-5 rounded-full"
          >
            Choose File
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          
          {newDelivery.imageFile && (
            <span className="text-sm text-gray-600">{newDelivery.imageFile.name}</span>
          )}
        </div>
        
        <button
          onClick={handleAddDelivery}
          className="bg-[#FD4C2A] text-white px-4 py-2 ml-10  rounded-full flex items-center gap-1 hover:bg-[#e04626]"
        >
          <FaPlus /> Add
        </button>
      </div>

      {/* Table */}
      <div className=" mt-10 overflow-x-auto rounded-2xl shadow">
        <table className=" min-w-full text-left overflow-hidden">
          <thead className="bg-[#FD4C2A] text-white rounded-t-2xl">
            <tr>
              <th className="p-4 rounded-tl-2xl">Image</th>
              <th className="p-4">Full Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Status</th>
              <th className="p-4 rounded-tr-2xl">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {deliveries.map((d) => (
              <tr key={d.id} className="border-b hover:bg-gray-50 transition-all">
                <td className="p-4">
                  <img src={d.image} alt={d.fullName} className="w-12 h-12 rounded-full object-cover" />
                </td>
                <td className="p-4">{d.fullName}</td>
                <td className="p-4">{d.email}</td>
                <td className="p-4">{d.phone}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${d.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {d.status ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="p-5 flex gap-4 items-center">
                  <button 
                    onClick={() => openEditModal(d)}
                    className="pt-2 text-blue-500 hover:text-blue-700 flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(d.id)} 
                    className="pt-2 text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {deliveries.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No delivery personnel added.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Delete Courier?</h2>
            <p className="mb-6 text-sm">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="relative p-4 w-full max-w-2xl">
            <div className="relative bg-white rounded-lg shadow">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-xl font-semibold text-gray-900">
                  Edit Courier
                </h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                >
                  <FaTimes />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-4 md:p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={editingDelivery.fullName}
                      onChange={handleEditInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#FD4C2A] focus:border-[#FD4C2A] block w-full p-2.5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editingDelivery.email}
                      onChange={handleEditInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#FD4C2A] focus:border-[#FD4C2A] block w-full p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editingDelivery.phone}
                      onChange={handleEditInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#FD4C2A] focus:border-[#FD4C2A] block w-full p-2.5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Status</label>
                    <select
                      name="status"
                      value={editingDelivery.status}
                      onChange={handleEditInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#FD4C2A] focus:border-[#FD4C2A] block w-full p-2.5"
                    >
                      <option value={true}>Available</option>
                      <option value={false}>Unavailable</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                    {editImagePreviewUrl ? (
                      <img src={editImagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex justify-center items-center w-full h-full">
                        <span className="text-gray-400">Photo</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="cursor-pointer bg-[#FD4C2A] text-white text-sm font-semibold px-3 py-2 rounded-lg inline-block">
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
                <button
                  onClick={handleEditDelivery}
                  className="text-white bg-[#FD4C2A] hover:bg-[#e04626] focus:ring-4 focus:outline-none focus:ring-[#FD4C2A] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-[#FD4C2A] focus:z-10 focus:ring-4 focus:ring-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}