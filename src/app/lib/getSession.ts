// src/lib/getSession.ts
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { AdminSessionData, sessionOptions } from "./session";

export async function getAdminSession() {
  const c = await cookies();
  return getIronSession<AdminSessionData>(c, sessionOptions);
}
