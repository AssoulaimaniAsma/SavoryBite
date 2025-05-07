import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, CartesianGrid, XAxis, YAxis, BarChart, Bar} from "recharts";
import "./Dashboard.css";

function Dashboard(){
    const [Dash,setDash]=useState(null);
    const navigate =useNavigate();
    const fetchTotals = async()=>{
        const token=localStorage.getItem('authToken');
        if(!token) 
            {
                navigate("/admin/signin");
                return;
            }

        try{
            const res = await fetch("http://localhost:8080/admin/dashboard",{
                method:"GET",
                headers:{
                    Authorization:`Bearer ${token}`,
                },
        });
        if(res.ok){
            const data = await res.json();
            setDash(data);
        }else {
            const errorData = await res.json();
            console.error("Erreur server :", errorData);
        }
        }catch (error) {
            console.error("erreur reseau ou parsing", error);
        }
    };
    useEffect(() => {
        fetchTotals();
      }, []);

      if(!Dash) return <div>Loading ...</div>
      const {
        userStatistics,
        restaurantStatistics,
        foodStatistics,
        orderStatistics,
        revenueStatistics,
      } = Dash;
      const PieData1 = [
        { name:"Verified", value: userStatistics.verifiedUserCount },
        { name:"Banned", value: userStatistics.bannedUserCount },
        { name:"Others", value: userStatistics.totalUserCont - (userStatistics.verifiedUserCont + userStatistics.bannedUserCount ),
        },
      ];
      const PieData2 = [
        { name:"Verified", value: restaurantStatistics.verifiedRestaurantCount },
        { name:"Banned", value: restaurantStatistics.bannedRestaurantCount },
        { name:"Declined", value: restaurantStatistics.declinedRestaurantCount },
        { name:"Pending", value: restaurantStatistics.pendingRestaurantCount },
        { name:"Approved", value: restaurantStatistics.approvedRestaurantCount },
        { name:"Others", value: restaurantStatistics.totalRestaurantCont - (restaurantStatistics.declinedRestaurantCount + restaurantStatistics.pendingRestaurantCount + restaurantStatistics.approvedRestaurantCount + restaurantStatistics.verifiedRestaurantCont + restaurantStatistics.bannedRestaurantCount ),
        },
      ];
      const PieData3 = [
        { name:"Unflagged", value: foodStatistics.totalUnflaggedFood },
        { name:"Flagged", value: foodStatistics.totalFlaggedFood },
        { name:"Others", value: foodStatistics.totalFoodCont - (foodStatistics.totalUnflaggedFood + userStatistics.totalFlaggedFood ),
        },
      ];
      const COLORS1 = ["#4CAF50", "#FF8A65", "#D2D2D0"];
      const COLORS2 = ["#4CAF50", "#FF8A65", "#F0F000", "#0000FF" ,"#2A9CFD" ,"#D2D2D0"];
      const COLORS3 = ["#4CAF50", "#FF8A65", "#D2D2D0"];
    return (
        <div className="DashBoardContainer">
            <h2 className="Dashboards">Dashboards Overview</h2>
            <div className="stats-button ">
                <button className="stat-button1"><span className="TitleButton">Total Users:</span><span className="RsultButton"> {userStatistics.totalUserCount}</span></button>

                <button className="stat-button"><span className="TitleButton">Total Restaurants:</span><span className="RsultButton"> {restaurantStatistics.totalRestaurantCount}</span></button>
                    <button className="stat-button"><span className="TitleButton">Total Food Items:</span><span className="RsultButton"> {foodStatistics.totalFoodCount}</span></button>

                    <button className="stat-button"><span className="TitleButton">Total Orders:</span><span className="RsultButton"> {orderStatistics.totalOrderCount}</span></button>
                    <button className="stat-button"><span className="TitleButton">Total Revenue:</span><span className="RsultButton"> {revenueStatistics.totalRevenue} </span>DH</button>
            </div>
            <div className="PieChartsContainer">
                
            <div className="PieChartRestaurant">
                <h3 className="RestaurantStatus">Restaurant Status</h3>
                <PieChart width={400} height={300}>
                    <Pie data={PieData2} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                        fill="#8884d8" dataKey="value">
                        {PieData2.map((entry, index)=>(
                            <Cell key={`cell-${index}`}
                            fill={COLORS2[index % COLORS2.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip/>
                    <Legend layout="vertical" align="right" verticalAlign="middle"/>
                </PieChart>
            </div>
            <div className="PieChartUser">
               <h3 className="UserStatus">
               User Status </h3> 
                <PieChart width={400} height={300}>
                    <Pie data={PieData1} cx="50%" cy="50%" label outerRadius={100}
                        fill="#8884d8" dataKey="value">
                        {PieData1.map((entry, index)=>(
                            <Cell key={`cell-${index}`}
                            fill={COLORS1[index % COLORS1.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip/>
                    <Legend layout="vertical" align="right" verticalAlign="middle"/>
                </PieChart>
            </div>
            <div className="PieChartFood">
                <h3 className="FoodStatus">Food Status</h3>
                <PieChart width={400} height={300}>
                    <Pie data={PieData3} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                        fill="#8884d8" dataKey="value">
                        {PieData3.map((entry, index)=>(
                            <Cell key={`cell-${index}`}
                            fill={COLORS3[index % COLORS3.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip/>
                    <Legend layout="vertical" align="right" verticalAlign="middle"/>
                </PieChart>
            </div>
            </div>
            <div className="LineChart-BarChart">
                <div className="LineChartOrders">
                    <h3 className="OrderStatus">Weekly Order Statistics</h3>
                    <LineChart
                        width={600}
                        height={300}
                        data={orderStatistics.weeklyOrderStats}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="weekLabel" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="declinedOrdersCount" stroke="#FF8A65" name="Declined Orders" />
                        <Line type="monotone" dataKey="deliveredOrdersCount" stroke="#4CAF50" name="Delivered Orders" />
                        <Line type="monotone" dataKey="cancelledOrdersCount" stroke="#2196F3" name="Cancelled Orders" />
                    </LineChart>
                </div>
                <div className="BarChartRevenue">
                    <h3 className="MonthlyRevenue">Monthly Revenue</h3>
                    <BarChart
                        width={600}
                        height={300}
                        data={revenueStatistics.monthlyRevenue}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#8884d8" name="Revenue (Dh)" />
                    </BarChart>
                </div>
            </div>
        </div>
    );
}
export default Dashboard;