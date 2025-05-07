import { Route, Routes, useLocation } from "react-router-dom";
import TabOrders from "../composante/Admin/TabOrders/TabOrders";
import TabClient from "../composante/Admin/TabClient/TabClient";
import TabRestaurant from "../composante/Admin/TabRestaurant/TabRestaurant";
import SideBar from "../composante/Admin/SideBar/SideBar";
import Signin from "../composante/Admin/Signin/Signin";
import Food from "../composante/Admin/Food/Food";
import Dashboard from "../composante/Admin/Dashboard/Dashboard";
import IncomingNotif from "../composante/Admin/IncomingNotif/IncomingNotif";

function AppAdmin() {
  const location = useLocation();
  const path = location.pathname;

  const showSidebar = path.startsWith("/admin") && path !== "/admin/signin" ;


  return (
    <div style={{ display: "flex" }}>
      {showSidebar && <SideBar />}
      <IncomingNotif/>
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/admin/Signin" element={<Signin/>}/>
          <Route path="/admin" element={<TabOrders />} />
          <Route path="/admin/TabOrders" element={<TabOrders />} />
          <Route path="/admin/Tabclient" element={<TabClient />} />
          <Route path="/admin/TabRestaurant" element={<TabRestaurant />} />
          <Route path="/admin/Food" element={<Food />} />
          <Route path="/admin/Dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default AppAdmin;
