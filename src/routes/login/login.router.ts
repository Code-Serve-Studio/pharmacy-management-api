import express from 'express'
import { authentication } from './login.controller';

const loginRouter = express.Router();

loginRouter.post('/api/login', authentication);

export default loginRouter;