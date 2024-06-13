import express, { Router } from "express";
import mysql from "mysql2/promise";
import dbConfig from "../db/config";
import session, { Session } from "express-session";
import bcrypt from "bcrypt";
import { CustomSession } from "../models/CustomSession";
import { initStripe } from "../stripe";
import { RowDataPacket } from "mysql2/promise";

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

//****************************** GET USERS SUBSCRIPTION ************************************/

//DUBBELKOLLA SÅ INTE DENNA PAJAR FÖR MYPAGE:

router.get("/subscription/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const db = await mysql.createConnection(dbConfig);

    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT subscription_id FROM users WHERE _id = ?",
      [userId]
    );

    if (rows.length > 0) {
      res.json({ subscriptionId: rows[0].subscription_id });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).send("Internal Server Error");
  }
});

//DUBBELKOLLA OM MAN KAN ÅTERANVÄNDA DENNA NEDAN FÖR ÄVEN MYPAGE.?
router.get("/subscriptiondata/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const db = await mysql.createConnection(dbConfig);

    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT u.subscription_id, s.status 
       FROM users u
       JOIN subscriptions s ON u._id = s.user_id
       WHERE u._id = ?`,
      [userId]
    );

    if (rows.length > 0) {
      res.json({
        subscriptionId: rows[0].subscription_id,
        status: rows[0].status,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }

    await db.end();
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).send("Internal Server Error");
  }
});

/******************* delete  - CANCEL SUB: **********************/
  //Just nu gör inte endpointen så mycket, då det är osäkert hur vi ska göra med databasen och stripe/webhook. Detta är bara en start 
  
// router.delete("/cancel-subscription", async (req, res) => {
  // const { userId } = req.body;
  // try {
     // const db = await mysql.createConnection(dbConfig);
      //const query = `
        //  DELETE FROM subscriptions
          //WHERE user_id = ?
      //`;
      //await db.query(query, [userId]);
      //res.status(200).json({ message: "Subscription canceled successfully" });
  //} catch (error) {
    //  console.error("Error canceling subscription:", error);
     // res.status(500).json({ error: "Internal Server Error" });
  //}
//});

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const db = await mysql.createConnection(dbConfig);
//     const query = `SELECT * FROM users WHERE email = ?`;
//     const [results]: [any[], any] = await db.query(query, [email]);

//     // await db.end();

//     if (results.length > 0) {
//       const user = results[0];
//       console.log("User found:", user);
//       const passwordMatch = await bcrypt.compare(password, user.password);

//       if (passwordMatch) {
//         console.log("Password match:", passwordMatch);
//         (req.session as CustomSession).isLoggedIn = true;
//         (req.session as CustomSession).userId = user._id;
//         console.log(user);
//         res.status(200).json({
//           message: "Login successful",
//           user: user._id,
//           sessionId: req.sessionID,
//         });
//       } else {
//         console.log("Invalid password");
//         res.status(401).json({ message: "Invalid email or password" });
//       }
//     } else {
//       console.log("User not found");
//       res.status(401).json({ message: "Invalid email or password" });
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
    const query = `SELECT * FROM users WHERE email =?`;
    const [results]: [any[], any] = await db.query(query, [email]);

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
        // Uppdatera detta med detaljerad felinformation
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      console.log("User not found");
      // Uppdatera detta med detaljerad felinformation
      res.status(401).json({ message: "Invalid email or password"});
    }
  } catch (error) {
    console.error("Error during login:", error);
    // Hantera generella fel med detaljerad information
    res.status(500).json({ message: "Internal Server Error"});
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
