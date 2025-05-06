import { BrowserRouter as Router, Routes, Route, useLocation ,matchPath  } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useRef } from "react";
import Signin from "../composante/Client/Signin/signin";
import Signup from "../composante/Client/Signup/signup";
import Navbar from "../composante/Client/Navbar/Navbar";
import ContactForm from "../composante/Client/feed_back/feed_back";
import Home from "../composante/Client/home/Home";
import Our_Menu from "../composante/Client/Our_Menu/Our_Menu";
import AccountSettings from "../composante/Client/Account_Setting/Account_Setting";
import CartPage from "../composante/Client/CartPage/CartPage";
import History from "../composante/Client/History/History";
import Checkout from "../composante/Client/Checkout/Checkout";
import ItemCard from "../composante/Client/Our_Menu/ItemCard";
import VerifyAccount from "../composante/Client/VerifyAccount/VerifyAccount";
import { CartProvider } from "../composante/Client/CartContext/CartContext";
import ForgotPasswordForm from "../composante/Reset/ForgotPasswordForm";
import ResetPasswordForm from "../composante/Reset/ResetPasswordForm";
import AddressForm from "../composante/Client/Address/AddressForm";
import UserAddresses from "../composante/Client/Address/UserAddresses";
import EditAddress from "../composante/Client/Address/EditAddress";
import ShowAddress from "../composante/Client/Address/ShowAddress";
import FoodByRestaurant from "../composante/Client/FoodByRestaurant/FoodByRestaurant";
import "./App.css";
import ScrollToTop from "./ScrollToTop";
import PaymentMethods from "../composante/Client/Payment/payment";
import OrderHistory from "../composante/Client/OrderHistory/orderhistory";
import ClientOrderNotifications from "../composante/Client/OrderHistory/NotificationClient";
import OrderTracking from "../composante/Client/OrderTracking/ordertracking";
function AnimatedRoutes() {
  const location = useLocation();
  const signinRef = useRef(null);
  const signupRef = useRef(null);
  const contactRef = useRef(null);
  const homeRef = useRef(null);
  const accountRef = useRef(null);
  const cartePageRef= useRef(null);
  const ourmenuRef= useRef(null);
  const itemCardRef=useRef(null);
  const historyRef= useRef(null);
  const checkoutRef=useRef(null);
  const verifyRef=useRef(null);
  const resetRef = useRef(null);
  const forgetRef=useRef(null);
  const addresRef= useRef(null);
  const useraddressRef= useRef(null);
  const editaddressRef= useRef(null);
  const showaddressRef= useRef(null);
  const foodbyrestRef = useRef(null);
  const paymentRef= useRef(null);
  const orderhistoryRef= useRef(null);
  const clientOrderRef= useRef(null);
  const ordertrackingRef= useRef(null);
    return (
    <TransitionGroup>
      <CSSTransition 
        key={location.pathname} 
        classNames="fade" 
        timeout={500} 
        nodeRef={
          location.pathname === "/signup" ? signupRef :  
          location.pathname === "/contact" ? contactRef : 
          location.pathname === "/signin" ? signinRef :
          location.pathname === "/account" ? accountRef :
          location.pathname === "/CartPage" ? cartePageRef : 
          location.pathname ==="/Our_Menu"  ? ourmenuRef:
          location.pathname === "/History" ? historyRef : 
          location.pathname ==="/SideBar"  ? ourmenuRef:
          location.pathname ==="/Checkout"  ? checkoutRef:
          location.pathname ==="/ItemCard/:id"  ? itemCardRef:
          location.pathname==="/VerifyAccount" ? verifyRef:
          location.pathname==="/auth/ForgotPasswordForm" ? forgetRef:
          location.pathname==="/auth/resetPassword" ? resetRef:
          location.pathname==="/client/Address/:isEditable" ? addresRef:
          location.pathname==="/client/allAddress" ? useraddressRef:
          location.pathname==="/client/Address/edit/:id" ? editaddressRef:
          location.pathname==="/client/Address/show/:id" ? showaddressRef:
          location.pathname==="/client/restaurants/:id" ? forgetRef:
          location.pathname==="/client/ManagePayment" ? paymentRef:
          location.pathname==="/client/OrderHistory" ? orderhistoryRef:
         // location.pathname==="/client/OrderHistory/NotificationClient" ? clientOrderRef:
         location.pathname==="/client/order/track/:orderID" ? ordertrackingRef:
          homeRef
          
        }
      >
        <div ref={
          location.pathname === "/signup" ? signupRef :  
          location.pathname === "/contact" ? contactRef : 
          location.pathname === "/signin" ? signinRef :
          location.pathname === "/account" ? accountRef :
          location.pathname === "/CartPage" ? cartePageRef : 
          location.pathname ==="/Our_Menu"  ? ourmenuRef:
          location.pathname ==="/Our_Menu/:category"  ? ourmenuRef: 
          location.pathname === "/History" ? historyRef :
          location.pathname ==="/SideBar"  ? ourmenuRef:
          location.pathname ==="/Checkout"  ? checkoutRef:
          location.pathname ==="/ItemCard/:id"  ? itemCardRef:
          location.pathname==="/VerifyAccount" ? verifyRef:
          location.pathname==="auth/ForgotPasswordForm" ? forgetRef:
          location.pathname==="/auth/resetPassword" ? resetRef:
          location.pathname==="/client/Address/:isEditable" ? addresRef:
          location.pathname==="/client/allAddress" ? useraddressRef:
          location.pathname==="/client/Address/edit/:id" ? editaddressRef:
          location.pathname==="/client/Address/show/:id" ? showaddressRef:
          location.pathname==="/client/restaurants/:id" ? forgetRef:
          location.pathname==="/client/ManagePayment" ? paymentRef:
          location.pathname==="/client/OrderHistory" ? orderhistoryRef:
          location.pathname==="/client/order/track/:orderID" ? ordertrackingRef:
          //location.pathname==="/client/OrderHistory/NotificationClient" ? clientOrderRef:
          homeRef
        }>
          <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/client" element={<Home />} />
          <Route path="/client/signin" element={<Signin />} />
          <Route path="/client/signup" element={<Signup />} />
          <Route path="/client/contact" element={<ContactForm />} />
          <Route path="/client/CartPage" element={<CartPage />} />
          <Route path="/client/account" element={<AccountSettings />} />
          <Route path="/client/Our_Menu" element={<Our_Menu />} />
          <Route path="/client/ItemCard/:id" element={<ItemCard />} />
          <Route path="/client/history/:userId" element={<History />} />
          <Route path="/client/Checkout" element={<Checkout />}/>
          <Route path="/client/verifyAccount" element={<VerifyAccount />}/>
          <Route path="/auth/resetPassword" element={<ResetPasswordForm />}/>
          <Route path="/auth/ForgotPasswordForm" element={<ForgotPasswordForm />}/>
          <Route path="/client/Address/:isEditable" element={<AddressForm />}/>
          <Route path="/client/allAddress" element={<UserAddresses />}/>
          <Route path="/client/ManagePayment" element={<PaymentMethods/>}/>
          <Route path="/client/Address/edit/:id" element={<EditAddress />}/>
          <Route path="/client/Address/show/:id" element={<ShowAddress />}/>
          <Route path="/client/restaurants/:id" element={<FoodByRestaurant />}/>
          <Route path="/client/OrderHistory" element={<OrderHistory />}/>
          <Route path="/client/order/track/:orderID" element={<OrderTracking />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

function Main() {
  const location = useLocation();
  const isItemCardPage = matchPath("/client/ItemCard/:id", location.pathname); 
  return (
    <>
      {isItemCardPage && <ScrollToTop />}

{location.pathname !== "/client/signin" &&
 location.pathname !== "/client/signup" &&
 location.pathname !== "/auth/resetPassword" &&
 location.pathname !== "/auth/ForgotPasswordForm" && 
 location.pathname !== "/client/verifyAccount"
 &&<Navbar />}

<AnimatedRoutes />
    </>
  );
}

function AppClient() {
  return (
      <CartProvider>
        <ClientOrderNotifications/>
          <Main />
      </CartProvider>
  );
}

export default AppClient;