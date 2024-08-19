import express from 'express';
import { getAllUsers, getUserLogin, postUser } from './users.controller';

const usersRouter = express.Router();

usersRouter.get('/api/users', getAllUsers);
usersRouter.get('/api/users/me', getUserLogin)
usersRouter.get('/api/user/:id');
usersRouter.post('/api/user', postUser)

export default usersRouter;