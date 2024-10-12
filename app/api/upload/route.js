import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing
  },
};

const uploadDir = path.join(process.cwd(), '/public/uploads'); // Set your upload directory

export async function POST(req, res) {
  try{
  const form = new formidable.IncomingForm();

  // Create the upload directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'File upload error.' });
    }

    const file = files.file[0];
    const newFilePath = path.join(uploadDir, file.originalFilename);

    // Move the file to the new location
    fs.rename(file.filepath, newFilePath, (err) => {
      if (err) {
        return res.status(500).json({ error: 'File save error.' });
      }
      res.status(200).json({ path: `/uploads/${file.originalFilename}` });
    });
  });
} catch(error){
  console.log(error);
}
}
