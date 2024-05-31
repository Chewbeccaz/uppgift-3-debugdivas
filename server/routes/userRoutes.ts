import express, { Router } from "express";
import mysql from "mysql2/promise";
import dbConfig from "../db/config";
import session, { Session } from "express-session"; 


interface CustomSession extends Session {
  isLoggedIn?: boolean;
}


const router = Router();


router.use(session({
  secret: 'secret', // En hemlig nyckel för att signera sessionen, ändra detta
  resave: false,
  saveUninitialized: false
}));

/******************* POST - Create User: **********************/
router.post("/create-user", async (req, res) => {
  try {
   const { email, password, subscription_id } = req.body;

    const db = await mysql.createConnection(dbConfig);

    const query = `
        INSERT INTO users (email, password, subscription_id)
        VALUES (?, ?, ?)
      `;

    const values = [email, password, subscription_id];

    await db.query(query, values);
    await db.end();

    res.status(201).send("User created");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
  }
});


//*******************POST - Login: **********************//
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
      const db = await mysql.createConnection(dbConfig);
      const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
      const [results]: [any[], any] = await db.query(query, [email, password]);

      await db.end();

      if (results.length > 0) {
        (req.session as CustomSession).isLoggedIn = true;
          res.status(200).json({ message: "Login successful", user: results[0] });
      } else {
          res.status(401).json({ message: "Invalid email or password" });
      }
  } catch (error) {
      console.error("Error during login:", error);
      res.status(500).send("Internal Server Error");
  }
});

// Logout route
router.post("/logout", (req, res) => {
  // Förstör sessionen för att logga ut användaren
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).send("Logout failed.");
      }
      res.clearCookie('connect.sid'); // Ta bort sessionens cookie
      res.send("Logout successful.");
  });
});

export default router;
