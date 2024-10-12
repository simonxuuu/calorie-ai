const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/*

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const result = await model.generateContent(["Explain how AI works"]);
    console.log(result.response.text());
  }
  run();


*/

export async function GET(req) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
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
        
        const imageType = imageFile.type
        

        const imageName = imageFile.name;

        console.log(imageName)

        return new Response(JSON.stringify({ message: 'Image received successfully', imageName: imageName }), { status: 200 });
    } catch (error) {
        // Handle any errors
        return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
    }
}
// curl -X POST http://localhost:3000/api/nutritionalValues -F "image=@/public/images/food1.jpg"
// curl -X POST http://localhost:3000/api/nutritionalValues -H "Content-Type: application/json" -d '{"prompt": "Explain how AI works"}'