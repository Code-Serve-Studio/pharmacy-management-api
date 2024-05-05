import { Request, Response, NextFunction } from "express";
import usersModel from "@models/users.model";
import { UserPayload } from "@src/types/request";


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

const postUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {email, password, username, fullName, roleId} = req.body as UserPayload;
    const userId = await usersModel.addUser({email, password, username, fullName, roleId});


    const response = {
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId
      }
    }

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export {
  getAllUsers,
  postUser
}