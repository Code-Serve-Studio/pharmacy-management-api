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

export {
  getRolesSelect,
}