import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, CartesianGrid, XAxis, YAxis, BarChart, Bar, ResponsiveContainer } from "recharts";

function Dashboard() {
    const [Dash, setDash] = useState(null);
    const navigate = useNavigate();
    const fetchTotals = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate("/admin/signin");
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/admin/dashboard", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setDash(data);
            } else {
                const errorData = await res.json();
                console.error("Server error:", errorData);
            }
        } catch (error) {
            console.error("Network or parsing error:", error);
        }
    };

    useEffect(() => {
        fetchTotals();
    }, []);

    if (!Dash) return <div className="text-center text-lg py-12">Loading ...</div>;

    const {
        userStatistics,
        restaurantStatistics,
        foodStatistics,
        orderStatistics,
        revenueStatistics,
    } = Dash;

    const PieData1 = [
        { name: "Verified", value: userStatistics.verifiedUserCount },
        { name: "Banned", value: userStatistics.bannedUserCount },
        { name: "Others", value: userStatistics.totalUserCount - (userStatistics.verifiedUserCount + userStatistics.bannedUserCount) },
    ];

    const PieData2 = [
        { name: "Verified", value: restaurantStatistics.verifiedRestaurantCount },
        { name: "Banned", value: restaurantStatistics.bannedRestaurantCount },
        { name: "Declined", value: restaurantStatistics.declinedRestaurantCount },
        { name: "Pending", value: restaurantStatistics.pendingRestaurantCount },
        { name: "Approved", value: restaurantStatistics.approvedRestaurantCount },
        { name: "Others", value: restaurantStatistics.totalRestaurantCount - (
            restaurantStatistics.declinedRestaurantCount +
            restaurantStatistics.pendingRestaurantCount +
            restaurantStatistics.approvedRestaurantCount +
            restaurantStatistics.verifiedRestaurantCount +
            restaurantStatistics.bannedRestaurantCount
        ) },
    ];

    const PieData3 = [
        { name: "Unflagged", value: foodStatistics.totalUnflaggedFood },
        { name: "Flagged", value: foodStatistics.totalFlaggedFood },
        { name: "Others", value: foodStatistics.totalFoodCount - (foodStatistics.totalUnflaggedFood + foodStatistics.totalFlaggedFood) },
    ];

    const COLORS1 = ["#4CAF50", "#FF8A65", "#D2D2D0"];
    const COLORS2 = ["#4CAF50", "#FF8A65", "#F0F000", "#0000FF", "#2A9CFD", "#D2D2D0"];
    const COLORS3 = ["#4CAF50", "#FF8A65", "#D2D2D0"];

    return (
        <div className="ml-72 pl-8 pr-6 pt-16 w-[calc(100%-288px)] min-h-screen lg:pl-6 lg:pr-8 md:ml-60 md:w-[calc(100%-240px)] sm:ml-0 sm:w-full sm:px-4">
        <div className="mx-auto px-6 py-8 max-w-[1200px] w-full box-border">
            <h2 className="text-[#FD4C2A] text-2xl md:text-3xl font-bold text-center my-6">Dashboards Overview</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-center gap-5 my-8 w-full">
                <button className="bg-[#FD4C2A] text-white border-none rounded-xl p-5 text-base cursor-pointer transition-all duration-300 hover:bg-[#FF7043] hover:scale-[1.03] shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] w-full h-40 flex flex-col justify-center items-center">
                    <span className="text-white mb-3 font-bold text-sm sm:text-base text-center">Total Users:</span>
                    <span className="text-white font-bold text-lg sm:text-xl">{userStatistics.totalUserCount}</span>
                </button>
                <button className="bg-[#FD4C2A] text-white border-none rounded-xl p-5 text-base cursor-pointer transition-all duration-300 hover:bg-[#FF7043] hover:scale-[1.03] shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] w-full h-40 flex flex-col justify-center items-center">
                    <span className="text-white mb-3 font-bold text-sm sm:text-base text-center">Total Restaurants:</span>
                    <span className="text-white font-bold text-lg sm:text-xl">{restaurantStatistics.totalRestaurantCount}</span>
                </button>
                <button className="bg-[#FD4C2A] text-white border-none rounded-xl p-5 text-base cursor-pointer transition-all duration-300 hover:bg-[#FF7043] hover:scale-[1.03] shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] w-full h-40 flex flex-col justify-center items-center">
                    <span className="text-white mb-3 font-bold text-sm sm:text-base text-center">Total Food Items:</span>
                    <span className="text-white font-bold text-lg sm:text-xl">{foodStatistics.totalFoodCount}</span>
                </button>
                <button className="bg-[#FD4C2A] text-white border-none rounded-xl p-5 text-base cursor-pointer transition-all duration-300 hover:bg-[#FF7043] hover:scale-[1.03] shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] w-full h-40 flex flex-col justify-center items-center">
                    <span className="text-white mb-3 font-bold text-sm sm:text-base text-center">Total Orders:</span>
                    <span className="text-white font-bold text-lg sm:text-xl">{orderStatistics.totalOrderCount}</span>
                </button>
                <button className="bg-[#FD4C2A] text-white border-none rounded-xl p-5 text-base cursor-pointer transition-all duration-300 hover:bg-[#FF7043] hover:scale-[1.03] shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] w-full h-40 flex flex-col justify-center items-center">
                    <span className="text-white mb-3 font-bold text-sm sm:text-base text-center">Total Revenue:</span>
                    <span className="text-white font-bold text-lg sm:text-xl">{revenueStatistics.totalRevenue} DH</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-6 w-full mb-6">
    {/* User Status Pie Chart */}
    <div className="bg-white rounded-xl p-4 shadow-[0_4px_8px_rgba(0,0,0,0.1)] w-full max-w-[380px]">
        <h3 className="text-[#FD4C2A] text-xl font-bold text-center mb-4">User Status</h3>
        <div className="flex flex-col h-full">
            {/* Legend at top */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
                {PieData1.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                        <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: COLORS1[index % COLORS1.length] }}
                        />
                        <span className="text-sm">{entry.name}</span>
                    </div>
                ))}
            </div>
            
            {/* Pie chart at bottom */}
            <div className="flex-1">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={PieData1}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label
                        >
                            {PieData1.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS1[index % COLORS1.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>

    {/* Restaurant Status Pie Chart */}
    <div className="bg-white rounded-xl p-4 shadow-[0_4px_8px_rgba(0,0,0,0.1)] w-full max-w-[380px]">
        <h3 className="text-[#FD4C2A] text-xl font-bold text-center mb-4">Restaurant Status</h3>
        <div className="flex flex-col h-full">
            {/* Legend at top */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
                {PieData2.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                        <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: COLORS2[index % COLORS2.length] }}
                        />
                        <span className="text-sm">{entry.name}</span>
                    </div>
                ))}
            </div>
            
            {/* Pie chart at bottom */}
            <div className="flex-1">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={PieData2}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {PieData2.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>

    {/* Food Status Pie Chart */}
    <div className="bg-white rounded-xl p-4 shadow-[0_4px_8px_rgba(0,0,0,0.1)] w-full max-w-[380px]">
        <h3 className="text-[#FD4C2A] text-xl font-bold text-center mb-4">Food Status</h3>
        <div className="flex flex-col h-full">
            {/* Legend at top */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
                {PieData3.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                        <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: COLORS3[index % COLORS3.length] }}
                        />
                        <span className="text-sm">{entry.name}</span>
                    </div>
                ))}
            </div>
            
            {/* Pie chart at bottom */}
            <div className="flex-1">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={PieData3}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {PieData3.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS3[index % COLORS3.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
</div>

            <div className="grid grid-cols-1 lg:grid-cols-2 justify-items-center gap-6 w-full">
                <div className="bg-white rounded-xl p-5 shadow-[0_4px_8px_rgba(0,0,0,0.1)] w-full max-w-[600px] min-h-[350px]">
                    <h3 className="text-[#FD4C2A] text-xl font-bold text-center mb-5">Weekly Order Statistics</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={orderStatistics.weeklyOrderStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="weekLabel" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="declinedOrdersCount" stroke="#FF8A65" name="Declined Orders" />
                            <Line type="monotone" dataKey="deliveredOrdersCount" stroke="#4CAF50" name="Delivered Orders" />
                            <Line type="monotone" dataKey="cancelledOrdersCount" stroke="#2196F3" name="Cancelled Orders" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-[0_4px_8px_rgba(0,0,0,0.1)] w-full max-w-[600px] min-h-[350px]">
                    <h3 className="text-[#FD4C2A] text-xl font-bold text-center mb-5">Monthly Revenue</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={revenueStatistics.monthlyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" fill="#8884d8" name="Revenue (Dh)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Dashboard;