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

export default router;
