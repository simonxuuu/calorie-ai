import { NextResponse } from "next/server";
import supabase from "@/app/supabaseClient";
import { prisma } from "@/app/utils/prisma";
import createDefaultUser from "@/app/utils/supabase/createDefaultUser";
interface RequestBody {
  jwt: string;
}

export async function POST(req: Request) {
  const { jwt }: RequestBody = await req.json();

  // Validate input
  if (!jwt) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  // Validate JWT
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(jwt);
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      omit: {
        id: true,
      },
      where: {
        id: user.id,
      },
    });
    if (!dbUser) throw "User not found in DB";
    return NextResponse.json({ message: dbUser }, { status: 200 });
  } catch (e) {
    if (e == "User not found in DB") {
      try {
        await createDefaultUser(user);
        const dbUser = await prisma.user.findUnique({
          omit: {
            id: true,
          },
          where: {
            id: user.id,
          },
        });
        return NextResponse.json({ message: dbUser }, { status: 200 });
      } catch {
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
