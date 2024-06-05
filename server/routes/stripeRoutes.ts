import { Router } from "express";
import mysql from "mysql2/promise";
import dbConfig from "../db/config";
import { initStripe } from "../stripe";
import dotenv from "dotenv";
dotenv.config();
const { BLUNDER_KEY, ARIEL_KEY, TRITION_KEY } = process.env;

const router = Router();
const stripe = initStripe();

// const getUserById = async (userId: number) => {
//   const db = await mysql.createConnection(dbConfig);
//   const query = `SELECT * FROM users WHERE id = ?`;
//   const [results]: [any[], any] = await db.query(query, [userId]);
//   // await db.end();
//   if (results.length > 0) {
//     return results[0];
//   } else {
//     throw new Error("User not found");
//   }
// };

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
      success_url: "http://localhost:5173/confirmation", //Ersätt med egen confirmation sedan.
      cancel_url: "http://localhost:5173/",
    });

    console.log("session: ", session.id, session.url, session);
    const sessionId = session.id;
    const user_id = 11;

    console.log("sessionId: ", sessionId);

     // Spara sessionsid till databasen
     const db = await mysql.createConnection(dbConfig);
     const query = `
       INSERT INTO payments (stripe_session_id, user_id, payment_date)
       VALUES (?, ?, ?)
     `;
     const values = [sessionId, user_id, new Date()];
 
     await db.query(query, values);
    

    res.json({ url: session.url });
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//SKAPA EN VERIFY SESSION.
router.get("/verify-subscription-session", async (req, res) => {
  const sessionId = req.query.sessionId as string;

  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
      return res.status(200).json({ verified: true, lineItems: lineItems.data });
    } else {
      return res.status(200).json({ verified: false });
    }
  } catch (error) {
    console.error("Error verifying subscription session:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



// router.get("/verify-subscription-session", async (req, res) => {
//   try {
  
//     const sessionIdParam = req.query.sessionId;

//     if (!sessionIdParam) {
//       return res.status(400).json({ error: "Session ID is required" });
//     }

//     const sessionId = sessionIdParam as string;

//     // Retrieve the checkout session using the session ID
//     const session = await stripe.checkout.sessions.retrieve(sessionId);

//     // Extract the subscription ID from the session
//     const subscriptionId = session.subscription;

//     if (!subscriptionId) {
//       return res.status(404).json({ error: "Subscription not found" });
//     }

//     // Perform a type assertion to treat subscriptionId as a string
//     const subscriptionIdStr = subscriptionId as string;

//     // Retrieve the subscription details
//     const subscription = await stripe.subscriptions.retrieve(subscriptionIdStr);

//     // Check the subscription status
//     if (subscription.status === 'active') {
//       res.json({ status: 'success', message: 'Subscription is active' });
//     } else {
//       res.json({ status: 'error', message: `Subscription status: ${subscription.status}` });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });




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
