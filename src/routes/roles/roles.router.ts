import express from 'express';
import { getRolesSelect } from './roles.controller';

const rolesRouter = express.Router();

rolesRouter.get('/api/roles/select', getRolesSelect);

export default rolesRouter;