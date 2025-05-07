import React from "react";
import {useNavigate,useParams} from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import "./Checkout.css";
export default function Checkout(){
    const navigate = useNavigate();
    return(
        <div className="CheckoutWrapper">
            <div className="CheckoutContent">
            <FaCheckCircle className="VerifyIcon" />

                <h2 className="h2content7">Thank You!</h2>
                <p>Your order has been confirmed & it is on the way. Check your email <br/>for the details</p>
                <div className="buttonCheckoutContent">
                    <button onClick={() => navigate("/client")} className="NavigateHome">Go to Homepage</button>
                    <button onClick={() => navigate(`/client/OrderHistory`)} className="NavigateOrder">Check Order Details</button>
                </div>
            </div>
        </div>
    );
}