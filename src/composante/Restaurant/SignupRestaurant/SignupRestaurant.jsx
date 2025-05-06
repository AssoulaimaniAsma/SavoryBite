


import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const SignupRestaurant = () => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [step, setStep] = useState(1);
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [errors, setErrors] = useState({});
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    restaurantName: "",
    email: "",
    shippingFees: "",
    phone: "",
    paypalEmail: "",
    contactEmail: "",
    password: "",
    confirmPassword: "",
    address: "",
    title: "",
    street: "",
    region: "",
    province: "",
    comune: "",
    isDefault: false
  });

  const resetForm = () => {
    setFormData({
      restaurantName: "",
      email: "",
      phone: "",
      paypalEmail: "",
      contactEmail: "",
      password: "",
      confirmPassword: "",
      address: "",
    });
    setIsTermsAccepted(false);
    setErrors({});
    setStep(1);
    setShowCoordinates(false);
  };

  const navigate = useNavigate();

  const validateStep = () => {
    const newErrors = {};
  
    if (step === 1) {
      if (!formData.restaurantName) newErrors.restaurantName = "Restaurant Name is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.contactEmail) newErrors.contactEmail = "Contact Email is required";
      if (!formData.phone) newErrors.phone = "Phone is required";
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }
  
    if (step === 2) {
      if (!formData.title) newErrors.title = "Title is required";
      if (!formData.street) newErrors.street = "Street is required";
      if (!formData.region) newErrors.region = "Region is required";
      if (!formData.province) newErrors.province = "Province is required";
      if (!formData.comune) newErrors.comune = "Commune is required";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  useEffect(() => {
    axios.get("http://localhost:8080/public/addressDetails/Regions")
      .then(res => setRegions(res.data))
      .catch(err => console.error("Regions loading error", err));
  }, []);

  useEffect(() => {
    if (formData.region) {
      axios.get(`http://localhost:8080/public/addressDetails/Provinces?regionID=${formData.region}`)
        .then(res => setProvinces(res.data))
        .catch(err => console.error("Provinces loading error", err));
    }
  }, [formData.region]);

  useEffect(() => {
    if (formData.province) {
      axios.get(`http://localhost:8080/public/addressDetails/Communes?provinceID=${formData.province}`)
        .then(res => setCommunes(res.data))
        .catch(err => console.error("Communes loading error", err));
    }
  }, [formData.province]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = () => {
    const activate = !showCoordinates;
    if (activate) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log("Nouvelle position :", pos.coords.latitude, pos.coords.longitude);
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setShowCoordinates(true);
        },
        () => {
          setShowCoordinates(false);
          alert("Permission denied for location");
        }
      );
    } else {
      setShowCoordinates(false);
      setLatitude(null);
      setLongitude(null);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
  
    // Set loading state to true
    setIsLoading(true);
  
    const payload = {
      restaurantName: formData.restaurantName,
      email: formData.email,
      phone: formData.phone,
      addressRegistrationBody: {
        title: formData.title,
        street: formData.street,
        regionID: parseInt(formData.region),
        provinceID: parseInt(formData.province),
        communeID: parseInt(formData.comune),
        latitude: latitude,
        longitude: longitude,
        isDefault: formData.isDefault === "on", 
        isCoordinationActivated: showCoordinates
      },
      shippingFees: 20.0,
      paypalEmail: null, // PayPal email forcé à null
      contactEmail: formData.contactEmail,
      password: formData.password
    };
  
    try {
      const res = await fetch("http://localhost:8080/auth/restaurant/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
  
      if (res.ok) {
        setSuccessMessage("Restaurant account created successfully!");
        setShowSuccessAlert(true);
        setTimeout(() => navigate("/restaurant/SigninRestaurant"), 3000);
      } else {
        let errorMessage = "Signup failed";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (err) {
          console.warn("Pas de JSON dans la réponse d'erreur");
        }
        setErrorMessage(errorMessage);
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setErrors({ api: "Server error, please try again later." });
      setShowErrorAlert(true);
    } finally {
      // Set loading state to false once the request is done (success or error)
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      {showSuccessAlert && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
          onClick={() => setShowSuccessAlert(false)}
        >
          <div
            className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center">
              <svg className="shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <h3 className="text-lg font-medium">Account created successfully!</h3>
            </div>
            <div className="mt-2 mb-4 text-sm">
              A verification email has been sent to your email address! Please check your inbox to activate your account.
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                className="text-green-800 bg-transparent border border-green-900 hover:bg-green-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-10 py-2 text-center dark:hover:bg-green-600 dark:border-green-600 dark:text-green-400 dark:hover:text-white dark:focus:ring-green-800"
                onClick={() => {
                  setShowSuccessAlert(false);
                  navigate("/restaurant/SigninRestaurant");
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
      {showErrorAlert && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
          onClick={() => setShowErrorAlert(false)}
        >
          <div
            className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center">
              <svg className="shrink-0 w-4 h-4 me-2 text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only w-">Error</span>
              <h3 className="text-lg font-medium text-red-500">Error</h3>
            </div>
            <div className="mt-2 mb-4 text-sm">
              {errorMessage}
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                className="text-red-800 bg-transparent border border-red-900 hover:bg-red-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-10 py-2 text-center"
                onClick={() => {
                  setShowErrorAlert(false);
                  resetForm();
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 max-w-3xl w-full">
        <h2 className="text-3xl font-bold text-black">Sign up Restaurant</h2>
        <p className="text-gray-600 mt-2 mb-4">
          Already have a Restaurant Account?{" "}
          <Link
            to="/restaurant/SigninRestaurant"
            className="text-[#FD4C2A] font-medium underline"
          >
            Login.
          </Link>
        </p>
        
        {/* Barre de progression modifiée pour 2 étapes seulement */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {["Personal Info", "Address"].map((label, index) => {
              const s = index + 1;
              return (
                <span
                  key={s}
                  className={`text-xs font-semibold py-1 px-2 rounded-full ${
                    step >= s ? "text-white bg-[#FD4C2A]" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {label}
                </span>
              );
            })}
          </div>
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-300">
            <div
              style={{ width: `${(step / 2) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#FD4C2A] transition-all duration-500 ease-in-out"
            ></div>
          </div>
        </div>

        <form onSubmit={step === 2 ? handleSubmit : handleNext} onKeyDown={(e) => {
          if (e.key === "Enter" && step < 2) e.preventDefault();
        }} className="mt-8">
          
          {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700">Restaurant Name</label>
              <input
                name="restaurantName"
                placeholder="Restaurant Name"
                value={formData.restaurantName}
                onChange={handleChange}
                className={`w-full mt-2 p-3 rounded-full bg-gray-50 focus:outline-none ${
                  errors.restaurantName ? "border-2 border-red-500" : "focus:border-2 focus:border-[#FD4C2A]"
                }`}
              />
              {errors.restaurantName && (
                <p className="text-red-500 text-sm mt-1">{errors.restaurantName}</p>
              )}
            </div>
  
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full mt-2 p-3 rounded-full bg-gray-50 focus:outline-none ${
                  errors.email ? "border-2 border-red-500" : "focus:border-2 focus:border-[#FD4C2A]"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Contact Email</label>
              <input
                name="contactEmail"
                placeholder="Contact Email"
                value={formData.contactEmail}
                onChange={handleChange}
                className={`w-full mt-2 p-3 rounded-full bg-gray-50 focus:outline-none ${
                  errors.contactEmail ? "border-2 border-red-500" : "focus:border-2 focus:border-[#FD4C2A]"
                }`}
              />
              {errors.contactEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Phone</label>
              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full mt-2 p-3 rounded-full bg-gray-50 focus:outline-none ${
                  errors.phone ? "border-2 border-red-500" : "focus:border-2 focus:border-[#FD4C2A]"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
  
            <div className="relative">
              <label className="block text-gray-700">Password</label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full mt-2 p-3 rounded-full bg-gray-50 focus:outline-none ${
                  errors.password ? "border-2 border-red-500" : "focus:border-2 focus:border-[#FD4C2A]"
                }`}
              />
              <span
                className="absolute top-10 right-4 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
  
            <div className="relative">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full mt-2 p-3 rounded-full bg-gray-50 focus:outline-none ${
                  errors.confirmPassword ? "border-2 border-red-500" : "focus:border-2 focus:border-[#FD4C2A]"
                }`}
              />
              <span
                className="absolute top-10 right-4 text-gray-500 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        )}
  
          {/* Étape 2 - Inchangée */}
          {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700">Title</label>
              <input
                name="title"
                placeholder="Enter a name to identify this address "
                value={formData.title}
                onChange={handleChange}
                className={`w-full mt-2 p-3 rounded-full bg-gray-50 focus:outline-none ${
                  errors.title ? "border-2 border-red-500" : "focus:border-2 focus:border-[#FD4C2A]"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
  
            <div>
              <label className="block text-gray-700">Street</label>
              <input
                name="street"
                placeholder="Street"
                value={formData.street}
                onChange={handleChange}
                className={`w-full mt-2 p-3 rounded-full bg-gray-50 focus:outline-none ${
                  errors.street ? "border-2 border-red-500" : "focus:border-2 focus:border-[#FD4C2A]"
                }`}
              />
              {errors.street && (
                <p className="text-red-500 text-sm mt-1">{errors.street}</p>
              )}
            </div>
  
            <div>
              <label className="block text-gray-700">Region</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className={`w-full mt-2 p-3 rounded-full bg-gray-50 focus:outline-none ${
                  errors.region ? "border-2 border-red-500" : "focus:border-2 focus:border-[#FD4C2A]"
                }`}
              >
                <option value="">Select Region</option>
                {regions.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.regionName}
                  </option>
                ))}
              </select>
              {errors.region && (
                <p className="text-red-500 text-sm mt-1">{errors.region}</p>
              )}
            </div>
  
            <div>
              <label className="block text-gray-700">Province</label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                className={`w-full mt-2 p-3 rounded-full bg-gray-50 focus:outline-none ${
                  errors.province ? "border-2 border-red-500" : "focus:border-2 focus:border-[#FD4C2A]"
                }`}
              >
                <option value="">Select Province</option>
                {provinces.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.provinceName}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="text-red-500 text-sm mt-1">{errors.province}</p>
              )}
            </div>
  
            <div>
              <label className="block text-gray-700">Commune</label>
              <select
                name="comune"
                value={formData.comune}
                onChange={handleChange}
                className={`w-full mt-2 p-3 rounded-full bg-gray-50 focus:outline-none ${
                  errors.comune ? "border-2 border-red-500" : "focus:border-2 focus:border-[#FD4C2A]"
                }`}
              >
                <option value="">Select Commune</option>
                {communes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.communeName}
                  </option>
                ))}
              </select>
              {errors.comune && (
                <p className="text-red-500 text-sm mt-1">{errors.comune}</p>
              )}
            </div>
  
            <div className="col-span-2 flex flex-wrap items-center gap-x-8 mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={showCoordinates}
                  onChange={handleCheckboxChange}
                  className="mr-2 text-[#FD4C2A]"
                />
                <label className="text-gray-700 text-sm">Add GPS Coordinates</label>
              </div>
  
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">⭐ Set as Default Address</label>
              </div>
            </div>
  
            {showCoordinates && (
              <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">Longitude</label>
                  <input
                    type="text"
                    value={longitude}
                    readOnly
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">Latitude</label>
                  <input
                    type="text"
                    value={latitude}
                    readOnly
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>
        )}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Previous
              </button>
            )}
 <button
  type={step === 2 ? "submit" : "button"}
  onClick={step === 2 ? null : handleNext}
  //className="px-10 py-2 bg-[#FD4C2A] text-white rounded hover:bg-orange-600"
  disabled={isLoading}
>
{isLoading ? (
  <div className="flex items-center justify-center py-2">
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FD4C2A]"></div>
    <span className="ml-2 text-[#FD4C2A] text-xs">Please wait, a verification email is being sent...</span>
  </div>
) : (
  <button
    type={step === 2 ? "submit" : "button"}
    onClick={step === 2 ? null : handleNext}
    className="px-10 py-2 bg-[#FD4C2A] text-white rounded hover:bg-orange-600"
    disabled={isLoading}
  >
    {step === 2 ? "Submit" : "Next"}
  </button>
)}

</button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupRestaurant;