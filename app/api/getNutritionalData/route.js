const api = process.env.GEMINI_API_KEY;
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    try {
        const { imagePrev, additionalInput } = await req.json();

        if (!imagePrev) {
            throw new Error("No image data provided");
        }

        const imageType = imagePrev.split(';base64,')[0].split(':')[1].trim();
        const stringBase64 = imagePrev.split(';base64,')[1];
        const genAI = new GoogleGenerativeAI(api);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const schema = {
            "type": "object",
            "properties": {
                "foodName": { "type": "string" },
                "calories": { "type": "integer" },
                "carbs": { "type": "integer" },
                "fat": { "type": "integer" },
                "protein": { "type": "integer" },
                "health_score": { "type": "integer", "maximum": 10 },
                "feedback": { "type": "string" }
            },
            "required": ["foodName", "calories", "carbs", "fat", "protein", "health_score", "feedback"]
        };


        try {
            const result = await model.generateContent([
                {
                    "text": `Generate precise nutritional data for this image based on the provided schema. Don't add new lines. ${additionalInput} Capitalize food name properly. If there are multiple food items, add them all together. Return only valid JSON conforming to the schema. Add well-written, thoughtful, professional feedback in 'meal' talking about it for health.  If the image is not edible, return {"name": "NA"}.`,
                },
                {
                    "schema": JSON.stringify(schema)
                },
                { 
                    "inlineData": {
                        "data": stringBase64,
                        "mimeType": imageType
                    },
                }
            ], {
                generationConfig: {
                    temperature: 0,
                    maxOutputTokens: 2000,
                }
            });

            const responseText = result.response.text();
            console.log(responseText);

            try {
                const res = JSON.parse(responseText);
                if (res.name === 'NA') {
                    throw new Error('This is not edible');
                }
                return new Response(JSON.stringify({ result: res }), { status: 200 });
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError, "Original response:", responseText);
                return new Response(JSON.stringify({ error: "Invalid JSON returned from Gemini: " + parseError.message, originalResponse: responseText }), { status: 500 });
            }

        } catch (error) {
            console.error("Error generating content:", error);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}