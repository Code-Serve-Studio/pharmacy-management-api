import express from 'express';
import { deleteUser, getAllUsers, getDetailUser, getUserLogin, postUser, putResetPassword, putStatusUser, putUser } from './users.controller';

const usersRouter = express.Router();

usersRouter.get('/api/users', getAllUsers);
usersRouter.get('/api/users/me', getUserLogin);
usersRouter.get('/api/user/:id', getDetailUser);
usersRouter.post('/api/user', postUser);
usersRouter.put('/api/user/:id', putUser);
usersRouter.put('/api/user/reset-password/:id', putResetPassword);
usersRouter.put('/api/user/status/:id', putStatusUser);
usersRouter.delete('/api/user/:id', deleteUser);

export default usersRouter;