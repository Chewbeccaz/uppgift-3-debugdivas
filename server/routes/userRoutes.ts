import express, { Router } from "express";
import mysql from "mysql2/promise";
import dbConfig from "../db/config";

const router = Router();




/******************* POST - Create User: **********************/
router.post("/create-user", async (req, res) => {
  try {
    // Hårdkodade värden för testning
    const email = "hardcoded@example.com";
    const password = "hardcodedpassword";
    const subscription_id = 2;

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
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).send("Logout failed.");
      }
      res.clearCookie('connect.sid');
      res.send("Logout successful.");
  });
});

export default router;
