import { NextResponse } from "next/server";
import supabase from "@/app/supabaseClient";
import { prisma } from "@/app/utils/prisma";

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
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            snaps: {
              create: [], // No logs are created, effectively an empty array for logs
            },
          },
        });
        return NextResponse.json(
          { message: "Success - User Registered" },
          { status: 200 }
        );
    } catch {
        return NextResponse.json({ error: "Register failed" }, { status: 500 });
    }
}
