import React, { useEffect, useState } from "react";
import axios from "axios";
import UserAddresses from "./UserAddresses"; // Ton composant d'affichage
import AddressForm from "./AddressForm";     // Ton formulaire déjà prêt

const AddressManager = () => {
  const [hasAddress, setHasAddress] = useState(null); // null = en chargement
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    axios
      .get("http://localhost:8080/user/address/hasAddress", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => setHasAddress(true)) // Si 200 OK
      .catch(() => setHasAddress(false)); // Sinon
  }, []);

  if (hasAddress === null) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>; // Chargement
  }

  return hasAddress ? (
    <UserAddresses />
  ) : (
    <AddressForm isEditable="true" />
  );
};

export default AddressManager;
