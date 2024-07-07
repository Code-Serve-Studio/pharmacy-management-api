import express from 'express';
import { getTransactions, postTransaction } from './transactions.controller';

const transactionsRouter = express.Router();

transactionsRouter.post('/api/transactions', postTransaction);
transactionsRouter.get('/api/transactions', getTransactions);

export default transactionsRouter;