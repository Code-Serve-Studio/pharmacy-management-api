import { Request, Response, NextFunction } from "express";

const getAllUsers = async (req: Request, res: Response) => {
  const users = [
    {
      name: 'ilham'
    },
    {
      name: 'naufal'
    },
  ];

  const response = {
    status: 'success',
    data: users
  }

  return res.json(response);
}

export {
  getAllUsers,
}