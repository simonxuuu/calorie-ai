import {
  S3Client,
  PutObjectCommand,
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

/**
 Turns base64 string (w/o prefix) to array buffer.
*/
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);

  // Create a new ArrayBuffer and copy the binary string into it
  const arrayBuffer = new ArrayBuffer(binaryString.length);
  const view = new Uint8Array(arrayBuffer);

  // Convert binary string to an array of bytes
  for (let i = 0; i < binaryString.length; i++) {
    view[i] = binaryString.charCodeAt(i);
  }

  return arrayBuffer;
}

async function R2Upload(userId : string, file: ArrayBuffer, fileName: string, fileType: string) {
  const params = {
    Bucket: process.env.R2_BUCKET as string,
    Key: `${userId}/${fileName}-${Date.now()}`, //timestamp
    Body: Buffer.from(file),
    ContentType: fileType,
  };
  const command = new PutObjectCommand(params);
  await r2.send(command);
  return fileName;
}

async function R2Download(userId : string,fileKey: string) {
    const params = {
        Bucket: process.env.R2_BUCKET as string,
        Key: `${userId}/${fileKey}`,
    };
    const streamToBuffer = async (stream) => {
        const chunks = [];
        for await (const chunk of stream) {
        chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    };
    const command = new GetObjectCommand(params);
    const res = await r2.send(command);
    const imageBuffer = await streamToBuffer(res.Body);
    const fs = require("fs");
    fs.writeFileSync("retrieved-image.jpg", imageBuffer);
}

export async function POST(req) {
  try {
    const { imagePrev } = await req.json();

    if (!imagePrev) {
      throw new Error("No image data provided");
    }
    const imageType = imagePrev
      .split(";base64,")[0]
      .split(":")[1]
      .trim()
      .toString();
    const stringBase64 = imagePrev.split(";base64,")[1].toString();
    
    const file = await R2Upload("test User",
      base64ToArrayBuffer(stringBase64),
      "test",
      imageType
    );
    
    //const file = await S3Download("test-1737951409144");
    try {
      return new Response(JSON.stringify({ result: file }), { status: 200 });
    } catch (error) {
      console.error("Error generating content:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
