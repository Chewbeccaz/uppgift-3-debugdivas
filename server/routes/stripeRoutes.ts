import { Router } from "express";
import mysql from "mysql2/promise";
// import { RowDataPacket } from "mysql2";
import { RowDataPacket } from "mysql2/promise";

import dbConfig from "../db/config";
import { initStripe } from "../stripe";
import dotenv from "dotenv";
dotenv.config();
const { BLUNDER_KEY, ARIEL_KEY, TRITION_KEY } = process.env;

const router = Router();
const stripe = initStripe();

router.delete('/cancel-subscription', async (req, res) => {
  const { userId } = req.body;
  try {
    const subscriptionId = await getSubscriptionId(userId);
    console.log(`Retrieved subscriptionId: ${subscriptionId} for userId: ${userId}`);
    
    if (!subscriptionId) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);

    res.status(200).json({ message: 'Subscription canceled successfully', canceledSubscription });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function getSubscriptionId(userId: string): Promise<string | null> {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT stripe_subscription_id FROM subscriptions WHERE user_id = ?',
      [userId]
    );

    if (rows.length > 0) {
      return rows[0].stripe_subscription_id; 
    } else {
      return null; 
    }
  } catch (error) {
    console.error('Error fetching subscription ID:', error);
    return null;
  }
}

router.post("/create-subscription-session", async (req, res) => {
  const { userId } = req.body;
  console.log(userId);
  console.log(`Creating subscription session for userId: ${userId}`);
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
      success_url: "http://localhost:5173/confirmation",
      cancel_url: "http://localhost:5173/",
      metadata: {
        user_id: userId,
      },
    });

    // Logga om metadatan sätts
    console.log("Session metadata:", session.metadata);
    console.log("User ID passed in metadata:", userId);

    console.log("session: ", session.id, session.url);
    const sessionId = session.id;
    const user_id = userId;
    console.log("user_id", user_id);

    console.log("sessionId: ", sessionId);

    // Spara sessionId och userId till databasen
    const db = await mysql.createConnection(dbConfig);
    const query = `
       INSERT INTO payments (stripe_session_id, user_id, payment_date)
       VALUES (?,?,?)
     `;
    const values = [sessionId, user_id, new Date()];

    await db.query(query, values);

    res.json({ url: session.url, session, user_id });
    console.log("session är klar? ", session);
  } catch (error) {
    console.error("Error creating subscription session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/verify-subscription-session", async (req, res) => {
  const userId = req.query.userId as string;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT stripe_session_id FROM payments WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    const sessionId = rows[0].stripe_session_id;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);

      // Hämta subscription och customer ID
      const subscriptionId = session.subscription;
      const customerId = session.customer;

      // Spara till databasen
      const insertQuery = `
        INSERT INTO subscriptions (user_id, stripe_subscription_id, stripe_customer_id)
        VALUES (?, ?, ?)
      `;
      const insertValues = [userId, subscriptionId, customerId];
      await db.query(insertQuery, insertValues);

      return res
        .status(200)
        .json({ verified: true, lineItems: lineItems.data, session });
    } else {
      return res.status(200).json({ verified: false, session });
    }
  } catch (error) {
    console.error("Error verifying subscription session:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//TODO: Använd för att kolla om payment ej gått igenom eller blvit over_due??
router.post("/webhook", async (req, res) => {
  switch (req.body.type) {
    case "customer.subscription.created":
      console.log(req.body);
      break;
    default:
      console.log(req.body.type);
      break;
  }

  res.json({});
});

//*****************************************UPPGRADERA  */
router.post('/upgrade-subscription', async (req, res) => {
  const { userId, priceId } = req.body;
  console.log('Received request to upgrade subscription:', req.body);

  try {
    // Koppla till databasen
    const connection = await mysql.createConnection(dbConfig);

    // Hämta stripe_customer_id från subscriptions-tabellen baserat på userId

    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT stripe_subscription_id FROM subscriptions WHERE user_id = ?',
      [userId]
    );

    const stripeSubscriptionId = rows[0].stripe_subscription_id;
    console.log('Fetched stripe_customer_id:', stripeSubscriptionId);

    // Hämta användarens prenumerationer från Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeSubscriptionId,
    });

    const subscription = subscriptions.data[0]; // Antag att det finns bara en prenumeration

    if (subscription) {
      // Uppdatera prenumerationen med nytt pris-id
      const updatedSubscription = await stripe.subscriptions.update(
        subscription.id,
        {
          items: [
            {
              id: subscription.items.data[0].id, // Behåll existerande item-id
              price: priceId, // Nytt pris-id
            },
          ],
        }
      );

      console.log('Updated subscription:', updatedSubscription);

      res.json({ updatedSubscription });
    } else {
      console.error('No subscription found for user');
      res.status(400).json({ error: 'No subscription found for user' });
    }
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




export default router;
