export async function POST(req) {
    try {
        const data = await req.json();
        
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response('Invalid JSON', { status: 400 });
    }
}