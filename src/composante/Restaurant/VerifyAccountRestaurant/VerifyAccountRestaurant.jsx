import { useEffect, useState ,useRef  } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function VerifyAccountRestaurant() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();
const hasFetched = useRef(false);
  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token || hasFetched.current) {
      setStatus("error");
      return;
    }
    hasFetched.current = true;
    
      const url = `http://localhost:8080/auth/verifyAccount?token=${token}`;
      console.log("URL de vérification du restaurant :", url);
      
      fetch(url, {
        method: "POST",
      })
        .then((res) => {
          console.log("Réponse:", res.status, res.statusText);
         
            if (res.status === 200 || res.status === 409) {
              setStatus("success");
              setTimeout(() => navigate("/restaurant/SigninRestaurant"), 5000);
            } else {
              setStatus("error");
            }
          
        })
        .catch(() => setStatus("error"));
    

    
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        {status === "loading" && (
          <p className="text-gray-600 text-lg">⏳ Verifying your restaurant account...</p>
        )}
        {status === "success" && (
          <>
            <div className="text-green-600 text-5xl mb-4">✔️</div>
            <h2 className="text-2xl font-bold mb-2 text-green-700">Restaurant Registration Done</h2>
            <p className="text-gray-700 mb-4">
              Your restaurant account has been successfully verified.
            </p>
            <p className="text-sm text-gray-500">
              You will be redirected to restaurant login in a few seconds...
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-red-600 text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-2 text-red-700">Restaurant Verification Failed</h2>
            <p className="text-gray-700">
              The verification link is invalid or has expired.
            </p>
          </>
        )}
      </div>
    </div>
  );
}