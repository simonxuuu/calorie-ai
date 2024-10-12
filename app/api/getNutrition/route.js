import OpenAI from 'openai';
const API_KEY = process.env.OPENAI_API_KEY;

const client = new OpenAI({ apiKey: API_KEY });


export async function GET(req) {
    const response = await client.chat.completions.create({
        messages: [{ role: 'user', content: 'Say this is a test' }],
        model: 'gpt-4o-mini'
    }).asResponse();
    
    // access the underlying Response object
    console.log(response.headers.get('x-ratelimit-limit-tokens'));
    return new Response(JSON.stringify({ message: "Hello World" }), { status: 200 });
}