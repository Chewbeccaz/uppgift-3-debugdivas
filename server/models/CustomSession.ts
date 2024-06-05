import session, { Session } from "express-session";

export interface CustomSession extends Session {
  isLoggedIn?: boolean;
  userId?: number;
}
