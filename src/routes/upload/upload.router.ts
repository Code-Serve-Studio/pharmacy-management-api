import express from 'express';
import multer from 'multer';
import { postUploadImage } from './upload.controller';
import path from 'path';

const imageRouter = express.Router();
try {
  const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log(__dirname);
      
      cb(null, path.join("src/public"))
    },
    filename: (req, file, cb) => {
      
      const uniqueFilename = `${Date.now()}_${file.originalname}`;
      cb(null, uniqueFilename)
    }
  })
  
  
  imageRouter.post('/api/upload/image', multer({storage: diskStorage}).single('image'), postUploadImage);
  
} catch (error) {
  console.log(error);
  
}

export default imageRouter;