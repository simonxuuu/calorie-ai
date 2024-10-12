import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Bun } from "bun";

process.env.API_KEY = process.env.GEMINI_API_KEY;

// Adjust the path if needed 
const mediaPath = './uploads/';

export async function POST(req) {
  try {
    // 1. Handle File Upload (assuming you're using a framework like Express.js)
    const formData = await req.formData(); 
    const file = formData.get('image'); // Assuming the image is sent with the key 'image'

    if (!file) {
      return new Response("No image file found in the request", { status: 400 });
    }

    // Save the uploaded image locally (adjust path and filename as needed)
    const fileName = `${Date.now()}-${file.name}`; 
    const filePath = `${mediaPath}/${fileName}`;
    await Bun.write(filePath, file.stream());

    // 2. Analyze the Image using GoogleAI
    const fileManager = new GoogleAIFileManager(process.env.API_KEY);
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType: file.type,
      displayName: file.name,
    });

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      "Tell me about this image.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    // 3. Return the Response
    return new Response(JSON.stringify({ description: result.response.text() }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response("An error occurred while processing the image", { status: 500 });
  }
}