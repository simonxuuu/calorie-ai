import { NextResponse } from "next/server";
import supabase from "../../supabaseClient";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
console.log('init ');
interface RequestBody {
  requestType: string;
  jwt: string;
}

interface UserData {
  id: string;
  email?: string;
}

export async function POST(req: Request) {
  try {
    const { requestType, jwt }: RequestBody = await req.json();

    // Validate input
    if (!requestType || !jwt) {
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle requests
    switch (requestType) {
      case "login":
        return handleLogin({ id: user.id });
      case "register":
        return handleRegister({ id: user.id, email: user.email });
      default:
        return NextResponse.json(
          { error: "Invalid request type" },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleRegister({ id, email }: UserData) {
  try {
    await prisma.user.create({
      data: {
        id: id,
        email: email,
        snaps: {
          create: [], // No logs are created, effectively an empty array for logs
        },
      },
    });
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}

async function handleLogin({ id }: UserData) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return NextResponse.json(
      { message: "User found successfully." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}
