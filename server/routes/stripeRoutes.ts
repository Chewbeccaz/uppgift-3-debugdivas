import express, { Router } from "express";
import Stripe from "stripe";
import mysql from "mysql2/promise";
import dbConfig from "../db/config";
import session, { Session } from "express-session";
import { CustomSession } from "../models/CustomSession";
import { initStripe } from "../stripe";

const router = Router();
const stripe = initStripe();

const getUserById = async (userId: number) => {
  const db = await mysql.createConnection(dbConfig);
  const query = `SELECT * FROM users WHERE id = ?`;
  const [results]: [any[], any] = await db.query(query, [userId]);
  await db.end();
  if (results.length > 0) {
    return results[0];
  } else {
    throw new Error("User not found");
  }
};

//Denna ska kunna återbrukas när tillexempel betalning ej gått igenom och man vill förnya.
const createSubscriptionSession = async () => {
  console.log("hejhej");
};

router.post("/create-subscription-session", createSubscriptionSession);
// router.post("/verify-session", verifySession);

export default router;
