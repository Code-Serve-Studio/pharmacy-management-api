import express from 'express';
import { getGroup } from './group.controller';

const groupRouter = express.Router();

groupRouter.get('/api/group', getGroup)

export default groupRouter;