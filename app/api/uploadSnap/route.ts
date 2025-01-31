import { NextResponse } from "next/server";
import supabase from "@/app/supabaseClient";
import { prisma } from "@/app/utils/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} from "@aws-sdk/client-s3";

const r2 = new S3Client({
    region: "auto",
    endpoint: `https://eef3717d41c8c6e06e8475573f9ed473.r2.cloudflarestorage.com/`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS as string,
      secretAccessKey: process.env.R2_SECRET as string,
    },
});
const LLMapi = process.env.GEMINI_API_KEY;

interface RequestBody {
  jwt: string;
  rawData: string;
  additionalInput: string;
}

export async function POST(req: Request) {
  const { jwt, rawData, additionalInput }: RequestBody = await req.json();

  // Validate input
  if (!jwt || !rawData) {
    console.log("User needs to login, auth error");
    if (jwt) console.log("JWT exists:");
    if (rawData) console.log("Raw data exists:");
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
    const genAI = new GoogleGenerativeAI(LLMapi);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });
    model.generationConfig = {
        temperature: 0,
        maxOutputTokens: 2000
    }
    try {
      const result = await model.generateContent(
        [
          "Generate precise nutritional data for this image. Add food items together. Return only 1 JSON object. Add brief feedback. Do not add g. Take into account additional info if any." +
            additionalInput +
            'Format: {foodName: "", calories: "0", carbs: "0", fat: "0", protein: "0", health_score: "10", description: "",feedback: ""} Do not stray from given format. If the image is not edible, return {foodName: "NA"}.',
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

      const r2AccessKey = await R2Upload(user.id,
        base64ToArrayBuffer(stringBase64),
        imageType
      );

      try {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
           snaps:{
            create: {
                foodName : res.foodName,
                calories : res.calories,
                carbs : res.carbs,
                description : res.description,
                fat : res.fat,
                feedback : res.feedback,
                protein : res.protein,
                healthScore : res.health_score,
                imageKey : r2AccessKey,
                createdAt : new Date()
              },
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
}


/**
 Turns base64 string (w/o prefix) to array buffer.
*/
function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
  
    // Create a new ArrayBuffer and copy the binary string into it
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const view = new Uint8Array(arrayBuffer);
  
    // Convert binary string to an array of bytes
    for (let i = 0; i < binaryString.length; i++) {
      view[i] = binaryString.charCodeAt(i);
    }
  
    return arrayBuffer;
}

async function R2Upload(userId : string, file: ArrayBuffer, fileType: string) {
    const accessKey = `${Date.now()}`;
    const params = {
      Bucket: process.env.R2_BUCKET as string,
      Key: `${userId}/${accessKey}`, //timestamp
      Body: Buffer.from(file),
      ContentType: fileType,
    };
    const command = new PutObjectCommand(params);
    await r2.send(command);
    return accessKey;
}
  
async function R2Download(userId : string,fileKey: string) {
    const params = {
        Bucket: process.env.R2_BUCKET as string,
        Key: `${userId}/${fileKey}`,
    };
    const streamToBuffer = async (stream) => {
        const chunks = [];
        for await (const chunk of stream) {
        chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    };
    const command = new GetObjectCommand(params);
    const res = await r2.send(command);
    const imageBuffer = await streamToBuffer(res.Body);
    const fs = require("fs");
    fs.writeFileSync("retrieved-image.jpg", imageBuffer);
}

