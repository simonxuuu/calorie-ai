import { NextResponse } from "next/server";
import supabase from "@/app/supabaseClient";
import { prisma } from "@/app/utils/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface RequestBody {
  jwt: string;
  rawData: string;
  additionalInput: string;
}
interface Snap {
    foodName : string;
}

const api = process.env.GEMINI_API_KEY;
export async function POST(req: Request) {
  const { jwt, rawData, additionalInput }: RequestBody = await req.json();

  // Validate input
  if (!jwt || !rawData) {
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
    const imageType = rawData
      .split(";base64,")[0]
      .split(":")[1]
      .trim()
      .toString();
    const stringBase64 = rawData.split(";base64,")[1].toString();
    const genAI = new GoogleGenerativeAI(api);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    model.generationConfig = {
        temperature: 0,
        maxOutputTokens: 2000
    }
    try {
      const result = await model.generateContent(
        [
          "Generate precise nutritional data for this image. Add food items together. Return only 1 JSON object. Add brief feedback. Do not add g. Take into account additional info if any." +
            additionalInput +
            'Format: {foodName: "", calories: "0", carbs: "0", fat: "0", protein: "0", health_score: "0 (out of 10)", description: "",feedback: ""} Do not stray from given format. If the image is not edible, return {foodName: "NA"}.',
          {
            inlineData: {
              data: stringBase64,
              mimeType: imageType,
            },
          },
        ]
      );
      let responseText = result.response.text();
      responseText = responseText
        .replace(/```/g, "")
        .replace(/\n/g, "")
        .replace(/\r/g, "")
        .replace(/json\{/g, "{")
        .replace(/'/g, '"')
        .trim();
      const res = JSON.parse(responseText);
      console.log(res);
      if (res.foodName === "NA") {
        throw new Error("This is not edible");
      }

      const snapData: Snap = {
        foodName: res.foodName,
      };

      try {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
           snaps:{
            create: [
                snapData
              ],
           }
          },
        });
      } catch (error) {
        console.error('Error updating user:', error);
      } 
     
      return NextResponse.json(
        { message: res },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error generating content:", error);
      return NextResponse.json({ error: "Error generating content" }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });

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
