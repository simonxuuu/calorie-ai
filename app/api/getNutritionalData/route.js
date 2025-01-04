const api = process.env.GEMINI_API_KEY;
import { isBase64 } from 'is-base64';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    try {
        const { imagePrev, additionalInput } = await req.json();
        
        if (!imagePrev) {
            throw new Error("No image data provided");
        }
        
        const imageType = imagePrev.split(';base64,')[0].split(':')[1].trim().toString();
        const stringBase64 = imagePrev.split(';base64,')[1].toString();
        const genAI = new GoogleGenerativeAI(api);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log(additionalInput)
        try {
            const result = await model.generateContent([
           "Generate precise nutritional data for this image. Don't send new lines. " + additionalInput + " Capitalize food name properly. If there are multiple food items, add them all together. Return only 1 JSON object. Add well-written, thoughtful, professional feedback in the meal talking about it for health. Format: {foodName: \"foodname\", calories: \"0\", carbs: \"0\", fat: \"0\", protein: \"0\", health_score: \"0 (out of 10)\", feedback: \"\"} If the image is not edible, return {foodName: \"NA\"}.",
                { 
                    inlineData: {
                        data: stringBase64,
                        mimeType: imageType
                    },
  
                }
            ], {
                generationConfig: {
                    temperature: 0,
                    maxOutputTokens: 2000
                }
            });
            let responseText = result.response.text();
            responseText = responseText
            .replace(/```/g, '')
            .replace(/\n/g, '')
            .replace(/\r/g, '')
            .replace(/json\{/g, '{')
            .replace(/'/g, '"')
            .trim();
            const res = JSON.parse(responseText);
            console.log(res);
            if (res.foodName === 'NA') {
                throw new Error('This is not edible');
            }

            return new Response(JSON.stringify({ result: res }), { status: 200 });
        } catch (error) {
            console.error("Error generating content:", error);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}