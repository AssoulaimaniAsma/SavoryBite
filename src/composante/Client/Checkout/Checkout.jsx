import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

export default function Checkout() {
    const navigate = useNavigate();
    return (
        <div className="flex justify-center items-center ">
            <div className="border border-[#FD4C2A] text-center w-[1000px] h-[400px] p-[80px] rounded-2xl">
                <FaCheckCircle className="text-[#10B981] inline-block text-[80px] mb-[45px]" />
                
                <h2 className="text-4xl font-bold mb-1">Thank You!</h2>
                <p className="mb-4">Your order has been confirmed & it is on the way. Check your email <br/>for the details</p>
                
                <div className="flex justify-center mt-8">
                    <button 
                        onClick={() => navigate("/client")} 
                        className="bg-[#FD4C2A] text-white py-2 px-6 rounded-3xl font-bold mr-8"
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
            </div>
        </div>
    );
}