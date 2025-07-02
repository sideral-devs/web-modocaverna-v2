import { parseMoney } from '@/lib/utils'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export function getRevenueExpenses(transactions: Transaction[]) {
  const revenue = getRevenueTransactions(transactions).reduce(
    (sum, { valor }) => sum + parseMoney(valor),
    0,
  )

  const expense = getExpenseTransactions(transactions).reduce(
    (sum, { valor }) => sum + parseMoney(valor),
    0,
  )

  return { revenue, expense }
}

// const futureTransactions = (transactions: Transaction[]) => {
//   return transactions.filter((item) =>
//     dayjs(item.data, 'DD/MM/YYYY').isAfter(dayjs()),
//   )
// }

export const totalToReceive = (transactions: Transaction[]) => {
  // const { revenue } = getRevenueExpenses(futureTransactions(transactions))
  const { revenue } = getRevenueExpenses(transactions.filter((t) => !t.checked))

  return revenue
}

export const totalToPay = (transactions: Transaction[]) => {
  // const { expense } = getRevenueExpenses(futureTransactions(transactions))
  const { expense } = getRevenueExpenses(transactions.filter((t) => !t.checked))

  return expense
}
// const pastTransactions = (transactions: Transaction[]) => {
//   return transactions.filter((item) =>
//     dayjs(item.data, 'DD/MM/YYYY').isBefore(dayjs()),
//   )
// }

export const totalReceived = (transactions: Transaction[]) => {
  // const { revenue } = getRevenueExpenses(pastTransactions(transactions))
  const { revenue } = getRevenueExpenses(transactions.filter((t) => t.checked))

  return revenue
}

export const totalPaid = (transactions: Transaction[]) => {
  // const { expense } = getRevenueExpenses(pastTransactions(transactions))
  const { expense } = getRevenueExpenses(transactions.filter((t) => t.checked))

  return expense
}

export function getMonthTransactions(
  transactions: Transaction[],
  month: number,
  year: number,
) {
  return transactions.filter(({ data }) => {
    const transactionDate = dayjs(data, 'DD/MM/YYYY')
    const transactionMonth = transactionDate.month()
    return transactionMonth === month && transactionDate.year() === year
  })
}

export function getRevenueTransactions(data: Transaction[]) {
  return data.filter(({ tipo }) =>
    ['entrada', 'receita_fixa', 'receita_variavel', 'receita_outros'].includes(
      tipo,
    ),
  )
}

export function getExpenseTransactions(data: Transaction[]) {
  return data.filter(({ tipo }) =>
    ['saida', 'custo_fixo', 'custo_variavel', 'custo_outros'].includes(tipo),
  )
}
