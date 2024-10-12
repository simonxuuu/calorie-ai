import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

const GEMINI_API_KEY = process.env.API_KEY;

const fileManager = new GoogleAIFileManager(GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(req) {
    try {
        const imagePrev = await req.text();
        console.log("Received image data:", imagePrev);

        if (!imagePrev) {
            throw new Error("No image data provided");
        }

        

        const mediaPath = path.join(process.cwd(), 'mediapath');
        const imagePath = `${mediaPath}/uploaded_image.jpg`;

        // Save the base64 image to a file
        fs.writeFileSync(imagePath, imagePrev, { encoding: 'base64' });

        // Read the image file and convert it to base64
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

        const uploadResult = await fileManager.uploadFile(
            imageBase64,
            {
                mimeType: "image/jpeg",
                displayName: "uploaded image",
                isBase64: true,
            },
        );

        console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`);

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

        console.log(result.response.text());
        return new Response(JSON.stringify({ result }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}