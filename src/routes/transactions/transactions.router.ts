import express from 'express';
import { getExportTransactions, getTransactions, postTransaction } from './transactions.controller';

const transactionsRouter = express.Router();

transactionsRouter.post('/api/transactions', postTransaction);
transactionsRouter.get('/api/transactions', getTransactions);
transactionsRouter.get('/api/export-transactions', getExportTransactions);

export default transactionsRouter;