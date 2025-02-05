const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connexion à MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Remplace par ton user MySQL
  password: "root", // Mets ton mot de passe MySQL
  database: "restoran", // Mets le nom de ta base de données
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Route pour l'inscription
app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, mobile, password } = req.body;

  if (!firstName || !lastName || !email || !mobile || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Vérifier si l'email existe déjà
    const [existingUser] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur
    await db.promise().query(
      "INSERT INTO users (firstName, lastName, email, mobile, password) VALUES (?, ?, ?, ?, ?)",
      [firstName, lastName, email, mobile, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Démarrer le serveur
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
