import express, { Router } from "express";
import mysql from "mysql2/promise";
import dbConfig from "../db/config";

const router = Router();

//Handling GET / Request
router.get("/", async (req, res) => {
  res.send("Här är alla artiklar!");

  let db = await mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "notSecureChangeMe",
    database: "debugdivas",
  });

  const [results, fields] = await db.query("SELECT * FROM `articles`");

  console.log(results, fields);
});

//Återanvändbar funktion:
const fetchArticlesByLevel = async (subscriptionLevel: number) => {
  let db = await mysql.createConnection(dbConfig);
  const [results] = await db.query(
    "SELECT * FROM `articles` WHERE `subscription_level` = ?",
    [subscriptionLevel]
  );
  await db.end();
  console.log(results);
  return results;
};

//*******************GET - Articles Nivå 1: **********************//
router.get("/level/2", async (req, res) => {
  try {
    const results = await fetchArticlesByLevel(2);
    res.json(results);
  } catch (error) {
    console.error("Error fetching articles with subscription_level 2:", error);
    res.status(500).send("Internal Server Error");
  }
});

//*******************GET - Articles Nivå 2: **********************//
router.get("/level/3", async (req, res) => {
  try {
    const results = await fetchArticlesByLevel(3);
    res.json(results);
  } catch (error) {
    console.error("Error fetching articles with subscription_level 3:", error);
    res.status(500).send("Internal Server Error");
  }
});

//*******************GET - Articles Nivå 3: **********************//
router.get("/level/4", async (req, res) => {
  try {
    const results = await fetchArticlesByLevel(4);
    res.json(results);
  } catch (error) {
    console.error("Error fetching articles with subscription_level 4:", error);
    res.status(500).send("Internal Server Error");
  }
});

//*******************POST - Article: **********************//

router.post("/create", async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);
    const { title, content, subscription_level } = req.body;

    const query = `
            INSERT INTO articles (title, content, subscription_level, created_at)
            VALUES (?, ?, ?, ?)
          `;

    const values = [title, content, subscription_level, new Date()];

    await db.query(query, values);
    await db.end();

    res.status(201).send("Article created successfully");
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
