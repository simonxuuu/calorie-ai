const api = process.env.GEMINI_API_KEY;
import {isBase64} from 'is-base64';
import { GoogleGenerativeAI} from "@google/generative-ai";

export async function POST(req) {
    try {
        let imagePrev = await req.text();
        if (!imagePrev) {
            throw new Error("No image data provided");
        }
        const imageType = imagePrev.split(';base64,')[0].split(':')[1].trim().toString();
        const stringBase64 =  imagePrev.split(';base64,')[1].toString(); 
        const genAI = new GoogleGenerativeAI(api);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        try {
        const result = await model.generateContent([
            "Analyze the contents of the image. If it's not a food/beverage/consumable, return the json {'error' : 'Not a food.'}.Otherwise, return a json like this: {'foodData':{'foodName':foodname,'calories':calories,'protein':protein,'carbohydrates':carbohydrates,'fats':fats}} but replace the json values with the actual predicted/estimated values of the food or drink shown.",
            {
              inlineData: {
                data: stringBase64,
                mimeType: imageType
              }
            }
          ]);
          
          return new Response(JSON.stringify({ result : result.response.text() }), { status: 200 });
        } catch (error) {
            // Error handling
            // Log the error details for debugging
            console.error("Error generating content:", error);
        
            
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
          }  
        
        
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
