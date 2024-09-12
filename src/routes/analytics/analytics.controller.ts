import productsModel from "@models/products.model";
import transactionsModel from "@models/transactions.model";
import { mapTransactionPerMonth } from "@src/mappers/analytics";
import { NextFunction, Request, Response } from "express";

const getAnalyticsDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const income = await transactionsModel.selectTotalTransactionByType('in');
    const outcome = await transactionsModel.selectTotalTransactionByType('out');

    const totalProductTransactions = await transactionsModel.selectTotalProductTransaction();
    const criticalProduct = await productsModel.selectCriticalProduct();
    const incomePerMonth = await transactionsModel.selectTransactionByTypePerMonth('in');
    const outcomePerMonth = await transactionsModel.selectTransactionByTypePerMonth('out');

    const response = {
      status: 'success',
      data: {
        income: Number(income.total_sum ?? 0),
        outcome: Number(outcome.total_sum ?? 0),
        totalProductTransactions,
        criticalProduct: [...criticalProduct],
        incomePerMonth: mapTransactionPerMonth([...incomePerMonth]),
        outcomePerMonth: mapTransactionPerMonth([...outcomePerMonth]),
      }
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export {
  getAnalyticsDashboard
}