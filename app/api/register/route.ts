import { NextResponse } from "next/server";
import validateJWT from "@/app/utils/supabase/validateJWT";
import createDefaultUser from "@/app/utils/supabase/createDefaultUserDB"

interface RequestBody {
  jwt: string;
}

export async function POST(req: Request) {
  
    const { jwt }: RequestBody = await req.json();
    const validJWT = await validateJWT(jwt);
    const user = validJWT.user;
    if (!user) return NextResponse.json({error:validJWT.response}, {status:validJWT.status});

    try {
        await createDefaultUser(user);
        return NextResponse.json(
          { message: "Success - User Registered" },
          { status: 200 }
        );
    } catch {
        return NextResponse.json({ error: "Register failed" }, { status: 500 });
    }
}
