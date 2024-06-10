import express, { Router } from "express";
import mysql from "mysql2/promise";
import dbConfig from "../db/config";
import session, { Session } from "express-session";
import bcrypt from "bcrypt";
import { CustomSession } from "../models/CustomSession";
import { initStripe } from "../stripe";
// const initStripe = require("../stripe");

// interface CustomSession extends Session {
//   isLoggedIn?: boolean;
//   userId?: number;
// }

const router = Router();

router.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

/******************* POST - Create User OLD: **********************/
router.post("/create-user", async (req, res) => {
  try {
    const { email, password, subscription_id } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const db = await mysql.createConnection(dbConfig);

    const query = `
        INSERT INTO users (email, password, subscription_id)
        VALUES (?, ?, ?)
      `;

    const values = [email, hashedPassword, subscription_id];

    const [result] = await db.query<mysql.ResultSetHeader>(query, values);
    const userId = result.insertId;
    // await db.end();

    // res.status(201).send("User created");
    res.status(201).json({ message: "User created", userId: userId });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
  }
});

/******************* delete  - CANCEL SUB: **********************/
  //Just nu gör inte endpointen så mycket, då det är osäkert hur vi ska göra med databasen och stripe/webhook. Detta är bara en start 
  
router.delete("/cancel-subscription", async (req, res) => {
  const { userId } = req.body;
  try {
      const db = await mysql.createConnection(dbConfig);
      const query = `
          DELETE FROM subscriptions
          WHERE user_id = ?
      `;
      await db.query(query, [userId]);
      res.status(200).json({ message: "Subscription canceled successfully" });
  } catch (error) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

/******************* POST - Create User: **********************/
// router.post("/create-user", async (req, res) => {
//   const stripe = initStripe();
//   const connection = await mysql.createConnection(dbConfig);
//   await connection.beginTransaction();
//   try {
//     const { email, password, subscription_id } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const userQuery = `
//     INSERT INTO users (email, password, subscription_id)
//     VALUES (?, ?, ?)
//   `;

//     const userValues = [email, hashedPassword, subscription_id];
//     const [result]: any = await connection.query(userQuery, userValues);
//     const userId = result.insertId;

//     // Fetch subscription level
//     const subQuery = `SELECT price_id FROM subscription_level WHERE _id = ?`;
//     const [subResult]: any = await connection.query(subQuery, [
//       subscription_id,
//     ]);
//     const priceId = subResult[0].price_id;

//     // Create Stripe subscription session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       customer_email: email,
//       line_items: [
//         {
//           price: priceId,
//           quantity: 1,
//         },
//       ],
//       mode: "subscription",
//       success_url: "http://localhost:5173/", //lägg till confirmation sen
//       cancel_url: "http://localhost:5173/",
//       metadata: {
//         userId: userId,
//       },
//     });

//     await connection.commit();
//     await connection.end();

//     res.status(201).json({ message: "User created", sessionId: session.id });
//   } catch (error) {
//     await connection.rollback();
//     await connection.end();
//     console.error("Error creating user:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

//*******************POST - Login: **********************//
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const db = await mysql.createConnection(dbConfig);
//     const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
//     const [results]: [any[], any] = await db.query(query, [email, password]);

//     await db.end();

//     if (results.length > 0) {
//       (req.session as CustomSession).isLoggedIn = true;
//       (req.session as CustomSession).userId = results[0].id;
//       res.status(200).json({
//         message: "Login successful",
//         user: results[0],
//         sessionId: req.sessionID,
//       });
//     } else {
//       res.status(401).json({ message: "Invalid email or password" });
//     }
//   } catch (error) {
//     console.error("Error during login:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const db = await mysql.createConnection(dbConfig);
//     const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
//     const [results]: [any[], any] = await db.query(query, [email, password]);

//     await db.end();

//     if (results.length > 0) {
//       const user = results[0];
//       const passwordMatch = await bcrypt.compare(password, user.password);

//       if (passwordMatch) {
//         (req.session as CustomSession).isLoggedIn = true;
//         (req.session as CustomSession).userId = results[0].id;
//         res.status(200).json({
//           message: "Login successful",
//           user: { _id: results[0].id }, // Se till att användar-ID returneras som '_id'
//           sessionId: req.sessionID,
//         });
//       } else {
//         res.status(401).json({ message: "Invalid email or password" });
//       }
//     }
//   } catch (error) {
//     console.error("Error during login:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = await mysql.createConnection(dbConfig);
    const query = `SELECT * FROM users WHERE email = ?`;
    const [results]: [any[], any] = await db.query(query, [email]);

    // await db.end();

    if (results.length > 0) {
      const user = results[0];
      console.log("User found:", user);
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        console.log("Password match:", passwordMatch);
        (req.session as CustomSession).isLoggedIn = true;
        (req.session as CustomSession).userId = user._id;
        console.log(user);
        res.status(200).json({
          message: "Login successful",
          user: user._id,
          sessionId: req.sessionID,
        });
      } else {
        console.log("Invalid password");
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      console.log("User not found");
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/check-session", (req, res) => {
  console.log("check-session route hit");
  const session = req.session as CustomSession;
  console.log("Current session:", session);
  if (session && session.isLoggedIn && session.userId) {
    console.log("Valid session found:", session);
    res.status(200).json({
      isLoggedIn: true,
      sessionId: req.sessionID,
      user: { _id: session.userId },
    });
  } else {
    console.log("No valid session found");
    res.status(200).json({ isLoggedIn: false });
  }
});

// router.get("/check-session", (req, res) => {
//   const session = req.session as CustomSession;
//   if (session && session.isLoggedIn && session.userId) {
//     res.status(200).json({
//       isLoggedIn: true,
//       sessionId: req.sessionID,
//       user: { _id: session.userId }, // Returnera användar-ID som '_id'
//     });
//   } else {
//     res.status(200).json({ isLoggedIn: false });
//   }
// });

// Logout route
router.post("/logout", (req, res) => {
  // Förstör sessionen för att logga ut användaren
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Logout failed.");
    }
    res.clearCookie("connect.sid"); // Ta bort sessionens cookie
    res.send("Logout successful.");
  });
});

export default router;
