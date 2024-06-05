import express, { Router } from "express";
import Stripe from "stripe";
import mysql from "mysql2/promise";
import dbConfig from "../db/config";
import session, { Session } from "express-session";
import { CustomSession } from "../models/CustomSession";
import { initStripe } from "../stripe";
import dotenv from "dotenv";
dotenv.config();
const { BLUNDER_KEY, ARIEL_KEY, TRITION_KEY } = process.env;

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

router.post("/create-subscription-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: BLUNDER_KEY, // Pris-ID från Stripe
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/", //Ersätt med egen confirmation sedan.
      cancel_url: "http://localhost:5173/",
    });

    console.log("session: ", session.id, session.url, session);
    const sessionId = session.id;
    console.log("sessionId: ", sessionId);
    // Spara sessionsid till databasen??

    res.json({ url: session.url });
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//SKAPA EN VERIFY SESSION.

//Denna ska kunna återbrukas när tillexempel betalning ej gått igenom och man vill förnya.
// const createSubscriptionSession = async (req: Request, res: Response) => {
//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       mode: 'subscription',
//       line_items: [{
//         price: BLUNDER_KEY, // Pris-ID från Stripe
//         quantity: 1,
//       }],
//       success_url: "http://localhost:5173/", //Ersätt med egen confirmation sedan.
//       cancel_url: "http://localhost:5173/",
//     });
//     res.json({ url: session.url });
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// };

// router.post("/create-subscription-session", createSubscriptionSession);
// router.post("/verify-session", verifySession);

export default router;
