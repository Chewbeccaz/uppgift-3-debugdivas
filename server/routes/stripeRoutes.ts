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

//**********************HÄMTA SUBSCRIPTION ID*********************/
async function getSubscriptionId(userId: string): Promise<string | null> {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT stripe_subscription_id FROM subscriptions WHERE user_id = ?",
      [userId]
    );

    if (rows.length > 0) {
      return rows[0].stripe_subscription_id;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching subscription ID:", error);
    return null;
  }
}

//**********************HÄMTA CUSTOMER ID*********************/
async function getCustomerId(userId: string): Promise<string | null> {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT stripe_customer_id FROM subscriptions WHERE user_id = ?",
      [userId]
    );

    if (rows.length > 0) {
      console.log(rows[0].stripe_customer_id);
      return rows[0].stripe_customer_id;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching subscription ID:", error);
    return null;
  }
}

//******************** Information till min sida *********************

router.get("/subscription-info", async (req, res) => {
  const userId = req.query.userId as string | undefined;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const subscriptionId = await getSubscriptionId(userId);
    if (!subscriptionId) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT stripe_subscription_id, status FROM subscriptions WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    const retrievedSubscriptionId = rows[0].stripe_subscription_id;
    const status = rows[0].status;

    const subscription = await stripe.subscriptions.retrieve(
      retrievedSubscriptionId
    );

    const { items, latest_invoice, current_period_end, cancel_at_period_end } =
      subscription;
    const priceId = items.data[0].price.id;
    const product = await stripe.products.retrieve(
      items.data[0].price.product as string
    );
    const invoice = await stripe.invoices.retrieve(latest_invoice as string);

    res.status(200).json({
      subscriptionLevel: product.name,
      lastPaymentDate: invoice.status_transitions.finalized_at,
      nextPaymentDate: current_period_end,
      status: status,
      cancelAtPeriodEnd: cancel_at_period_end,
    });
  } catch (error) {
    console.error("Error fetching subscription info:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//******************* Cancel subscription ********************** */

router.delete("/cancel-subscription", async (req, res) => {
  const { userId } = req.body;
  try {
    const subscriptionId = await getSubscriptionId(userId);
    console.log(
      `Retrieved subscriptionId: ${subscriptionId} for userId: ${userId}`
    );

    if (!subscriptionId) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    /* const canceledSubscription = await stripe.subscriptions.cancel(
      subscriptionId
    ); */
    const canceledSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    const db = await mysql.createConnection(dbConfig);
    await db.query(
      "UPDATE subscriptions SET status = 'expired' WHERE user_id = ?",
      [userId]
    );

    res.status(200).json({
      message: "Subscription canceled successfully",
      canceledSubscription,
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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
  const userId = req.query.userId;

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
      const subscriptionId = session.subscription;
      const customerId = session.customer;

      // Kontrollera om prenumerationen redan finns
      const [subscriptionRows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM subscriptions WHERE user_id = ?",
        [userId]
      );

      if (subscriptionRows.length > 0) {
        await db.query(
          "UPDATE subscriptions SET status = 'active' WHERE user_id = ?",
          [userId]
        );
      } else {
        // Om prenumerationen inte finns, skapa en ny post.
        const insertQuery = `
          INSERT INTO subscriptions (user_id, stripe_subscription_id, stripe_customer_id, status)
          VALUES (?, ?, ?, 'active')
        `;
        const insertValues = [userId, subscriptionId, customerId];
        await db.query(insertQuery, insertValues);
      }

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
// router.post("/webhook", async (req, res) => {
//   switch (req.body.type) {
//     case "customer.subscription.updated":
//       console.log(req.body);
//       break;
//     default:
//       console.log(req.body.type);
//       break;
//   }

//   res.json({});
// });

router.post("/webhook", async (req, res) => {
  try {
    const event = req.body;

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      const subscriptionId = subscription.id;
      const status = subscription.status;

      if (
        status === "past_due" ||
        status === "unpaid" ||
        status === "canceled"
      ) {
        const db = await mysql.createConnection(dbConfig);

        const [rows] = await db.query<RowDataPacket[]>(
          "SELECT user_id FROM subscriptions WHERE stripe_subscription_id = ?",
          [subscriptionId]
        );

        if (rows.length > 0) {
          const userId = rows[0].user_id;

          await db.query(
            "UPDATE subscriptions SET status = 'past_due' WHERE user_id = ?",
            [userId]
          );

          console.log(`Updated status to 'past_due' for user ${userId}`);
        } else {
          console.log(`No user found with subscription ID ${subscriptionId}`);
        }
      }
    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//*****************************************UPPGRADERA  */

router.post("/upgrade-subscription", async (req, res) => {
  const { userId, newPriceId } = req.body;
  console.log(
    `Upgrade request received for userId: ${userId}, newPriceId: ${newPriceId}`
  );

  try {
    const customerId = await getCustomerId(userId);
    console.log(customerId);

    if (!customerId) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
    });
    console.log("här är våra subscriptions hoppar vi", subscriptions);

    let subscriptionToUpdate;
    for (let subscription of subscriptions.data) {
      if (
        subscription.items.data.some(
          (item) => item.price.id === subscription.items.data[0].price.id
        )
      ) {
        subscriptionToUpdate = subscription;
        break;
      }
    }

    if (!subscriptionToUpdate) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionToUpdate.id,
      {
        items: [
          {
            id: subscriptionToUpdate.items.data[0].id,
            price: newPriceId,
          },
        ],
      }
    );

    res.json({
      message: "Subscription upgraded successfully",
      updatedSubscription,
    });
  } catch (error) {
    console.error("Failed to upgrade subscription:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//******************FÖRNYA SUBSCRIPTION: *****//////////////
router.get("/generate-invoice-link", async (req, res) => {
  const userId = req.query.userId as string | undefined;
  console.log("kommer vi hit", userId);

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // Retrieve the stripe_customer_id from the database
    const customerId = await getCustomerId(userId);
    if (!customerId) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // List the customer's invoices and select the most recent one
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 1,
      status: "open",
    });

    if (invoices.data.length === 0) {
      return res.status(404).json({ error: "No open invoices found" });
    }

    const invoice = invoices.data[0];
    const invoiceId = invoice.id; // Store the invoice ID for later use

    // Send the invoice manually
    const sentInvoice = await stripe.invoices.sendInvoice(invoiceId);

    // Optionally, you can now return the sent invoice details instead of just the invoice URL
    res.status(200).json({ sentInvoice });
  } catch (error) {
    console.error("Error generating and sending invoice:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;
