import express from 'express';
import { postTransaction } from './transactions.controller';

const transactionsRouter = express.Router();

transactionsRouter.post('/transactions', postTransaction);

export default transactionsRouter;