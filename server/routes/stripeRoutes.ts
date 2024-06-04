import express, { Router } from "express";
import mysql from "mysql2/promise";
import dbConfig from "../db/config";

const router = Router();

/******************* GET - Subscription levels: **********************/
router.get("/", async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);
    const query = `SELECT _id, name FROM subscription_level`;
    const [results]: [any[], any] = await db.query(query);
    await db.end();

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
