import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from 'path';

const GEMINI_API_KEY = "AIzaSyDiEwflOCcG6_T498iE_pmcEHieoScuoig"

const fileManager = new GoogleAIFileManager(GEMINI_API_KEY);
const mediaPath = path.join(process.cwd(), 'mediapath'); // Use absolute path

const uploadResult = await fileManager.uploadFile(
  `${mediaPath}/food1.jpg`,
  {
    mimeType: "image/jpeg",
    displayName: "food image",
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