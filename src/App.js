// src/App.js
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./composante/Client/CartContext/CartContext";
import AppClient from "./layouts/AppClient";
import AppRestaurant from "./layouts/AppRestaurant";
import AppAdmin from "./layouts/AppAdmin";
import ChooseRole from "./ChooseRole"; // à créer
import { AuthProvider } from "./contexts/AuthContext";
import ScrollToTop from "./ScrollTop"; // Assurez-vous d'importer le composant ScrollToTop
function RoutesManager() {
  const location = useLocation();
  const path = location.pathname;

  if (path.startsWith("/restaurant")) return <AppRestaurant />;
  if (path.startsWith("/client")) return <AppClient />;
  if (path.startsWith("/admin")) return <AppAdmin />;
  if (path.startsWith("/auth")) return <AppClient />;
  if (path.startsWith("/choose-role")) return <ChooseRole />;
  // Page d’accueil générale
  return <AppClient />;
}

function App() {
  return (
    <AuthProvider>

    <CartProvider>
      <Router>
      <ScrollToTop />

        <RoutesManager />
      </Router>
    </CartProvider>
    </AuthProvider>

  );
}

export default App;
