import express from 'express';
import { getAllUsers, postUser } from './users.controller';

const usersRouter = express.Router();

usersRouter.get('/users', getAllUsers);
usersRouter.get('/users/:id');
usersRouter.post('/users', postUser)

export default usersRouter;