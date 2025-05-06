import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const statusColor = {
  PREPARING: 'bg-gray-200 text-gray-700',
  COMPLETED: 'bg-gray-200 text-gray-700',
  CANCELLED: 'bg-red-200 text-gray-700',
    UNCOMPLETED: 'bg-gray-200 text-gray-700',
  DELIVERED: 'bg-green-200 text-gray-700', // un peu plus clair que bg-green
  ACCEPTED: 'bg-gray-200 text-gray-700',
  REJECTED: 'bg-red-200 text-gray-700',
};

const OrderHistory = () => {
  const [cancelAlert, setCancelAlert] = useState(null); // contient l'order à annuler
const [loadingCancel, setLoadingCancel] = useState(false);
const [searchOrderId, setSearchOrderId] = useState('');
const [searchStatus, setSearchStatus] = useState('');
const [searchTerm, setSearchTerm] = useState('');

  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:8080/user/orders/placedOrders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    console.log("Les commandes récupérées :", response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes', error);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  
    const handleOrderUpdate = () => {
      console.log('Mise à jour reçue via WebSocket, rechargement des commandes...');
      fetchOrders();
    };
  
    window.addEventListener('orderUpdateReceived', handleOrderUpdate);
  
    return () => {
      window.removeEventListener('orderUpdateReceived', handleOrderUpdate);
    };
  }, []);
  
  const filteredOrders = orders.filter(order => {
    const term = searchTerm.toLowerCase();
    return (
      order.id.toString().includes(term) ||
      order.status.toLowerCase().includes(term)
    );
  });
  
  
  const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  
  //const sortedOrders = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateStr) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  // Fonction pour déterminer la couleur de fond de toute la ligne
  const getRowColor = (status) => {
    if (status === 'DELIVERED') return 'bg-green-100';
    if (status === 'REJECTED') return 'bg-red-100';
    if (status === 'CANCELLED') return 'bg-red-100';
    return '';
  };


  const handleCancelOrder = async (orderId) => {
    console.log("Annulation de la commande avec l'ID :", orderId);
    setLoadingCancel(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(
        `http://localhost:8080/user/orders/placedOrders/${orderId}/cancel`,
        null, // Corps vide car c'est une PUT sans body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // Actualise la liste
      //setOrders((prev) => prev.filter(order => order.id !== orderId));
      setCancelAlert(null); // Fermer l'alerte
    } catch (error) {
      console.error("Erreur lors de l'annulation", error);
    } finally {
      setLoadingCancel(false);
    }
  };
  
  return (
    <div className="p-6">
<div className="flex justify-between items-center mb-4 mt-8">
  {/* Gauche : Titre + Bouton */}
  <div className="flex items-center space-x-4">
    <h2 className="text-2xl font-semibold text-[#FD4C2A]">Order History</h2>
    <button
      onClick={() => fetchOrders()}
      className="text-[#FD4C2A] hover:text-[#e04020] p-2 rounded-full hover:bg-gray-100 transition"
      title="Refresh Orders"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0114.13-3.36L23 10M1 14l5.36 5.36A9 9 0 0020.49 15" />
      </svg>
    </button>
  </div>

  {/* Droite : Barre de recherche */}
  <div className="relative w-full max-w-md">
    <input
      type="text"
      placeholder="Search by Order ID or Status"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      }}
      className="w-full border border-gray-500 focus:border-orange-500 rounded-full py-2 pl-4 pr-12 outline-none font-bold"
    />
    <button className="absolute right-0 top-0 h-full px-3 hover:text-orange-600">
      <FiSearch className="text-xl" />
    </button>
  </div>
</div>

    
      <div className="border rounded-lg overflow-hidden">
      {cancelAlert && (
  <div className="p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50" role="alert">
    <div className="flex items-center mb-2">
      <svg className="shrink-0 w-4 h-4 me-2" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <h3 className="text-lg font-medium">Confirm Cancellation</h3>
    </div>
    <div className="mb-4 text-sm">Are you sure you want to cancel Order #{cancelAlert.id}?</div>
    <div className="flex space-x-2">
      <button
        onClick={() => handleCancelOrder(cancelAlert.id)}
        disabled={loadingCancel}
        className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5"
      >
        {loadingCancel ? "Deleting..." : "Yes, Delete"}
      </button>
      <button
        onClick={() => setCancelAlert(null)}
        className="text-gray-800 border border-gray-800 hover:bg-gray-900 hover:text-white font-medium rounded-lg text-xs px-3 py-1.5"
      >
        Cancel
      </button>
    </div>
  </div>
)}



        <table className="w-full text-left">
          <thead className="bg-[#FD4C2A] text-white">
            <tr>
              <th className="py-3 px-4">Order no</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Tracking ID</th>
              <th className="py-3 px-4">Delivery Date</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
          {currentOrders.map((order) => (
              <tr key={order.id} className={`border-b ${getRowColor(order.status)}`}>
                <td className="py-4 px-4">{order.id}</td>
                <td className="py-4 px-4 text-[#FD4C2A] underline">
                <button
    onClick={() => {
      setSelectedOrder(order);
      setShowItemsModal(true);
    }}
    className="hover:underline"
  >
   View Items
  </button>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${statusColor[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-4">
  {order.status === 'UNCOMPLETED' ||order.status ==='CANCELLED' ? (
    <span className="text-gray-400 cursor-not-allowed underline">Tracking disabled</span>
  ) : (
    <a href={`/client/order/track/${order.id}`} className="text-[#FD4C2A] underline">
      Track Order
    </a>
  )}
</td>

                <td className="py-4 px-4">
                  <div>{formatDate(order.orderDate)}</div>
                  <div className="text-xs text-gray-400">(Expected)</div>
                </td>
                <td className="py-4 px-4">{order.totalPrice.toFixed(2)}</td>
                <td className="py-4 px-4 flex flex-col gap-1">
                  {(order.status === 'UNCOMPLETED') && (
                    <>
                      <button
  onClick={() => navigate(`/client/order/checkout/${order.id}`)}
  className="text-red-500 text-sm font-semibold hover:underline flex items-center gap-1"
>
  Complete Order
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
</button>

<button
  onClick={() => setCancelAlert(order)}
  className="text-red-500 text-sm font-semibold hover:underline flex items-center gap-1"
>
  Cancel Order
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
</button>

                    </>
                  )}
                  {(order.status === 'COMPLETED' || order.status === 'ACCEPTED')&& (
                    <button
  onClick={() => setCancelAlert(order)}
  className="text-red-500 text-sm font-semibold hover:underline flex items-center gap-1"
>
  Cancel Order
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showItemsModal && selectedOrder && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-[#FD4C2A]">Order Details - #{selectedOrder.id}</h2>
        <button
          onClick={() => setShowItemsModal(false)}
          className="text-gray-600"
        >
          X
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

      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-[#FD4C2A] text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
