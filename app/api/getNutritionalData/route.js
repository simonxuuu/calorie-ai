const api = process.env.GEMINI_API_KEY;
import { isBase64 } from 'is-base64';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { useContext }  from "react";

export async function POST(req) {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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
           "Generate precise nutritional data for this image. Add food items together. Return only 1 JSON object. Add brief feedback. Do not add g. Take into account additional info if any." + additionalInput + "Format: {foodName: \"foodname\", calories: \"0\", carbs: \"0\", fat: \"0\", protein: \"0\", health_score: \"0 (out of 10)\", feedback: \"\"} Do not stray from given format. If the image is not edible, return {foodName: \"NA\"}.",
                { 
                    inlineData: {
                        data: stringBase64,
                        mimeType: imageType
                    },
  
                }
            ], {
                generationConfig: {
                    temperature: 0,
                    maxOutputTokens: 2000,
                    seed: 42069
                }
            });
            let responseText = result.response.text();
            console.log(additionalInput)
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