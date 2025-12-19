import { NextResponse } from "next/server";
import { z } from "zod";
// import { getAdminSession } from "@/src/app/lib/getSession";
import { getAdminSession } from "@/app/lib/getSession";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }
  const { email, password } = parsed.data;

  // Simple credential check from env
  if (
    email === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    const session = await getAdminSession();
    session.isLoggedIn = true;
    session.user = { email };
    await session.save();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "Email atau password salah" }, { status: 401 });
}
