import e, { Request, Response, NextFunction } from "express";
import usersModel from "@models/users.model";
import { UserPayload } from "@src/types/request";
import { getUserId } from "@utils/tokenManager";
import rolesModel from "@models/roles.model";
import InvariantError from "@src/exceptions/InvariantError";


const getAllUsers = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const users = await usersModel.selectUsers();
  
    const response = {
      status: 'success',
      data: users
    }
  
    return res.json(response);
  } catch (error) {
    next(error);
  }
}

const postUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {email, password, username, fullName, roleId, image} = req.body as UserPayload;
    const userId = await usersModel.addUser({email, password, username, fullName, roleId, image});


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

const getUserLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if(authHeader){
      const token = authHeader.split(' ')[1];
      let permission = {}
      
      const users = getUserId(token);
      if(users?.roleId){
        permission = await rolesModel.selectDetailRole(users.roleId);
      }      
      
      res.status(200).json({
        status: 'success',
        data: {
          ...users,
          ...permission,
        }
      })
    } else {
      res.status(401).json({
        status: 'fail',
        message: 'Unauthorized'
      })
    }
  } catch (error) {
    next(error);
  }
}

const getDetailUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string | number
    const user = await usersModel.selectUserById(id);

    const response = {
      status: 'success',
      data: user,
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

const putUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string | number
    const {email, password, username, fullName, roleId, image} = req.body as UserPayload;
    const userId = await usersModel.updateUser({email, username, fullName, roleId, image, id});


    const response = {
      status: 'success',
      message: 'User berhasil diupdate',
      data: {
        userId
      }
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

const putResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try { 
    const id = req.params.id as string | number
    const password = req.body.password as string;
    const passwordConfirmation = req.body.passwordConfirmation as string;
    if(password !== passwordConfirmation){
      throw new InvariantError('Password tidak sama');
    }
    const authHeader = req.headers.authorization;
    if(authHeader){
      await usersModel.updatePassword(id, password);
      
      res.status(200).json({
        status: 'success',
        message: 'Password berhasil diupdate',
        data: {
          id
        }
      })
    } 
  } catch (error) {
    next(error);
  }
}

const putStatusUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string | number
    const {status} = req.body;
    const userId = await usersModel.updateStatus(id, status);
    const response = {
      status: 'success',
      message: 'User berhasil diupdate',
      data: {
        userId
      }
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string | number
    const userId = await usersModel.deleteUser(id);
    const response = {
      status: 'success',
      message: 'User berhasil dihapus',
      data: {
        userId
      }
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export {
  getAllUsers,
  postUser,
  getUserLogin,
  getDetailUser,
  putUser,
  putResetPassword,
  putStatusUser,
  deleteUser,
}