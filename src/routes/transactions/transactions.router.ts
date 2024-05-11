import express from 'express';
import { getTransactions, postTransaction } from './transactions.controller';

const transactionsRouter = express.Router();

transactionsRouter.post('/transactions', postTransaction);
transactionsRouter.get('/transactions', getTransactions)

export default transactionsRouter;