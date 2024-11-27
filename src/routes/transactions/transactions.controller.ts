import transactionsModel from "@models/transactions.model";
import { TransactionPayload } from "@src/types/request";
import { NextFunction, Request, Response } from "express";
import xlsx from 'xlsx';

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

const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const transactions = await transactionsModel.selectTransactions({page, limit});

    const response = {
      status: 'success',
      ...transactions,
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

const getExportTransactions = async (req:Request, res:Response, next: NextFunction) => {
  try {
    const transactions = await transactionsModel.selectAllTransactions();

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(transactions);

    xlsx.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const fileName = 'transactions.xlsx';
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(excelBuffer);
  } catch (error) {
    next(error);
  }
}

export {
  postTransaction,
  getTransactions,
  getExportTransactions,
}