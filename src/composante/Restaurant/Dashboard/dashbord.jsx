import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaUtensils, FaShoppingCart, FaMoneyBillWave, FaExclamationTriangle } from 'react-icons/fa';
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/restaurant/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
          }
        });
        setData(response.data);
      } catch (error) {
        console.error("Erreur lors du fetch dashboard:", error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!data) return <div>Chargement...</div>;

  const { foodStatistics, orderStatistics, revenueStatistics } = data;

  // Données pour le Pie Chart (Flagged vs Unflagged Foods)
  const foodStatusData = [
    { name: 'Flagged', value: foodStatistics.totalFlaggedFood },
    { name: 'Unflagged', value: foodStatistics.totalUnflaggedFood }
  ];

  // Données pour le Pie Chart des statuts des commandes
  const orderStatusData = [
    { name: 'Uncompleted', value: orderStatistics.uncompletedOrderCount },
    { name: 'Accepted', value: orderStatistics.acceptedOrderCount },
    { name: 'Delivered', value: orderStatistics.deliveredOrderCount },
    { name: 'Cancelled', value: orderStatistics.cancelledOrderCount },
    { name: 'Payment Failed', value: orderStatistics.paymentFailedOrderCount },
    { name: 'Rejected', value: orderStatistics.rejectedOrderCount }
  ];
  console.log("orderStatistics", orderStatusData);
  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
  const orderStatusData2 = orderStatistics.weeklyOrderStats.map(week => ({
    weekLabel: week.weekLabel,
    CANCELLED: week.cancelledOrdersCount || 0,
    DELIVERED: week.deliveredOrdersCount || 0,
    REJECTED: week.declinedOrdersCount || 0
  }));

  return (
    <div className="p-6 space-y-8">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl shadow-md flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <FaUtensils className="text-2xl text-[#FD4C2A]" />
            <h2 className="text-lg font-bold text-[#FD4C2A]">Total Foods</h2>
          </div>
          <p className="text-2xl">{foodStatistics.totalFoodCount}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-md flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <FaShoppingCart className="text-2xl text-[#FD4C2A]" />
            <h2 className="text-lg font-bold text-[#FD4C2A]">Total Orders</h2>
          </div>
          <p className="text-2xl">{orderStatistics.totalOrderCount}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-md flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <FaMoneyBillWave className="text-2xl text-[#FD4C2A]" />
            <h2 className="text-lg font-bold text-[#FD4C2A]">Total Revenue</h2>
          </div>
          <p className="text-2xl">{revenueStatistics.totalRevenue.toFixed(2)} DH</p>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-md flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <FaExclamationTriangle className="text-2xl text-[#FD4C2A]" />
            <h2 className="text-lg font-bold text-[#FD4C2A]">Flagged Foods</h2>
          </div>
          <p className="text-2xl">{foodStatistics.totalFlaggedFood}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        {/* Container Flex pour deux graphiques côte à côte */}
        <div className="flex gap-6">
          {/* Premier Donut Chart */}
          <div className="w-1/2">
            <h2 className="text-xl font-bold mb-4 text-[#FD4C2A]">Food Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={foodStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50} // Donut
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {foodStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Deuxième Donut Chart modifié pour les statuts des commandes */}
          <div className="w-1/2">
            <h2 className="text-xl font-bold mb-4 text-[#FD4C2A]">Order Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData} // Utilisation des données de statuts de commande
                  cx="50%"
                  cy="50%"
                 
                  outerRadius={80}
                  fill="#82ca9d"
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`second-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

       {/* Revenue Bar Chart (modifié) */}
       <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-[#FD4C2A]">Revenue per Month</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueStatistics.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

{/* Order Status Line Chart (modifié) */}
{/* Order Status Line Chart (modifié) */}
<div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-[#FD4C2A]">Order Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={orderStatusData2}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="weekLabel" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="CANCELLED" stroke="#82ca9d" strokeWidth={2} />
            <Line type="monotone" dataKey="DELIVERED" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="REJECTED" stroke="#ff6666" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
{/* Top Selling Foods (inchangé) */}
<div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-[#FD4C2A]">Top Selling Foods</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {foodStatistics.topSellingFoods.map((food) => (
    <div key={food.id} className="p-4 border rounded-lg">
      <img
        src={food.image}
        alt={food.title}
        className="w-full h-32 object-cover rounded-md mb-2"
      />
      <h3 className="text-lg font-semibold">{food.title}</h3>
      <p className="text-sm text-gray-600">{food.categoryTitles.join(", ")}</p>
      <p className="text-sm">{food.discountedPrice.toFixed(2)} DH</p>
      
      {/* Number of times sold */}
      <p className="text-sm font-semibold mt-2">
        <span style={{ color: '#FD4C2A' }}>
          {food.sold} times sold
        </span>
      </p>
    </div>
  ))}
</div>

      </div>

      {/* Top Big Orders (inchangé) */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-[#FD4C2A]">Top Big Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Client</th>
                <th className="px-4 py-2">Total Price</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orderStatistics.topBigOrders.map((order) => (
                <tr key={order.id}>
                  <td className="border px-4 py-2">{order.id}</td>
                  <td className="border px-4 py-2">{order.courier?.fullName || "N/A"}</td>
                  <td className="border px-4 py-2">{order.totalPrice.toFixed(2)} DH</td>
                  <td className="border px-4 py-2">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;