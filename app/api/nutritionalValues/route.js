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
    const {imagePrev} = req.body;
    return new Response(JSON.stringify({ imagePrev }), { status: 200 });
    const base64Data = imagePrev.split(',')[1];
    const response = await fetch(`https://api.gemini.com/${process.env.API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // If needed
        },
        body: JSON.stringify({
            image: base64Data // Adjust as per API requirements
        })
    });

    if (response.ok) {
        const result = await response.json();
        return result;
    } else {
        console.error('Error:', response.statusText);
    }
}