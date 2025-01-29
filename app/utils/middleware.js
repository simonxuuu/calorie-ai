import { NextResponse, NextRequest } from 'next/server'
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req) {
    const res = NextResponse.next();   
    const supabase = createMiddlewareClient({ req, res });
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    return res;
}