import express from 'express';
import { getAllUsers } from './users.controller';

const usersRouter = express.Router();

usersRouter.get('/users', getAllUsers)

export default usersRouter;