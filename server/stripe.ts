import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

export const initStripe = (): Stripe => {
  const apiKey = process.env.STRIPE_KEY;
  if (!apiKey) {
    throw new Error("Stripe API key is missing");
  }
  return new Stripe(apiKey, {
    apiVersion: "2024-04-10",
  });
};
