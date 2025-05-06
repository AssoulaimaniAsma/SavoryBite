import { Route, Routes, useLocation } from "react-router-dom";
import TabOrders from "../composante/Admin/TabOrders/TabOrders";
import TabOrdersDetails from "../composante/Admin/TabOrders/TabOrdersDetails";
import TabClient from "../composante/Admin/TabClient/TabClient";
import TabRestaurant from "../composante/Admin/TabRestaurant/TabRestaurant";
import TabRestaurantDetails from "../composante/Admin/TabRestaurant/TabRestaurantDetails";
import SideBar from "../composante/Admin/SideBar/SideBar";
import Signin from "../composante/Admin/Signin/Signin";

function AppAdmin() {
  const location = useLocation();
  const path = location.pathname;

  const showSidebar = path.startsWith("/admin") && path !== "/admin/signin" ;


  return (
    <div style={{ display: "flex" }}>
      {showSidebar && <SideBar />}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/admin/Signin" element={<Signin/>}/>
          <Route path="/admin" element={<TabOrders />} />
          <Route path="/admin/TabOrders" element={<TabOrders />} />
          <Route path="/admin/Orders/:id" element={<TabOrdersDetails />} />
          <Route path="/admin/Tabclient" element={<TabClient />} />
          <Route path="/admin/TabRestaurant" element={<TabRestaurant />} />
          <Route path="/admin/TabRestaurantDetails/:id" element={<TabRestaurantDetails />} />
        </Routes>
      </div>
    </div>
  );
}

export default AppAdmin;
