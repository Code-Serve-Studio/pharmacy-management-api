import express from 'express';
import { getAllUsers, postUser } from './users.controller';

const usersRouter = express.Router();

usersRouter.get('/api/users', getAllUsers);
usersRouter.get('/users/:id');
usersRouter.post('/api/users', postUser)

export default usersRouter;