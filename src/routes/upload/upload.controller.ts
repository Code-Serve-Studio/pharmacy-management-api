import { NextFunction, Request, Response } from "express";

const postUploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file?.filename;

    if (!file) {
      return res.status(400).send({
        status: false,
        data: "No file is selected.",
      });
    }

    const urlImage = `${req.protocol}://${req.get('host')}/public/${file}`;
    res.send(urlImage);
  } catch (error) {
    next(error);
  }
}

export {
  postUploadImage,
}