import { NextResponse } from "next/server";
import { handleError } from "@/lib/actions/user.actions";
import { createSessionClient } from "@/lib/appwrite";


export async function POST(req: Request) {
  const {account} = await createSessionClient();

  try {
    await account.deleteSession('current');

  } catch (error) {
    handleError(error, "Failed to sign out user");
  } 

  const res = NextResponse.redirect(new URL("/sign-in", req.url))
  res.cookies.delete("appwrite-session");
  return res;
}