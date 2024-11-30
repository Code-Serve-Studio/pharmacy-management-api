import express from 'express';
import { createRole, getDetailRole, getRoles, getRolesSelect, updateRole } from './roles.controller';

const rolesRouter = express.Router();

rolesRouter.get('/api/roles', getRoles);
rolesRouter.post('/api/roles', createRole);
rolesRouter.get('/api/roles/select', getRolesSelect);
rolesRouter.get('/api/role/:id', getDetailRole);
rolesRouter.put('/api/role/:id', updateRole);

export default rolesRouter;