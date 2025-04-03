const express = require("express");
const mysql = require("mysql2");
const bcrypt = require('bcrypt');
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const router = express.Router();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/menu", express.static(path.join(__dirname, "menu")));

// Middleware pour gérer les cookies
app.use(cookieParser());

// Configuration de CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());

// Configuration de la session
app.use(
  session({
    secret: "your_session_secret_key_here",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 3600000, httpOnly: true },
  })
);

// Connexion à MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "restoran",
});

db.connect((err) => {
  if (err) console.error("Database connection error:", err);
  else console.log("Connected to MySQL database");
});


// Middleware pour vérifier l'authentification
const authenticate = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret_key_here");
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(400).json({ message: "Invalid token" });
  }
};

// Route pour l'inscription
app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, mobile, password } = req.body;

  if (!firstName || !lastName || !email || !mobile || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [existingUser] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    await db
      .promise()
      .query(
        "INSERT INTO users (firstName, lastName, email, mobile, password) VALUES (?, ?, ?, ?, ?)",
        [firstName, lastName, email, mobile, password]
      );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route pour la connexion

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Rechercher l'utilisateur par email
    const [user] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (user.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Comparer directement le mot de passe fourni avec celui stocké (sans bcrypt)
    if (password !== user[0].password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Créer un objet de session pour l'utilisateur
    req.session.user = {
      id: user[0].id,
      email: user[0].email,
    };

    // Générer un token JWT avec les informations de l'utilisateur
    const token = jwt.sign(
      {
        id: user[0].id,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        email: user[0].email,
        mobile: user[0].mobile,
      },
      "your_jwt_secret_key_here", // Remplacez par votre clé secrète
      { expiresIn: "1h" }
    );

    // Ajouter le token dans un cookie avec les paramètres appropriés
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Mettre `secure: true` en production
      maxAge: 3600000, // 1 heure
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user[0].id,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        email: user[0].email,
        mobile: user[0].mobile,
      },
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.get('/profile', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Récupérer le token

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, 'your_jwt_secret_key_here', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Si le token est valide, retourner les données de l'utilisateur
    const userId = decoded.id;
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user: results[0] });
    });
  });
});


app.put('/profile', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, 'your_jwt_secret_key_here', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const userId = decoded.id;
    const { firstName, lastName, email, mobile } = req.body;

    db.query(
      'UPDATE users SET firstName = ?, lastName = ?, email = ?, mobile = ? WHERE id = ?',
      [firstName, lastName, email, mobile, userId],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error updating profile" });
        }
        res.json({ message: "Profile updated successfully" });
      }
    );
  });
});


// Route pour changer le mot de passe sans hachage
app.put("/change-password", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret_key_here");
    const { currentPassword, newPassword } = req.body;

    const [user] = await db.promise().query("SELECT password FROM users WHERE id = ?", [decoded.id]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentPassword !== user[0].password) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    await db.promise().query("UPDATE users SET password = ? WHERE id = ?", [newPassword, decoded.id]);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/api/orders", (req, res) => {
  const { tableNumber, items, totalPrice } = req.body;

  if (!tableNumber || !items || !totalPrice) {
    return res.status(400).json({ message: "Données manquantes" });
  }

  // Démarrer une transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Erreur de transaction :", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    // 1. D'abord insérer la commande
    const orderSql = "INSERT INTO orders (table_number, items, total_price) VALUES (?, ?, ?)";
    db.query(orderSql, [tableNumber, JSON.stringify(items), totalPrice], (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.error("Erreur d'insertion :", err);
          res.status(500).json({ message: "Erreur serveur" });
        });
      }

      // 2. Pour chaque item, récupérer ses ingrédients depuis la base
      const getIngredientsPromises = items.map(item => {
        return new Promise((resolve, reject) => {
          const sql = "SELECT ingredients FROM menu WHERE id = ?";
          db.query(sql, [item.id], (err, results) => {
            if (err) return reject(err);
            
            if (!results[0]?.ingredients) {
              console.warn(`Aucun ingrédient trouvé pour l'élément avec l'ID ${item.id}`);
              return resolve([]);
            }

            try {
              const ingredients = JSON.parse(results[0].ingredients);
              resolve(ingredients.map(ing => ({...ing, itemId: item.id})));
            } catch (e) {
              console.error(`Erreur parsing ingrédients pour item ${item.id}:`, e);
              resolve([]);
            }
          });
        });
      });

      Promise.all(getIngredientsPromises)
        .then(allIngredients => {
          // 3. Mettre à jour le stock pour tous les ingrédients
          const flattenedIngredients = allIngredients.flat();
          
          if (flattenedIngredients.length === 0) {
            console.warn("Aucun ingrédient à mettre à jour");
            return db.commit(() => {
              res.json({ message: "Commande enregistrée (aucune mise à jour de stock nécessaire)" });
            });
          }

          const updatePromises = flattenedIngredients.map(ingredient => {
            return new Promise((resolve, reject) => {
              const updateSql = `
                UPDATE stock 
                SET Quantity_used = Quantity_used + ?
                WHERE name = ?`;
              
              db.query(updateSql, [ingredient.quantity, ingredient.name], (err) => {
                if (err) reject(err);
                else resolve();
              });
            });
          });

          Promise.all(updatePromises)
            .then(() => {
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error("Erreur de commit :", err);
                    res.status(500).json({ message: "Erreur serveur" });
                  });
                }
                res.json({ message: "Commande enregistrée et stock mis à jour !" });
              });
            })
            .catch(err => {
              db.rollback(() => {
                console.error("Erreur mise à jour stock :", err);
                res.status(500).json({ message: "Erreur de mise à jour du stock" });
              });
            });
        })
        .catch(err => {
          db.rollback(() => {
            console.error("Erreur récupération ingrédients :", err);
            res.status(500).json({ message: "Erreur serveur" });
          });
        });
    });
  });
});

app.get("/api/orders", (req, res) => {
  const sql = "SELECT * FROM orders";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur de récupération des commandes :", err);
      res.status(500).json({ message: "Erreur serveur" });
    } else {
      res.json(result);
    }
  });
});

app.get("/api/menu", (req, res) => {
  const sql = "SELECT id, title, `desc`, price, img, category FROM Menu";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des données :", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    // Modifier le chemin de l'image pour correspondre à l'URL correcte
    results.forEach(item => {
      // Extraire le nom du fichier (ex: "coffee-1.jpg") du chemin complet
      const imageFileName = item.img.split('/').pop(); // Cela va extraire "coffee-1.jpg"
      item.img = `/menu/${imageFileName}`; // Assigner la nouvelle URL correcte
    });

    res.json(results);
  });
});

app.post("/logout", authenticate, (req, res) => {
  res.clearCookie("token");
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// Route pour la réservation
app.post('/reservation', async (req, res) => {
  const { name, email, mobile, table_type, children, date_time, special_request } = req.body;

  if (!name || !email || !mobile || !table_type || !date_time) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
  }

  const query = `
    INSERT INTO reservations (name, email, mobile, table_type, children, date_time, special_request)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  try {
    const result = await db.promise().query(query, [name, email, mobile, table_type, children, date_time, special_request]);

    if (result[0].affectedRows > 0) {
      res.status(200).json({ message: 'Réservation réussie' });
    } else {
      res.status(500).json({ message: 'Erreur lors de la réservation' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la réservation' });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Démarrer le serveur
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
