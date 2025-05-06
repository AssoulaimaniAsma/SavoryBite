import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBox, FaCheckCircle, FaUtensils, FaMotorcycle, FaHome } from 'react-icons/fa';
import { FaStore, FaMapMarkerAlt, FaTruck } from 'react-icons/fa';

const OrderTracking = () => {
  const { orderID } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const steps = [
    { 
      key: 'placedAt', 
      label: 'Ordered', 
      icon: <FaBox className="text-2xl" />,
      activeIcon: <FaBox className="text-2xl text-white" />
    },
    { 
      key: 'acceptedAt', 
      label: 'Packed', 
      icon: <FaCheckCircle className="text-2xl" />,
      activeIcon: <FaCheckCircle className="text-2xl text-white" />
    },
    { 
      key: 'preparationStartedAt', 
      label: 'Preparing', 
      icon: <FaUtensils className="text-2xl" />,
      activeIcon: <FaUtensils className="text-2xl text-white" />
    },
    { 
      key: 'pickedUpAt', 
      label: 'In Transit', 
      icon: <FaMotorcycle className="text-2xl" />,
      activeIcon: <FaMotorcycle className="text-2xl text-white" />
    },
    { 
      key: 'deliveredAt', 
      label: 'Delivered', 
      icon: <FaHome className="text-2xl" />,
      activeIcon: <FaHome className="text-2xl text-white" />
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    axios.get(`http://localhost:8080/user/orders/track?orderID=${orderID}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setOrder(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [orderID]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );

  if (!order) return (
    <div className="text-center py-10 text-red-500">
      Order not found.
    </div>
  );

  // Trouver l'index de l'étape actuelle
  const currentStepIndex = steps.findIndex(step => order[step.key] && 
    (step.key === 'deliveredAt' || !order[steps[steps.findIndex(s => s.key === step.key) + 1]?.key]));

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-[#FD4C2A] mb-4">Order Information</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Order ID:</span> #{order.id}</p>
            <p><span className="font-medium">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                'bg-orange-100 text-orange-800'
              }`}>
                {order.status}
              </span>
            </p>
            <div className="mt-4">
              <p className="font-medium">Items:</p>
              <ul className="mt-2 space-y-1">
                {order.orderShortDTO.items.map(item => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.quantity}x {item.food.title}</span>
                    <span>{item.priceAtOrderTime.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-2 border-t border-gray-200 font-medium flex justify-between">
                <span>Total:</span>
                <span>{order.orderShortDTO.totalPrice.toFixed(2)}DH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-[#FD4C2A] mb-4">Delivery Details</h3>
          <div className="space-y-4">
  <div className="flex items-start gap-3">
    <div className="p-2 bg-orange-100 rounded-full text-orange-600">
      <FaStore className="text-lg" />
    </div>
    <div>
      <p className="font-medium text-gray-700 flex items-center gap-2">
       
        Pickup Location
      </p>
      <p className="mt-1 font-medium">{order.pickupLocation.title}</p>
      <p className="text-sm text-gray-600">
        {order.pickupLocation.commune}, {order.pickupLocation.province}
      </p>
    </div>
  </div>

  <div className="flex items-start gap-3">
    <div className="p-2 bg-green-100 rounded-full text-green-600">
      <FaHome className="text-lg" />
    </div>
    <div>
      <p className="font-medium text-gray-700 flex items-center gap-2">
        
        Delivery Location
      </p>
      <p className="mt-1 font-medium">{order.deliveryLocation.title}</p>
      <p className="text-sm text-gray-600">
        {order.deliveryLocation.commune}, {order.deliveryLocation.province}
      </p>
    </div>
  </div>
</div>

        </div>

        {/* Courier Info */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-[#FD4C2A] mb-4">Courier</h3>
          {order.courier ? (
            <div className="flex items-center space-x-4">
              <img 
                src={order.courier.profileImg || '/courier-placeholder.jpg'} 
                alt="Courier" 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{order.courier.fullName}</p>
                <p className="text-sm text-gray-600">{order.courier.phone}</p>
                <p className="text-sm text-gray-600">{order.courier.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No courier assigned yet</p>
          )}
        </div>
      </div>

      {/* Tracking Progress */}
      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
        <h3 className="text-xl font-semibold text-[#FD4C2A] mb-8 text-center">Order Tracking</h3>
        
        <div className="relative">
          {/* Progress line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-[#FD4C2A] -translate-y-1/2 z-0 transition-all duration-500"
            style={{ 
              width: `${(currentStepIndex / (steps.length - 1)) * 100}%` 
            }}
          ></div>

          {/* Steps */}
          <div className="relative flex justify-between z-10">
            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const hasDate = order[step.key];
              
              return (
                <div 
                  key={step.key} 
                  className="flex flex-col items-center"
                >
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      isCompleted ? 'bg-[#FD4C2A]' : 'bg-gray-200'
                    }`}
                  >
                    {isCompleted ? step.activeIcon : step.icon}
                  </div>
                  <span className={`text-sm font-medium ${
                    isCompleted ? 'text-[#FD4C2A]' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                  
                  {hasDate && (
                    <div className="relative group">
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        {new Date(order[step.key]).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("../client/OrderHistory")}
        className="mt-6 text-white bg-[#FD4C2A] hover:bg-[#e04324] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Back to Histtory
      </button>
    </div>
  );
};

export default OrderTracking;