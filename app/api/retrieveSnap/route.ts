/**
 * Route handler for retrieving food snap entries with images from R2 storage
 * Provides authenticated access to user's food logs within a specified date range
 */

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import validateJWT from "@/app/utils/supabase/validateJWT";
import {
    S3Client,
    GetObjectCommand,
} from "@aws-sdk/client-s3";

// Initialize R2 (Cloudflare) S3-compatible storage client
const r2 = new S3Client({
    region: "auto",
    endpoint: `https://eef3717d41c8c6e06e8475573f9ed473.r2.cloudflarestorage.com/`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS as string,
      secretAccessKey: process.env.R2_SECRET as string,
    },
});

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

/**
 * GET handler for retrieving food snaps
 * @param req Request object containing query parameters:
 *   - gle: Start date (UTC) for fetching snaps
 *   - lt: End date (UTC) for fetching snaps
 *   - jwt: Authentication token
 * @returns JSON response with food entries and their images
 */
export async function GET(req: Request) {
  try {
    // Extract query parameters
    const url = new URL(req.url).searchParams;
    const gle = url.get('gle'); //start utc date for fetch snap
    const lt = url.get('lt'); // end utc date for fetch snap
    const jwt = url.get('jwt');
    
    // Validate required parameters
    if (!gle || !lt || !jwt) {
      return NextResponse.json({error:'Missing required query parameters'}, { status: 400 });
    }
    
    // Validate JWT and get user
    const validJWT = await validateJWT(jwt);
    const user = validJWT.user;
    if (!user) return NextResponse.json({error:validJWT.response}, {status:validJWT.status});
    
    // Fetch food entries and their corresponding images
    let logs = await getFoodEntriesForDate(user.id, gle, lt)
    for (let log of logs) {
        if (!log['imageKey']) continue;
        log['image'] = await R2Download(user.id,log['imageKey']);
        log['imageKey'] = null;
    }    
    return NextResponse.json(logs, {status: 200})

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

/**
 * Retrieves food entries for a user within a specified date range
 * @param userId User identifier
 * @param gte Start date
 * @param lt End date
 * @returns Array of food entries sorted by creation time
 */
async function getFoodEntriesForDate(userId: string, gte: string, lt:string) {
    const foodEntries = await prisma.snap.findMany({
        omit: {
            id: true,
            userId: true
        },
      where: {
        userId,
        createdAt: {
          gte, // Start date
          lt, // End date
        },
      },
      orderBy: { createdAt: "asc" }, // Sort by creation time
    });
    
    return foodEntries;
}

/**
 * Downloads and converts an image from R2 storage to base64
 * @param userId User identifier for folder path
 * @param fileKey Unique file identifier
 * @returns Base64 encoded image string
 */
async function R2Download(userId : string, fileKey: string) {
    // Set up S3 parameters with user-specific path
    const params = {
        Bucket: process.env.R2_BUCKET as string,
        Key: `${userId}/${fileKey}`,
    };
    
    // Helper function to convert stream to buffer
    const streamToBuffer = (stream) : Promise<Buffer> => {
        return new Promise((resolve, reject) => {
          const chunks : Buffer[] = [];
          stream.on('data', chunk => chunks.push(chunk));
          stream.on('end', () => resolve(Buffer.concat(chunks)));
          stream.on('error', reject);
        });
     };
      
    // Fetch and convert image to base64
    const command = new GetObjectCommand(params);
    const res = await r2.send(command);
    const imageBuffer = await streamToBuffer(res.Body);
    return imageBuffer.toString('base64')
}