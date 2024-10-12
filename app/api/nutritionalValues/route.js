import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const fileManager = new GoogleAIFileManager(process.env.API_KEY);
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export async function GET(req) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(["Explain how AI works"]);
    console.log(result.response.text());
    return new Response(JSON.stringify({ result }), { status: 200 });
}

export async function POST(req) {
    const formData = await req.formData();
    try {
        const imageFile = formData.get('image');

        if (!imageFile) {
            return new Response(JSON.stringify({ message: 'No image file provided' }), { status: 400 });
        }

      
        const uploadResult = await fileManager.uploadFile(imageFile.stream(), {
            mimeType: imageFile.type,
            displayName: imageFile.name,
        });

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

        const generatedText = result.response.text();
        console.log(generatedText);

        return new Response(JSON.stringify({ message: 'Image processed successfully', generatedText }), { status: 200 });
    } catch (error) {
        // Handle any errors
        return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
    }
}