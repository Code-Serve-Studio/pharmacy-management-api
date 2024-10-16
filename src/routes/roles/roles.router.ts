import express from 'express';
import { createRole, getRolesSelect } from './roles.controller';

const rolesRouter = express.Router();

rolesRouter.get('/api/roles', getRolesSelect);
rolesRouter.post('/api/roles', createRole);

export default rolesRouter;