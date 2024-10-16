import express from 'express';
import multer from 'multer';
import { postUploadImage } from './upload.controller';
import path from 'path';
import fs from 'fs';

const imageRouter = express.Router();

try {
  const uploadPath = path.join(__dirname, '../../public');

  // Cek apakah folder public ada, jika tidak buat folder tersebut
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log('Upload Path:', uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueFilename = `${Date.now()}_${file.originalname}`;
      cb(null, uniqueFilename);
    }
  });

  imageRouter.post('/api/upload/image', multer({ storage: diskStorage }).single('image'), postUploadImage);

} catch (error) {
  console.log(error);
}

export default imageRouter;