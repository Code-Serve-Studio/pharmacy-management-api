import transactionsModel from "@models/transactions.model";
import { TransactionPayload } from "@src/types/request";
import { NextFunction, Request, Response } from "express";

const postTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = req.body as TransactionPayload;

    const transactionId = await transactionsModel.addTransaction(transaction);

    const response = {
      status: 'success',
      data: {
        transactionId
      }
    }

    res.status(201).json(response)
  } catch (error) {
    next(error);
  }
}

const getTransactions = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await transactionsModel.selectTransactions();

    const response = {
      status: 'success',
      data: [...transactions]
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export {
  postTransaction,
  getTransactions,
}