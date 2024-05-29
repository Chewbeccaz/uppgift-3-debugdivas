import express from "express";
import mysql from "mysql2/promise";

const app = express();
const PORT: Number = 3000;

const dbConfig = {
  host: "localhost",
  port: 3307,
  user: "root",
  password: "notSecureChangeMe",
  database: "debugdivas",
};

//Handling GET / Request
app.get("/", async (req, res) => {
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
app.get("/articles/level/2", async (req, res) => {
  try {
    const results = await fetchArticlesByLevel(2);
    res.json(results);
  } catch (error) {
    console.error("Error fetching articles with subscription_level 2:", error);
    res.status(500).send("Internal Server Error");
  }
});

//*******************GET - Articles Nivå 2: **********************//
app.get("/articles/level/3", async (req, res) => {
  try {
    const results = await fetchArticlesByLevel(3);
    res.json(results);
  } catch (error) {
    console.error("Error fetching articles with subscription_level 3:", error);
    res.status(500).send("Internal Server Error");
  }
});

//*******************GET - Articles Nivå 3: **********************//
app.get("/articles/level/4", async (req, res) => {
  try {
    const results = await fetchArticlesByLevel(4);
    res.json(results);
  } catch (error) {
    console.error("Error fetching articles with subscription_level 4:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Server setup
app.listen(PORT, () => {
  console.log(
    "The application is listening " + "on port http://localhost:" + PORT
  );
});
