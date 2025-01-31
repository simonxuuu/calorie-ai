import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import validateJWT from "@/app/utils/supabase/validateJWT";
import {
    S3Client,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
const r2 = new S3Client({
    region: "auto",
    endpoint: `https://eef3717d41c8c6e06e8475573f9ed473.r2.cloudflarestorage.com/`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS as string,
      secretAccessKey: process.env.R2_SECRET as string,
    },
});
const prisma = new PrismaClient();

interface RequestBody {
    jwt: string;
    date: string;
}

export async function POST(req: Request) {
  try {
    const { date, jwt } : RequestBody = await req.json();
    
    if (!date) {
        return NextResponse.json(
          { error: 'Date parameter is required' },
          { status: 400 }
        )
    }
    const validJWT = await validateJWT(jwt);
    const user = validJWT.user;
    if (!user) return NextResponse.json({error:validJWT.response}, {status:validJWT.status});
    

    let logs = await getFoodEntriesForDate(user.id, date)
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
async function getFoodEntriesForDate(userId: string, date: string) {

    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() + 1)
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);
   
    const foodEntries = await prisma.snap.findMany({
        omit: {
            id: true,
            userId: true
        },
      where: {
        userId,
        createdAt: {
          gte: startDate.toISOString(), // Start 
          lt: endDate.toISOString(), // Before next day
        },
      },
      orderBy: { createdAt: "asc" }, // sort by time
    });
    return foodEntries;
}

async function R2Download(userId : string,fileKey: string) {
    const params = {
        Bucket: process.env.R2_BUCKET as string,
        Key: `${userId}/${fileKey}`,
    };
    
    const streamToBuffer = (stream) : Promise<Buffer> => {
        return new Promise((resolve, reject) => {
          const chunks : Buffer[] = [];
          stream.on('data', chunk => chunks.push(chunk));
          stream.on('end', () => resolve(Buffer.concat(chunks)));
          stream.on('error', reject);
        });
     };
      
    const command = new GetObjectCommand(params);
    const res = await r2.send(command);
    const imageBuffer = await streamToBuffer(res.Body);
    return imageBuffer.toString('base64')
}
