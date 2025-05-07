import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";

//import "./PersonalDetails.css";
//import "./PersOrderDetails.css";
const stripePromise = loadStripe("pk_test_51RHm1SFWUQXfDIlGmKVLISKhH3LpY6Sf9Pp4RC62PoaUcovgWn35VVnAQ5we4xhyd2oMfqz6xjixvonrppTmTFxW000z9mc5cG");
export default function PersonalDetails() {
  const navigate = useNavigate();
  const { orderID } = useParams();
  const [userDetails, setUserDetails] = useState({ transactions: [] });
  const [elementsReady, setElementsReady] = useState(false);
  const [hasAddress, setHasAddress] = useState(null);
  const [hasPayment, setHasPayment] = useState(null);
  const [isAccountIncomplete, setIsAccountIncomplete] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAddressList, setShowAddressList] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState("");
  const [showPaymentList, setShowPaymentList] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payment, setPayment] = useState([]);
  const [Foods, setFoods] = useState([]);
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [onCardSaved,setOnCardSaved]=useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [defaultAddress,setSelectedDefaultAddress] = useState(null);
  const [checkedAddress,setCheckedAddress]=useState(null);
  const token = localStorage.getItem("authToken");
  

  
  const [clientSecret, setClientSecret] = useState('');
  const [success, setSuccess] = useState(false);
  const [accountForm, setAccountForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email:"",
    oldPassword:"", 
    newPassword:""
  });

  const [addressForm, setAddressForm] = useState({
    title: "",
    region: "",
    province: "",
    commune: "",
    street: "",
    isDefault: false
  });

  const [paymentForm, setPaymentForm] = useState({
    number: "",
    expiry: "",
    cvv: "",
    setAsDefault: false,
  });
  


  useEffect(() => {
    if (!token) return navigate("/client/signin");
    fetchAddresses();
    checkAccountDetails();
    fetchCart();
  }, []);

  // Fetch cart when the component mounts
  const fetchCart = async () => {
    try {
      const res = await fetch(`http://localhost:8080/user/orders/placedOrders/${orderID}/orderItems`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch data: " + res.statusText);
      }
  
      const data = await res.json();
      console.log("Data received:", data);  // Vérifiez la structure des données
      setFoods(data);  // Update the foods state with cart data
      console.log("Foods:", data); // Afficher toute la structure des données
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    axios.get("http://localhost:8080/public/addressDetails/Regions")
      .then(res => {
        setRegions(res.data)
        console.log("region loaded",res.data);
      })
      .catch(err => console.error("Regions loading error", err));
  }, []);

  useEffect(() => {
    if (addressForm.region) {
      axios.get(`http://localhost:8080/public/addressDetails/Provinces?regionID=${addressForm.region}`)
        .then(res => setProvinces(res.data))
        .catch(err => console.error("Provinces loading error", err));
    }
  }, [addressForm.region]);

  useEffect(() => {
    if (addressForm.province) {
      axios.get(`http://localhost:8080/public/addressDetails/Communes?provinceID=${addressForm.province}`)
        .then(res => setCommunes(res.data))
        .catch(err => console.error("Communes loading error", err));
    }
  }, [addressForm.province]);

  

  const checkAccountDetails = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user/accountDetails", {
        method:"GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const accountData = response.data;
      console.log("Account data:", accountData);

      if (!accountData.firstName || !accountData.lastName || !accountData.phone) {
        setIsAccountIncomplete(true); // Mark as incomplete if necessary fields are missing
      } else {
        setIsAccountIncomplete(false); // Mark as complete if all details are there
      }

      // Update formData with fetched email (and optionally other fields if you want)
      setAccountForm(prev => ({
        ...prev,
        email: accountData.email,  // assuming the API returns { email: "user@example.com", ... }
      }));

    } catch (error) {
      console.error("Failed to fetch account details:", error);
    }
  };

  const checkAddress = async () => {
    try {
      const res = await fetch("http://localhost:8080/user/address/hasAddress", {
        method:"GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      const has = text === "User has at least one address!";
      setHasAddress(has);
  
      if (!has) {
        // Directly show the form if user has no address
        setShowAddressForm(true);
      } else {
        // Otherwise fetch and display existing addresses
        //fetchAddresses();
        setShowAddressForm(false);
      }
    } catch (error) {
      console.error("Error checking address", error);
    }
  };

  const checkPayment = async () => {
    try {
      const res = await fetch("http://localhost:8080/user/paymentMethods/hasPaymentMethod", {
        method:"GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      const has = text.trim() === "true";
      setHasPayment(has);
  
      if (!has) {
        // Directly show the form if user has no address
        setShowPaymentForm(true);
      } else {
        // Otherwise fetch and display existing addresses
        fetchPayments();
      }
    } catch (error) {
      console.error("Error checking address", error);
    }
  };
  
  

  const fetchAddresses = async () => {
    try {
      const response = await fetch("http://localhost:8080/user/address/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const responseText = await response.text();
      if (!responseText.trim()) {
        setAddresses([]);
        setShowAddressForm(true);
        setShowAddressList(false);
        return;
      }
      const data=JSON.parse(responseText);
      setAddresses(data);
      console.log("Fetched addresses:", data); // 👉 pour vérifier ce que tu reçois
      console.log("Data length:", data.length);

      const defaultAddress = data.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id); // This sets the default selection
        }

      // Automatically show form if no addresses
      if (data.length === 0) {
        setShowAddressForm(true);
        setShowAddressList(false);
      } else {
        setShowAddressList(true);
        setShowAddressForm(false);
      
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
      // Cherche l'adresse par défaut
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      // Set empty state on error
      setAddresses([]);
      setShowAddressForm(true);
      setShowAddressList(false);
    }
  };
  
  const fetchPayments = async () => {
    try {
      const response = await fetch("http://localhost:8080/user/paymentMethods/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      setPayment(data);
  
      // Automatically show form if no addresses
      if (data.length === 0) {
        setShowPaymentForm(true);
        setShowPaymentList(false);
      } else {
        const defaultPayment = data.find(p=>p.isDefault);
        if(defaultPayment){
          setSelectedPaymentId(defaultPayment.id);
        }
        setShowPaymentList(true);
          setShowPaymentForm(false);
        
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    if(!accountForm.firstName || !accountForm.lastName || !accountForm.phone){
      alert("please fill all fields");
      return;
    }
    const formDataToSend = {
      firstName: accountForm.firstName,
      lastName: accountForm.lastName,
      email: accountForm.email,
      phone: accountForm.phone,
      oldPassword: "", 
      newPassword: "",
    };
    try {
      const res = await fetch("http://localhost:8080/user/updateAccountDetails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });
      console.log("data sent to BAck",formDataToSend);
      if (!res.ok) {
        const errorResponse = await res.text(); // ou .json() si tu sais que le backend renvoie du JSON
        console.error("Server responded with:", res.status, errorResponse);
        throw new Error("Failed add account details");}
      else{
        const responseMessage = await res.text(); // Or use res.json() if your backend returns JSON
      console.log("Server message:", responseMessage);
        setIsAccountIncomplete(false);
        await fetchAddresses();
      }
      setAccountForm(prev => ({
        ...prev,
        email: accountForm.email,  // assuming the API returns { email: "user@example.com", ... }
        newPassword: accountForm.newPassword,
        oldPassword: accountForm.oldPassword,
      }));
      
    } catch (err) {
      console.error("Error while adding account details", err);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    console.log("New address submitted:", addressForm);

    const payload = {
      title: addressForm.title,
      street: addressForm.street,
      regionID: Number(addressForm.region),
      provinceID: Number(addressForm.province),
      communeID: Number(addressForm.commune),
      latitude: showCoordinates ? parseFloat(latitude) : null,
      longitude: showCoordinates ? parseFloat(longitude) : null,
      isDefault: addressForm.isDefault,
      isCoordinationActivated: showCoordinates,
      
    };
  
    // 👉 Récupérer le token
    const token = localStorage.getItem("authToken"); // ou sessionStorage, ou cookie si tu veux
  
    try {

      const response = await fetch("http://localhost:8080/user/address/addAddress", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
         },
        body: JSON.stringify(payload)
      });
      console.log("payload:",payload)
      if (response.status === 200) {
        fetchAddresses();
        setShowAddressForm(false);
      } else {
        console.log("❌ Something went wrong.");
      }
    } catch (error) {
      console.error("❌ Error submitting address:", error);
      console.log("🚨 Failed to add address. Please check your token and try again.");
    }
    };


    const setDefaultPayment = async (paymentMethodId) => {
      try {
        const response = await fetch(
          `http://localhost:8080/user/paymentMethods/${paymentMethodId}/default`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        if (!response.ok) throw new Error("Failed to set default payment");
    
        await fetchPayments(); // Refresh the list
      } catch (error) {
        console.error("Error setting default payment:", error);
        setError("Failed to set default payment method");
      }
    };

    const handleReturnP = async (e) => {
      e.preventDefault();
    setShowPaymentForm(false);
    setShowAddressForm(false);
    setShowAddressList(false);
    setShowPaymentList(true);
    };


    const AddCardForm = ({ onCardSaved, setSuccessMessage, setShowAlert }) => {
  
      useEffect(() => {
        if (!token) { 
          alert("You are not logged in. Please log in to access this page."); 
          navigate("/client/signin");
          return;
        }
      },[]);
    };
    
    
    const PaymentForm = ({ token, onCardSaved }) => {
      const stripe = useStripe();
      const elements = useElements();
      const [error, setError] = useState(null);
      const [loading, setLoading] = useState(false);
      const [paymentForm, setPaymentForm] = useState({ isDefault: false });
    
      const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setError(null);
    
        const {error, paymentMethod} = await stripe.createPaymentMethod({
          type : 'card',
          card : elements.getElement(CardElement),
        });
        const cardElement = elements.getElement(CardElement);
        if (!stripe || !elements || !cardElement) {
          setError("Stripe is not ready or CardElement missing");
          return;
        }
    
        try {
          setLoading(true);
          // Vérifier s'il y a déjà un paiement par défaut
          const hasDefault = payment.some(p => p.isDefault);
          const willBeDefault = paymentForm.isDefault && !hasDefault;
          const intentRes = await fetch(`http://localhost:8080/user/paymentMethods/setupIntent`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
    
          const { clientSecret, platformPaymentId } = await intentRes.json();
    
          const result = await stripe.confirmCardSetup(clientSecret, {
            payment_method: { card: cardElement },
          });
    
          if (result.error) {
            throw result.error;
          }
    
          const saveRes = await fetch(`http://localhost:8080/user/paymentMethods/savePaymentMethod`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              paymentMethodId: result.setupIntent.payment_method,
              platformPaymentId,
              isDefault: paymentForm.isDefault,
            }),
          });
    
          if (!saveRes.ok) throw new Error("Failed to save payment method");
    
          if (onCardSaved) onCardSaved();
          fetchPayments();
          setShowPaymentForm(false);
          setShowPaymentList(true);
    
        } catch (err) {
          console.error("Error in card submission:", err);
          setError(err.message || "Unknown error");
        } finally {
          setLoading(false);
        }
      };
    
      return (
<form onSubmit={handlePaymentSubmit} className="mb-4">
  <div className="mb-4">
    <label className="block text-gray-700 mb-2">Card Details</label>
    <CardElement
      options={{
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': { color: '#aab7c4' },
          },
          invalid: { color: '#9e2146' },
        },
      }}
    />
  </div>

  <div className="py-4">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className="w-5 h-5 cursor-pointer"
        checked={paymentForm.isDefault}
        onChange={(e) => setPaymentForm({ ...paymentForm, isDefault: e.target.checked })}
        disabled={payment.some(p => p.isDefault) && !paymentForm.isDefault}
      />
      Set as default payment method
      {payment.some(p => p.isDefault) && !paymentForm.isDefault && (
        <span className="text-gray-500 text-sm ml-1"> (A default payment already exists)</span>
      )}
    </label>
  </div>

  {error && <div className="text-red-600 mb-4">{error}</div>}
  <div className="flex gap-8 text-center justify-center mt-4">
    <button 
      type="submit" 
      className="w-2/5 bg-[#FD4C2A] text-white rounded-xl px-2.5 py-1.5 hover:shadow-inner hover:translate-y-px transition-all"
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Proceed to checkout'}
    </button>
    <button 
      type="button" 
      className="w-2/5 py-1.5 px-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 transition-all"
      onClick={handleReturnP}
    >
      Return
    </button>
  </div>
</form>
      );
    };    
    
    // Add this helper function if you need to set default
    const setDefaultPaymentMethod = async (paymentMethodId) => {
      try {
        const response = await fetch(
          `http://localhost:8080/user/paymentMethods/${paymentMethodId}/default`,
          {
            method: "PUT",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );
        if (!response.ok) throw new Error("Failed to set default payment");
      } catch (error) {
        console.error("Error setting default payment:", error);
        throw error; // Re-throw to be caught in main handler
      }
    };
    const submitAddress =async (e) =>{
      e.preventDefault();
      if (!selectedAddressId) {
        alert("Please select an address before proceeding.");
        return; 
      }else{
      console.log("address ID checked is ", selectedAddressId);
      setShowAddressForm(false);
      setShowAddressList(false);
      const hasPaymentMethods = await checkPayment();
  
      if (hasPaymentMethods) {
        await fetchPayments(); // Load the actual payment methods
        setShowPaymentList(true);
      } else {
        setShowPaymentForm(true);
      }
    }
    };
    const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);

    const submitPayment = async (e) => {
      e.preventDefault();
      
      if (!selectedPaymentId || !selectedAddressId) {
        alert("Please select a payment method before proceeding.");
        return;
      }
    
      try {
        setLoading(true);
        setError(null);
    
        const selectedPayment = payment.find(p => p.id === selectedPaymentId);
        if(!selectedPayment) {
          throw new Error("Selected payment method is Invalid");
        }
    
        console.log("Checkout request payload:", {
          orderID,
          addressID: selectedAddressId,
          paymentMethodID: selectedPaymentId
        });
    
        const response = await fetch(
          `http://localhost:8080/user/orders/placedOrders/${orderID}/checkout?addressID=${selectedAddressId}&paymentMethodID=${selectedPaymentId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        if (!response.ok) {
          let errorMessage = `Checkout failed with status ${response.status}`;
          try {
            const errorData = await response.text();
            errorMessage = errorData || errorMessage;
          } catch (e) {
            console.error("Error parsing error response:", e);
          }
          throw new Error(errorMessage);
        }
    
        // Traitez explicitement les réponses vides ou non-JSON comme des succès
        try {
          const result = await response.json();
          console.log("Checkout successful with JSON response", result);
        } catch (e) {
          console.log("Checkout successful with non-JSON response");

        }
    
        // Dans tous les cas, marquez le checkout comme réussi
        setShowPaymentForm(false);
        setShowPaymentList(false);
        //navigate(`/client/checkout/${orderID}`);
        setShowCheckoutPopup(true);

    
      } catch (error) {
        console.error("Checkout error:", error);
        setError(error.message || "Payment processing failed");
      } finally {
        setLoading(false);
      }
    };

    const PaymentFormWrapper = ({ token, onCardSaved }) => (
      <Elements stripe={stripePromise}>
        <PaymentForm token={token} onCardSaved={onCardSaved} />
      </Elements>
    );
    

  const handleChangeAccount = (e) => {
    const { name, value} = e.target;

    if (["firstName", "lastName", "phone"].includes(name)) {
      setAccountForm(prev => ({ ...prev, [name]: value }));
    } else {
      setAddressForm(prev => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (!token) return navigate("/client/signin");
    
    const fetchInitialData = async () => {
      await checkAccountDetails();
      await fetchAddresses();
      
      // First check if user has payment methods
      const hasPayment = await checkPayment();
      
      // If payment methods exist, fetch them immediately
      if (hasPayment) {
        await fetchPayments();
        setShowPaymentList(true);
      }
      
      await fetchCart();
    };
  
    fetchInitialData();
  }, [token]);

  const handleChangeAddress = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("Change detected:", name, value);
    setAddressForm(prev => ({
      ...prev,
      [name]: name === 'region' || name === 'province' || name === 'commune' ? Number(value) 
      : type === 'checkbox'
      ? checked
      : value,
    }));
  };
  const handleChangePayment = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleReturn = async(e) =>{
    e.preventDefault();
    fetchAddresses();
    setShowAddressForm(false);
  }
  const submitAccount = async (e) => {
    e.preventDefault();
    if(!accountForm.firstName || !accountForm.lastName || !accountForm.phone){
      alert("please fill all fields");
    }else{
      setAccountForm(false);
      setAddresses(true);
    }
  }

  const formatCardNumber = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setPaymentForm(prev => ({ ...prev, cardNumber: value }));
  };

  // Add this new function
const formatExpiryForDisplay = (month, year) => {
  if (!month || !year) return "N/A";
  const paddedMonth = String(month).padStart(2, '0');
  const shortYear = String(year).slice(-2);
  return `${paddedMonth}/${shortYear}`;
};
  // Format expiration date as MM/YY
  const formatExpirationDate = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setPaymentForm(prev => ({ ...prev, validThrough: value }));
  };
    const subtotal = Foods.reduce((acc, item) => acc + item.totalPrice, 0);
    const shipping = subtotal * 0.1;
    const total = Array.isArray(userDetails?.transactions)
    ? userDetails.transactions.reduce((acc, item) => acc + item.amount, 0)
    : 0;

    const hasDefaultAddress = addresses.some(addr => addr.isDefault);

  return (
    <div className="w-full flex items-start justify-center mt-5 h-screen gap-5">
{showCheckoutPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white border border-[#FD4C2A] text-center w-[90%] max-w-[600px] h-[auto] p-10 rounded-2xl relative">
      <FaCheckCircle className="text-[#10B981] inline-block text-[80px] mb-6" />
      
      <h2 className="text-3xl font-bold mb-2">Thank You!</h2>
      <p className="mb-6">Your order has been confirmed & it is on the way. Check your email<br />for the details.</p>
      
      <div className="flex justify-center gap-4">
        <button 
          onClick={() => navigate("/client")} 
          className="bg-[#FD4C2A] text-white py-2 px-6 rounded-3xl font-bold"
        >
          Go to Homepage
        </button>
        <button 
          onClick={() => navigate("/client/OrderHistory")} 
          className="border border-[#FD4C2A] text-[#FD4C2A] py-2 px-6 rounded-3xl font-bold"
        >
          Check Order Details
        </button>
      </div>

      <button 
        onClick={() => setShowCheckoutPopup(false)} 
        className="absolute top-3 right-4 text-xl text-gray-500 hover:text-black"
      >
        ×
      </button>
    </div>
  </div>
)}

<table className="w-[50%] border border-[#FD4C2A] rounded-xl overflow-hidden shadow-md ml-[300px] p-1 h-[150px]">
  <thead>
    <tr className="bg-[#FD4C2A] w-full">
      <th colSpan="2" className="text-white p-3 text-center">Personal Information</th>
    </tr>
  </thead>
  <tbody>
    {isAccountIncomplete ? (
      <tr>
        <td colSpan="2">
          <form onSubmit={handleAccountSubmit} className="space-y-3 p-3">
            <input 
              className="w-full mb-3 p-2 border rounded"
              type="text" 
              name="firstName" 
              pattern="^[A-Za-z ]+$"
              title="First name should only contain letters" 
              value={accountForm.firstName} 
              onChange={handleChangeAccount} 
              placeholder="First Name" 
              required 
            />
            <input 
              className="w-full mb-3 p-2 border rounded"
              type="text" 
              name="lastName" 
              pattern="^[A-Za-z ]+$"
              title="Last name should only contain letters" 
              value={accountForm.lastName} 
              onChange={handleChangeAccount} 
              placeholder="Last Name" 
              required 
            />
            <input 
              className="w-full mb-3 p-2 border rounded"
              type="text" 
              name="phone" 
              pattern="^(\+2126\d{8}|06\d{8}|\+2127\d{8}|07\d{8})$"
              title="Phone number must start with +2126 or 06 or +2127 or 07followed by 8 digits" 
              value={accountForm.phone} 
              onChange={handleChangeAccount} 
              placeholder="Phone Number" 
              required 
            />
            <button 
              type="submit" 
              className="bg-[#FD4C2A] text-white rounded-xl py-2 px-4 w-[40%] mx-auto block mt-8 hover:shadow-inner hover:translate-y-px transition-all"
            >
              Proceed To Next Step
            </button>
          </form>
        </td>
      </tr>
    ) : showAddressForm ? (
      <tr>
        <td colSpan="2">
          <form onSubmit={handleAddressSubmit} className="space-y-3 p-3">
            <input 
              className="w-full mb-3 p-2 border rounded"
              type="text" 
              name="title" 
              value={addressForm.title} 
              onChange={handleChangeAddress} 
              placeholder="Title (Home, Office...)" 
              required 
            />
            <input 
              className="w-full mb-3 p-2 border rounded"
              type="text" 
              name="street" 
              value={addressForm.street} 
              onChange={handleChangeAddress} 
              placeholder="Street" 
              required 
            />
            <select 
              className="w-full mb-3 p-2 border rounded"
              name="region" 
              value={addressForm.region} 
              onChange={handleChangeAddress} 
              required
            >
              <option value="">Select Region</option>
              {regions.map(r => <option key={r.id} value={r.id}>{r.regionName}</option>)}
            </select>
            <select 
              className="w-full mb-3 p-2 border rounded"
              name="province" 
              value={addressForm.province} 
              onChange={handleChangeAddress} 
              required
            >
              <option value="">Select Province</option>
              {provinces.map(p => <option key={p.id} value={p.id}>{p.provinceName}</option>)}
            </select>
            <select 
              className="w-full mb-3 p-2 border rounded"
              name="commune" 
              value={addressForm.commune} 
              onChange={handleChangeAddress} 
              required
            >
              <option value="">Select Commune</option>
              {communes.map(c => <option key={c.id} value={c.id}>{c.communeName}</option>)}
            </select>
            <label className="flex items-center gap-2 mb-4">
              <input 
                type="checkbox" 
                className="w-5 h-5"
                name="isDefault" 
                checked={addressForm.isDefault} 
                onChange={handleChangeAddress} 
                disabled={hasDefaultAddress && !addressForm.isDefault}
              />
              Set as Default address
              {hasDefaultAddress && !addressForm.isDefault && (
                <span className="text-gray-500 text-sm"> (A default address already exists)</span>
              )}
            </label>
            <div className="flex gap-16 justify-center">
              <button 
                type="submit" 
                className="bg-[#FD4C2A] text-white rounded-xl py-2 px-4 w-[40%] hover:shadow-inner hover:translate-y-px transition-all"
              >
                Submit Address
              </button>
              <button 
                type="button" 
                className="border border-gray-300 rounded-xl py-2 px-4 w-[40%] hover:bg-gray-100 transition-all"
                onClick={handleReturn}
              >
                Return
              </button>
            </div>
          </form>
        </td>
      </tr>
    ) : showAddressList ? (
      <>
        {addresses.map((address) => (
          <tr key={address.id} className="border-t">
            <td className="flex items-center gap-2 p-3 text-lg">
              <input
                type="radio"
                name="selectedAddress"
                value={address.id}
                checked={selectedAddressId === address.id}
                onChange={() => setSelectedAddressId(address.id)}
                className="w-5 h-5"
              />
              <strong>{address.title}</strong>
              {address.isDefault && (
                <span className="bg-[#FD4C2A] text-white text-xs px-2 py-1 rounded ml-2">
                  Default
                </span>
              )}
            </td>
            <td className="p-3">
              {address.street}/ {address.commune.communeName}/ {address.province.provinceName}/ {address.region.regionName}
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={2} className="p-3">
          <div className="flex gap-3 justify-center flex-wrap">
  <button 
    className="bg-[#FD4C2A] text-white rounded-lg py-2.5 px-4 text-base whitespace-nowrap max-w-[180px] hover:shadow-inner hover:translate-y-px transition-all"
    onClick={() => setShowAddressForm(true)}
  >
    Add New Address
  </button>
  <button 
    className="bg-[#FD4C2A] text-white rounded-lg py-2.5 px-4 text-base whitespace-nowrap max-w-[180px] hover:shadow-inner hover:translate-y-px transition-all"
    onClick={submitAddress}
  >
    Proceed To next Step
  </button>
</div>
          </td>
        </tr>
      </>
    ) : showPaymentList ? (
      <>
        {payment.map((paymentMethod) => (
          <tr key={paymentMethod.id} className="border-t">
            <td className="flex items-center gap-2 p-3 text-lg">
              <input
                type="radio"
                name="selectedPayment"
                value={paymentMethod.id}
                checked={selectedPaymentId === paymentMethod.id}
                onChange={() => {
                  setSelectedPaymentId(paymentMethod.id);
                  console.log("Available payment methods",payment);
                  console.log("payment Method ID selected",selectedPaymentId);
                }}
                className="w-5 h-5"
              />
              <strong>{paymentMethod.cardName}</strong>
              {paymentMethod.isDefault && (
                <span className="bg-[#FD4C2A] text-white text-xs px-2 py-1 rounded ml-2">
                  Default
                </span>
              )}
            </td>
            <td className="p-3">
              **** **** **** {paymentMethod.last4 ?? "N/A"} - Exp{" "}
              {formatExpiryForDisplay(paymentMethod.expMonth, paymentMethod.expYear)}
            </td>
          </tr>
        ))}
<tr className="text-center">
  <td className="p-3">
    <button 
      className="w-[160px] bg-[#FD4C2A] text-white rounded-lg py-1.5 px-4 text-base hover:shadow-inner hover:translate-y-px transition-all"
      onClick={() => { setShowPaymentForm(true); setShowPaymentList(false); }}
    >
      New Payment Method
    </button>
  </td>
  <td className="p-2">
    <button 
      className="w-[160px] bg-[#FD4C2A] text-white rounded-lg py-1.5 px-4 text-base hover:shadow-inner hover:translate-y-px transition-all disabled:opacity-50"
      onClick={submitPayment}
      disabled={!selectedPaymentId || loading}
    >
      {loading ? 'Processing...' : 'Complete Checkout'}
    </button>
  </td>
</tr>

      </>
    ) : showPaymentForm ? (
      <tr>
        <td colSpan="2" className="p-3">
          <Elements stripe={stripePromise}>
            <PaymentForm 
              token={token} 
              onCardSaved={() => {
                setOnCardSaved(true);
                setShowPaymentForm(false);
                setShowPaymentList(true);
              }} 
            />
          </Elements>
        </td>
      </tr>
    ) : null}
  </tbody>
</table>
<table className="w-[50%] bg-[#f9f9f9] shadow-sm rounded-lg overflow-hidden ml-auto mr-[200px]">
  <thead>
    <tr className="bg-[#FD4C2A]">
      <th colSpan={3} className="text-white p-4 text-center text-xl h-10">Order Details</th>
    </tr>
  </thead>
  <tbody className="[&_td]:p-5 [&_td]:align-top">
    <tr className="border-b">
      <td className="font-semibold text-center">Product</td>
      <td className="font-semibold text-center">Quantity</td>
      <td className="font-semibold text-center">Subtotal</td>
    </tr>
    
    {Foods.length === 0 ? (
      <tr className="border-b"><td colSpan={3} className="text-center py-4">No items in the cart</td></tr>
    ) : (
      Foods.map((item) => {
        const food = item.food;
        if (!food || !food.title || !item.quantity || !item.priceAtOrderTime) return null;

        const subtotal = item.priceAtOrderTime * item.quantity;

        return (
          <tr key={item.id} className="border-b">
            <td className="text-center">{food.title}</td>
            <td className="text-center">{item.quantity}</td>
            <td className="text-center">{subtotal.toFixed(2)} MAD</td>
          </tr>
        );
      })
    )}

    {/* Total summary */}
    <tr className="border-b">
      <td className="font-bold text-lg">Subtotal</td>
      <td className="text-center pl-[24%]" colSpan={2}>
        {Foods.reduce((sum, item) => sum + item.priceAtOrderTime * item.quantity, 0).toFixed(2)} MAD
      </td>
    </tr>
    <tr className="border-b">
      <td className="font-bold text-lg">Shipping</td>
      <td className="text-center pl-[24%]" colSpan={2}>
        {(Foods?.[0]?.food?.restaurant?.shippingFees ?? 0).toFixed(2)} MAD
      </td>
    </tr>
    <tr className="border-b">
      <td className="font-bold text-lg">Total</td>
      <td className="text-center pl-[24%]" colSpan={2}>
        {(Foods.reduce((sum, item) => sum + item.priceAtOrderTime * item.quantity, 0) + 
         (Foods?.[0]?.food?.restaurant?.shippingFees ?? 0)).toFixed(2)} MAD
      </td>
    </tr>
  </tbody>
</table>


        </div>
  );
}