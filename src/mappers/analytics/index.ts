import { MONTH } from "@src/constants/constants"

export const mapTransactionPerMonth = (data: any) => {
  return MONTH.map((month, idx) => {
    return {
      month: month,
      totalIncome: Number(data.find((item: any) => item.month == idx+1)?.total_income ?? '0'),
    };
  })
}