import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/appwrite";

export async function POST(req: Request) {
  try {
    const { accountId, password } = (await req.json()) as {
      accountId: string;
      password: string;
    };

    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, password);

    const cookieStore = await cookies(); 
    cookieStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return NextResponse.json({ sessionId: session.$id });
  } catch (error) {
    console.error("verify-secret route error:", error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
