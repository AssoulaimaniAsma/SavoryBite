const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");


const PORT = 5009;

const app = express();
app.use(express.json()); 

app.use(cors({ origin: "http://localhost:3000" })); // Permettre les requêtes depuis le frontend
const products = [
  { id: 1, name: "Cheese burger", category: "Burger",image: "/image/buger/cheeseburger.jpg", oldPrice: 230, newPrice: 200, discount: 13 },
  { id: 2, name: "Chikas", category: "Burger",image: "/image/buger/Chikas.jpg", oldPrice: 150, newPrice: 120, discount: 20 },
  { id: 3, name: "Meat Burger", category: "Burger",image: "/image/burger/meat-burger-with-french-fries.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 4, name: "Shawarma", category: "Burger",image: "/image/burger/shawarma.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 5, name: "Tacos", category: "Burger",image: "/image/burger/tacos.jpeg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 6, name: "Brownie", category: "Dessert",image: "/image/dessert/Brownie.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 7, name: "Chocolate Brownie",category: "Dessert", image: "/image/dessert/Brownie2.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 8, name: "Cheese Cake",category: "Dessert", image: "/image/dessert/CheeseCake.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 9, name: "Chocolate Cake",category: "Dessert", image: "/image/dessert/Chocolate_Cake.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 10, name: "Pancake",category: "Dessert", image: "/image/dessert/PanCake.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 11, name: "Waffle",category: "Dessert", image: "/image/dessert/Waffle.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 12, name: "Couscous",category: "Moroccan Food", image: "/image/maroc/Couscous.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 13, name: "Couscous",category: "Moroccan Food", image: "/image/maroc/Waffle.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 14, name: "Seffa",category: "Moroccan Food", image: "/image/maroc/Sefa.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 15, name: "Tagine Berquouq",category: "Moroccan Food", image: "/image/maroc/Tagine_Berquouq.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 16, name: "Tagine Djaj",category: "Moroccan Food", image: "/image/maroc/Tagine_Djaj.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 17, name: "Tagine Keffta",category: "Moroccan Food", image: "/image/maroc/Tagine_Kefta.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 18, name: "Pasta",category: "Pasta", image: "/image/pasta/Pasta1.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 19, name: "Pasta",category: "Pasta", image: "/image/pasta/Pasta2.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 20, name: "Pasta",category: "Pasta", image: "/image/pasta/Pasta3.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 21, name: "Pasta",category: "Pasta", image: "/image/pasta/Pasta4.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 22, name: "Pasta",category: "Pasta", image: "/image/pasta/Pasta5.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 23, name: "Pasta",category: "Pasta", image: "/image/pasta/Pasta6.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 24, name: "Pasta",category: "Pasta", image: "/image/pasta/Pasta7.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 25, name: "Pasta",category: "Pasta", image: "/image/pasta/Pasta8.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 26, name: "Pasta",category: "Pasta", image: "/image/pasta/Salade.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 27, name: "Beef Plate",category: "Plate", image: "/image/plat/Plat1.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 28, name: "Shawarma Plate",category: "Plate", image: "/image/plat/Plat2.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 29, name: "Chicken Plate",category: "Plate", image: "/image/plat/Plat3.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 30, name: "Wings Plate ",category: "Plate", image: "/image/plat/Plat4.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 31, name: "Tajine",category: "Moroccan Food", image: "/image/maroc/test.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
  { id: 32, name: "Pasta",category: "Pasta", image: "/image/pasta/test.jpg", oldPrice: 99, newPrice: 80, discount: 19 },
];

app.get("/api/products", (req, res) => {
  res.json(products);
});
app.get("/", (req, res) => {
  res.send("Bienvenue sur mon API !");
});

app.use("/image", express.static("image"));



/*const USERS_FILE = path.join(__dirname, "src", "composante", "Signup", "users.json");

// Vérifier si le fichier existe, sinon le créer avec un tableau vide
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, "[]", "utf-8");
}*/

app.listen(PORT, () => {
  console.log(`✅ Serveur en ligne sur http://localhost:${PORT}`);
});
/*app.get("/api/signup", (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la lecture des utilisateurs" });
  }
});
*/


// Fonction pour lire les utilisateurs
/*const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erreur de lecture du fichier users.json :", error);
    return [];
  }
};
*/
// Fonction pour écrire les utilisateurs
/*const writeUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (error) {
    console.error("Erreur d'écriture dans users.json :", error);
  }
};

// Route pour l'inscription
app.post("/api/signup", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  let users = readUsers();

  if (users.some(user => user.email === email)) {
    return res.status(400).json({ message: "Cet email est déjà utilisé" });
  }

  users.push({email, password });
  writeUsers(users);

  res.status(201).json({ message: "Utilisateur inscrit avec succès !" });
});
// Route pour récupérer les utilisateurs
app.get("/api/signup", (req, res) => {
  const users = readUsers();
  res.json(users);
});
*/

