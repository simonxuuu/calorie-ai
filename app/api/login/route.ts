import { NextResponse } from "next/server";
import validateJWT from "@/app/utils/supabase/validateJWT";
import createDefaultUserDB from "@/app/utils/supabase/createDefaultUserDB";
import findUserDB from "@/app/utils/supabase/findUserDB";



export async function GET(req: Request) {
 
  const url = new URL(req.url).searchParams;
    const jwt = url.get('jwt');
    // Handle missing parameters
    if (!jwt) {
        return NextResponse.json({error:'Missing required query parameters'}, { status: 400 });
    }

  const validJWT = await validateJWT(jwt);
  const user = validJWT.user;
  if (!user) return NextResponse.json({error:validJWT.response}, {status:validJWT.status});
 
  try {
    const dbUser = await findUserDB(user);
    if (!dbUser) throw "User not found in DB";
    return NextResponse.json({ message: dbUser }, { status: 200 });

  } catch (e) {
    if (e == "User not found in DB") {
      try {
        await createDefaultUserDB(user);
        const dbUser = await findUserDB(user);
        return NextResponse.json({ message: dbUser }, { status: 200 });
      } catch {
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
