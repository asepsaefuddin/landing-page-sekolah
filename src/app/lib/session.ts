import { SessionOptions } from "iron-session";

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: process.env.SESSION_COOKIE_NAME || "ppdb_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export type AdminSessionData = {
  isLoggedIn: boolean;
  user?: { email: string };
};
