// serveurclient.js
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3007;

app.use(cors()); // allow requests from frontend
app.use(express.json()); // parse JSON bodies

// Fake orders data
const orders = [
  {
    id: "001",
    clientName: "Asma",
    items: [
        {
          idItem: "101",
          name: "Product A",
          category: "Pizza",
          description: "description",
          price :"23",
        },
        
        {
          idItem: "102",
          name: "Burger",
          category: "Accessories",
          description: "description",
          price :"23",
        },
      ],
    total: "45.99",
    status: "Shipped",
    date: "2025-04-10",
  },
  {
    id: "002",
    clientName: "Khadija",
    items: [
        {
          idItem: "100",
          name: "Product C",
          category: "Soda",
          description: "description.",
          price:"15.50",
        },
    ],
    total: "15.50",
    status: "Pending",
    date: "2025-04-11",
  },
];

// GET all orders
app.get("/orders", (req, res) => {
    console.log(orders);
  res.json(orders);
});
// GET order by ID
app.get("/orders/:id", (req, res) => {
    const orderId = req.params.id;
    const order = orders.find(o => o.id === orderId);
    if (order) {
      res.json(order);
    } else {
      res.status(404).send("Order not found");
    }
  });

// Start the server
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
