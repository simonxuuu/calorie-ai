import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

const GEMINI_API_KEY = "AIzaSyDiEwflOCcG6_T498iE_pmcEHieoScuoig";

const fileManager = new GoogleAIFileManager(GEMINI_API_KEY);
const mediaPath = path.join(process.cwd(), 'mediapath'); // Use absolute path

// Read the image file and convert it to base64
const imagePath = `${mediaPath}/food1.jpg`;
const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

const uploadResult = await fileManager.uploadFile(
  imageBase64,
  {
    mimeType: "image/jpeg",
    displayName: "food image",
    isBase64: true, // Indicate that the file is base64 encoded
  },
);

// View the response.
console.log(
  `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
);

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const result = await model.generateContent([
  "Tell me about this image.",
  {
    fileData: {
      fileUri: uploadResult.file.uri,
      mimeType: uploadResult.file.mimeType,
    },
  },
]);
console.log(result.response.text());