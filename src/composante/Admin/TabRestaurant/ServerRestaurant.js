// serveurclient.js
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3004;

app.use(cors()); // allow requests from frontend
app.use(express.json()); // parse JSON bodies

// Fake orders data
const restaurant = [
  {
    id: "15",
    RestaurantName:"Name1",
    mail: "Name1@gmail.com",
    phone: "0767123433",
    isApproved: true,
  },
  {
    id: "16",
    RestaurantName:"Name2",
    mail: "Name2@gmail.com",
    phone: "0760023433", 
    isApproved: null,
    isVerified:yes;
 },
 {
    id: "17",
    RestaurantName:"Name3",
    mail: "Name3@gmail.com",
    phone: "0760023433", 
    isApproved: false,
 },
];

// GET all restaurant
app.get("/restaurant", (req, res) => {
    console.log(restaurant);
  res.json(restaurant);
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
