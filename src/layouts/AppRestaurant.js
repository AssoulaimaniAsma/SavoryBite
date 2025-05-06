import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useRef } from "react";
import { CartProvider } from "../composante/Client/CartContext/CartContext";
import SigninRestaurant from "../composante/Restaurant/SigninRestaurant/SigninRestaurant";
import SignupRestaurant from "../composante/Restaurant/SignupRestaurant/SignupRestaurant";
import VerifyAccountRestaurant from "../composante/Restaurant/VerifyAccountRestaurant/VerifyAccountRestaurant";
import Navbar_Restaurant from "../composante/Restaurant/Navbar_Restaurant/Navbar_Restaurant";
import Menu_Restaurant from "../composante/Restaurant/Menu_Restaurant/Menu_Restaurant";
import AccountSettings from "../composante/Restaurant/Account_settings/account_settings";
import AddFood from "../composante/Restaurant/AddFood/addfood";
import ItemDetails from "../composante/Restaurant/ItemDetails/itemDetail";
import DeleteItem from "../composante/Restaurant/DeleteItem/DeleteItem";
import EditFood from "../composante/Restaurant/EditItem/EditItem";
import RestaurantAddresses from "../composante/Restaurant/Address/RestaurantAddresses";
import Delivery from "../composante/Restaurant/Delivery/Delivery";
import Orders from "../composante/Restaurant/Order/Order";
import IncomingNotifications from "../composante/Restaurant/Order/IncomingOrder";
import "./App.css";
import Notification from "../composante/Restaurant/Order/Notification";
import Dashboard from "../composante/Restaurant/Dashboard/dashbord";
import Setup from "../composante/Restaurant/SigninRestaurant/setupnotcomplet";
import Success from "../composante/Restaurant/SigninRestaurant/succes";
import Failed from "../composante/Restaurant/SigninRestaurant/failed";
// Layout avec Navbar fixe
const RestaurantLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 fixed top-0 left-0 h-full z-10">
        <Navbar_Restaurant />
      </div>
      <div className="flex-1 ml-64 p-4">
        {children}
      </div>
    </div>
  );
};

// Gestion des routes avec animation
function AnimatedRoutes() {
  const location = useLocation();
  const nodeRef = useRef(null);

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.pathname}
        classNames="fade"
        timeout={300}
        nodeRef={nodeRef}
      >
        <div ref={nodeRef}>
          <Routes location={location}>
            {/* Pages sans layout (pas de sidebar) */}
            <Route
              path="/restaurant/SigninRestaurant"
              element={<SigninRestaurant />}
            />
            <Route
              path="/restaurant/SignupRestaurant"
              element={<SignupRestaurant />}
            />
            <Route
              path="/restaurant/VerifyAccountRestaurant"
              element={<VerifyAccountRestaurant />}
            />

            {/* Pages avec layout/sidebar */}
            <Route
              path="/restaurant"
              element={
                <RestaurantLayout>
                  <Menu_Restaurant />
                </RestaurantLayout>
              }
            />
            <Route
              path="/restaurant/account_settings"
              element={
                <RestaurantLayout>
                  <AccountSettings />
                </RestaurantLayout>
              }
            />
            <Route
              path="/restaurant/account_settings/address"
              element={
                <RestaurantLayout>
                  <RestaurantAddresses />
                </RestaurantLayout>
              }
            />
            <Route
              path="/restaurant/addfood"
              element={
                <RestaurantLayout>
                  <AddFood />
                </RestaurantLayout>
              }
            />
            <Route
              path="/restaurant/itemDetail/:foodId"
              element={
                <RestaurantLayout>
                  <ItemDetails />
                </RestaurantLayout>
              }
            />
            <Route
              path="/restaurant/delete/:foodId"
              element={
                <RestaurantLayout>
                  <DeleteItem />
                </RestaurantLayout>
              }
            />
            <Route
              path="/restaurant/edit/:foodId"
              element={
                <RestaurantLayout>
                  <EditFood />
                </RestaurantLayout>
              }
            />
            <Route
              path="/restaurant/order"
              element={
                <RestaurantLayout>
                  <Orders />
                </RestaurantLayout>
              }
            />
            <Route
              path="/restaurant/delivery"
              element={
                <RestaurantLayout>
                  <Delivery />
                </RestaurantLayout>
              }
            />
            <Route
              path="/restaurant/incoming-notifications"
              element={
                <RestaurantLayout>
                  <IncomingNotifications />
                </RestaurantLayout>
              }
            />
            <Route
              path="/restaurant/dashboard"
              element={
                <RestaurantLayout> <Dashboard />  </RestaurantLayout>
             }
            />
            <Route
              path="/restaurant/SetupStripe"
              element={
                 <Setup /> 
             }
            />
             <Route
              path="/restaurant/stripe/success"
              element={<Success/>}
            />
            <Route
              path="/restaurant/stripe/failed"
              element={<Failed/>}
            />
          </Routes>
          
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}


// App parent
function AppRestaurant() {
  return (
    <CartProvider>
      <Notification />  
      <AnimatedRoutes />
    </CartProvider>
  );
}

export default AppRestaurant;
