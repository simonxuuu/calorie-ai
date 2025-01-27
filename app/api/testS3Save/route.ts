import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS as string,
    secretAccessKey: process.env.AWS_SECRET as string,
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

async function S3Upload(file: ArrayBuffer, fileName: string, fileType: string) {
  const params = {
    Bucket: process.env.AWS_BUCKET as string,
    Key: `testUser/${fileName}-${Date.now()}`, //timestamp
    Body: Buffer.from(file),
    ContentType: fileType,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);
  return fileName;
}

async function S3Download(fileKey: string) {
  const params = {
    Bucket: process.env.AWS_BUCKET as string,
    Key: `testUser/${fileKey}`,
  };
  const streamToBuffer = async (stream) => {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  };
  const command = new GetObjectCommand(params);
  const res = await s3.send(command);
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
    /*
    const file = await S3Upload(
      base64ToArrayBuffer(stringBase64),
      "test",
      imageType
    );
    */
    const file = await S3Download("test-1737951409144");
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
