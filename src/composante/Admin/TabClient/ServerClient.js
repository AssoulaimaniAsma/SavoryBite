// serveurclient.js
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors()); // allow requests from frontend
app.use(express.json()); // parse JSON bodies

// Fake orders data
const clients = [
  {
    id: "10",
    first: "Asma",
    last: "kjhkjh",
    mail: "Asma@gmail.com",
    phone: "0767123433",
    approved: "true",
  },
  {
    id: "11",
    first: "Khadija",
    last: "kjhkjh",
    mail: "Khadija@gmail.com",
    phone: "0760023433", 
    approved: "null",
 },
 {
    id: "12",
    first: "Ahmed",
    last: "kjhkjh",
    mail: "Ahmed@gmail.com",
    phone: "0760023433", 
    approved: "false",
 },
];

// GET all clients
app.get("/clients", (req, res) => {
    console.log(clients);
  res.json(clients);
});

// DELETE client by ID
app.delete("/clients/:id", (req, res) => {
  const { id } = req.params;
  const index = clients.findIndex(client => client.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Client not found" });
  }

  const deletedClient = clients.splice(index, 1); // remove from array
  res.status(200).json({ message: "Client deleted successfully", deletedClient });
});




// Start the server
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
