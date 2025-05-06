import React, { useState, useEffect } from "react";
import { FaEdit, FaTimes, FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [availableCouriers, setAvailableCouriers] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [selectedCourierId, setSelectedCourierId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loadingStatus, setLoadingStatus] = useState({});
  const [statusOptionsFromBackend, setStatusOptionsFromBackend] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
// Debugging line
  useEffect(() => {
    if (!token) {
      navigate('/restaurant/SigninRestaurant');
    } else {
      fetchOrders();
      fetchAvailableCouriers();
      fetchStatusOptions(); // Nouvelle fonction pour récupérer les statuts
    }
  }, [token, navigate]);

  const fetchStatusOptions = async () => {
    try {
      const res = await fetch("http://localhost:8080/restaurant/orders/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok && res.status === 401) {
        navigate('/restaurant/SigninRestaurant');
        return;
      }
      const data = await res.json();
      console.log(data);
      setStatusOptionsFromBackend(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des options de statut :", error);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/restaurant/orders/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok && res.status === 401) {
        navigate('/restaurant/SigninRestaurant');
        return;
      }
      const data = await res.json();
      const sortedOrders = data.sort((a, b) => a.id - b.id);
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes :", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCouriers = async () => {
    try {
      const res = await fetch("http://localhost:8080/restaurant/couriers/availableCouriers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok && res.status === 401) {
        navigate('/restaurant/SigninRestaurant');
        return;
      }
      const data = await res.json();
      console.log(data);
      setAvailableCouriers(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des livreurs :", error);
    }
  };

  const openAssignModal = (order) => {
    setSelectedOrder(order);
    setSelectedCourierId(null);
    setShowAssignModal(true);
  };

  const handleCourierSelect = (courierId) => {
    setSelectedCourierId(courierId === selectedCourierId ? null : courierId);
  };

  const assignCourierToOrder = async () => {
    if (selectedOrder && selectedCourierId) {
      try {
        console.log("selectedOrder:", selectedOrder);
        console.log("selectedCourierId:", selectedCourierId);
        const res = await fetch(
          `http://localhost:8080/restaurant/orders/${selectedOrder.id}/assignCourier?courierID=${selectedCourierId}`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok && res.status === 401) {
          navigate('/restaurant/SigninRestaurant');
          return;
        }
        setShowAssignModal(false);
        fetchOrders();
      } catch (error) {
        console.error("Erreur lors de l'assignation du livreur :", error);
      } finally {
        setSelectedCourierId(null); // Réinitialise l'ID du livreur sélectionné après l'assignation
      }
    }
  };

  const openItemsModal = (order) => {
    setSelectedOrder(order);
    setShowItemsModal(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order?.courier) {
      setAlertMessage("You must assign a courier before changing the status.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    setLoadingStatus(prev => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch(
        `http://localhost:8080/restaurant/orders/${orderId}/updateStatus?orderStatus=${newStatus}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok && res.status === 401) {
        navigate('/restaurant/SigninRestaurant');
        return;
      }
      setAlertMessage(`Status of order has been modified to ${formatStatusText(newStatus)}`);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      await fetchOrders();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
    } finally {
      setLoadingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const formatStatusText = (status) => {
    return status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getAvailableStatusOptions = (currentStatus) => {
    if (currentStatus === "ACCEPTED") {
      return statusOptionsFromBackend.filter(s => s !== "ACCEPTED");
    }
    return statusOptionsFromBackend.filter(s => s !== currentStatus);
  };

  if (loading) return <div>Loading orders...</div>;
  // Filtrer les commandes prioritaires (pas livrées, pas rejetées, pas annulées)
const activeOrders = orders.filter(order => 
  order.status !== "DELIVERED" && 
  order.status !== "REJECTED" && 
  order.status !== "CANCELED"
);

// Les autres commandes (livrées, rejetées, annulées)
const completedOrders = orders.filter(order => 
  order.status === "DELIVERED" || 
  order.status === "REJECTED" || 
  order.status === "CANCELED"
);

// Combiner les deux (prioritaires d'abord)
const sortedOrders = [...activeOrders, ...completedOrders];

// Pagination logique
const ordersPerPage = 5;
const indexOfLastOrder = currentPage * ordersPerPage;
const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

// Pour les boutons de pagination
const pageNumbers = [];
for (let i = 1; i <= Math.ceil(sortedOrders.length / ordersPerPage); i++) {
  pageNumbers.push(i);
}

// Fonction pour changer de page
const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl text-[#FD4C2A] font-bold mb-6">Orders</h1>
      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center p-4 text-sm text-black rounded-lg bg-[#f0b9ae]">
            <span className="font-medium">{alertMessage}</span>
          </div>
        </div>
      )}
      <table className="min-w-full text-left border rounded-2xl overflow-hidden shadow">
        <thead className="bg-[#FD4C2A] text-white">
          <tr>
            <th className="p-4">Order ID</th>
            <th className="p-4">Items</th>
            <th className="p-4">Total Price</th>
            <th className="p-4">Courier</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white">
        {currentOrders.map((order) => {
            const isReadOnly = order.status === "REJECTED" || order.status === "CANCELED";
            const isDelivered = order.status === "DELIVERED";
            const hasCourier = order.courier;
            const isInitiallyNull = order.status === null;
            const rowClassName = isDelivered
              ? "bg-green-100"
              : order.status === "REJECTED"
              ? "text-[#FF2C2C] font-bold bg-[#FBEAE7]"
              : "hover:bg-gray-50";

            return (
              <tr key={order.id} className={`border-b transition-all ${rowClassName}`}>
                <td className="p-4 font-bold text-gray-900">{order.id}</td>
                <td className="p-4">
                  <button
                    onClick={() => openItemsModal(order)}
                    className="text-[#FD4C2A] hover:text-[#972D19] flex items-center gap-1"
                  >
                    <FaInfoCircle /> View Items ({order.items.length})
                  </button>
                </td>
                <td className="p-4 font-semibold text-gray-900">{order.totalPrice} Dh</td>
                <td className="p-4">
                  {hasCourier ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={order.courier.profileImg}
                        alt={order.courier.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{order.courier.fullName}</span>
                    </div>
                  ) : (
                    !isReadOnly && (
                      <button
                        onClick={() => openAssignModal(order)}
                        className="text-[#FD4C2A] hover:text-[#972D19] flex items-center gap-1 text-sm"
                      >
                        <FaEdit /> Assign
                      </button>
                    )
                  )}
                </td>
                <td className="p-4">
                  {isDelivered ? (
                    <span className=" text-[#008000] font-bold ">{formatStatusText(order.status)}</span>
                  ) : !isReadOnly ? (
                    loadingStatus[order.id] ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FD4C2A]"></div>
                        <span className="ml-2 text-gray-500 text-sm">Updating...</span>
                      </div>
                    ) : (
                      <select
  value={order.status}
  onChange={(e) => handleStatusChange(order.id, e.target.value)}
  disabled={!hasCourier}
  className={`appearance-none border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#FD4C2A] focus:border-[#FD4C2A] hover:text-[#FD4C2A] focus:text-[#FD4C2A] shadow-sm ${
    !hasCourier ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
  }`}
>
  {order.status === "ACCEPTED" && (
    <option value="ACCEPTED" disabled>
      {formatStatusText("ACCEPTED")}
    </option>
  )}  
  {statusOptionsFromBackend.map((status) => (
    <option key={status} value={status}>
      {formatStatusText(status)}
    </option>
  ))}
</select>

                    )
                  ) : (
                    <span>{formatStatusText(order.status)}</span>
                  )}
                </td>
              </tr>
            );
          })}
          {orders.length === 0 && !loading && (
            <tr>
              <td colSpan="5" className="p-6 text-center text-gray-500">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-center mt-5">
  <ul className="flex gap-3">
    {pageNumbers.map((number) => (
      <li key={number}>
        <button
          onClick={() => paginate(number)}
          className={`px-3 py-1 rounded-lg ${
            currentPage === number
              ? 'bg-[#FD4C2A] text-white'
              : 'bg-gray-200 text-gray-700'
          } hover:bg-[#FD4C2A] hover:text-white`}
        >
          {number}
        </button>
      </li>
    ))}
  </ul>
</div>

      {showItemsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#FD4C2A]">Order Details - #{selectedOrder.id}</h2>
              <button
                onClick={() => setShowItemsModal(false)}
                className="text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-2 font-semibold text-gray-700">
                <div className="col-span-5">Item</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-4 text-right">Price</div>
              </div>

              {selectedOrder.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center py-2">
                  <div className="col-span-5 flex items-center gap-3">
                    <img
                      src={item.food.image}
                      alt={item.food.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <p>{item.food.title}</p>
                  </div>
                  <div className="col-span-3 text-center">{item.quantity}</div>
                  <div className="col-span-4 text-right">{item.priceAtOrderTime * item.quantity} Dh</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowItemsModal(false)}
                className="px-4 py-2 bg-[#FD4C2A] text-white rounded hover:bg-[#e04020]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showAssignModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Assign Courier</h2>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedCourierId(null);
                }}
                className="text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            {availableCouriers.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {availableCouriers.map((courier) => (
                  <div
                    key={courier.id}
                    className={`flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded ${selectedCourierId === courier.id ? 'bg-gray-200' : ''}`}
                    onClick={() => handleCourierSelect(courier.id)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={courier.profileImg}
                        alt={courier.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{courier.fullName}</p>
                        <p className="text-sm text-gray-500">{courier.phone}</p>
                      </div>
                    </div>
                    {selectedCourierId === courier.id ? <FaCheckCircle className="text-green-500" /> : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No couriers available.</p>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={assignCourierToOrder}
                disabled={!selectedCourierId}
                className={`px-4 py-2 rounded text-white ${selectedCourierId ? 'bg-[#FD4C2A] hover:bg-[#e04020]' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}