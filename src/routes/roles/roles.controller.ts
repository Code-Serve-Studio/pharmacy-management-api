import rolesModel from "@models/roles.model";
import { NextFunction, Request, Response } from "express";

const getRolesSelect = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await rolesModel.selectRoles();

    const response = {
      status: 'success',
      data: roles.map(item => ({label: item.name, value: item.id}))
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

const getRoles = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await rolesModel.selectRoles();

    const response = {
      status: 'success',
      data: roles
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

const createRole = async (req: Request, res: Response, next: NextFunction) => {
  const {roleName, permissions} = req.body;
  try {
    const result =  await rolesModel.postRole({roleName, permissions});
    const response = {
      status: 'success',
      data: {
        roleId: result
      }
    }
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

const getDetailRole = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  try {
    const result = await rolesModel.selectDetailRole(Number(id));
    const response = {
      status: 'success',
      data: result
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  const {roleName, permissions} = req.body;
  const id = req.params.id;
  try {
    const result = await rolesModel.putRole({permissions, roleId: Number(id)});
    const response = {
      status: 'success',
      data: {
        roleId: result
      }
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export {
  getRolesSelect,
  createRole,
  getRoles,
  getDetailRole,
  updateRole,
}