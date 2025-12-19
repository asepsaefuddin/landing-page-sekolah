import { NextResponse } from "next/server";
// import { getAdminSession } from "@/src/app/lib/getSession";
import { getAdminSession } from "@/app/lib/getSession";


export async function POST() {
  const session = await getAdminSession();
  session.destroy();
  return NextResponse.json({ ok: true });
}
