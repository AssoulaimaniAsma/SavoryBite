
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5006;

app.use(cors());
app.use(express.json());

// Servir les images statiques
app.use("/images", express.static(path.join(__dirname, "public/images")));


// Route pour récupérer les produits depuis le fichier JSON
app.get("/products", (req, res) => {
  fs.readFile("./pics.json", "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
