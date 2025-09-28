interface FinancialData {
  incomeStatement: Record<string, number>
  balanceSheet: Record<string, number>
  cashFlow: Record<string, number>
}

export interface FinancialRatios {
  liquidity: {
    currentRatio: number
    quickRatio: number
    cashRatio: number
  }
  leverage: {
    debtToEquity: number
    debtToAssets: number
    interestCoverage: number
  }
  profitability: {
    roe: number
    roa: number
    netProfitMargin: number
    grossProfitMargin: number
  }
  efficiency: {
    assetTurnover: number
    inventoryTurnover: number
    receivablesTurnover: number
  }
  coverage: {
    timesInterestEarned: number
    debtServiceCoverage: number
  }
}

export function calculateFinancialRatios(data: FinancialData): FinancialRatios {
  const { incomeStatement, balanceSheet, cashFlow } = data

  // Helper function to safely calculate ratios
  const safeDivide = (numerator: number, denominator: number): number => {
    if (denominator === 0 || !isFinite(numerator) || !isFinite(denominator)) {
      return 0
    }
    return numerator / denominator
  }

  // Liquidity Ratios
  const currentAssets = balanceSheet.TotalCurrentAssets || 0
  const currentLiabilities = (balanceSheet.AccountsPayable || 0) + (balanceSheet.ShortTermDebt || 0)
  const cash = balanceSheet.Cash || 0
  const accountsReceivable = balanceSheet.AccountsReceivable || 0
  const inventory = balanceSheet.Inventory || 0

  const currentRatio = safeDivide(currentAssets, currentLiabilities)
  const quickRatio = safeDivide(currentAssets - inventory, currentLiabilities)
  const cashRatio = safeDivide(cash, currentLiabilities)

  // Leverage Ratios
  const totalDebt = (balanceSheet.ShortTermDebt || 0) + (balanceSheet.LongTermDebt || 0)
  const totalEquity = balanceSheet.TotalEquity || balanceSheet.ShareholdersEquity || 0
  const totalAssets = balanceSheet.TotalAssets || 0
  const interestExpense = incomeStatement.InterestExpense || 0
  const operatingIncome = incomeStatement.OperatingIncome || 0

  const debtToEquity = safeDivide(totalDebt, totalEquity)
  const debtToAssets = safeDivide(totalDebt, totalAssets)
  const interestCoverage = safeDivide(operatingIncome, interestExpense)

  // Profitability Ratios
  const netIncome = incomeStatement.NetIncome || 0
  const revenue = incomeStatement.Revenue || 0
  const grossProfit = incomeStatement.GrossProfit || 0

  const roe = safeDivide(netIncome, totalEquity) * 100
  const roa = safeDivide(netIncome, totalAssets) * 100
  const netProfitMargin = safeDivide(netIncome, revenue) * 100
  const grossProfitMargin = safeDivide(grossProfit, revenue) * 100

  // Efficiency Ratios
  const assetTurnover = safeDivide(revenue, totalAssets)
  const inventoryTurnover = safeDivide(incomeStatement.CostOfGoodsSold || 0, inventory)
  const receivablesTurnover = safeDivide(revenue, accountsReceivable)

  // Coverage Ratios
  const timesInterestEarned = safeDivide(operatingIncome, interestExpense)
  const debtServiceCoverage = safeDivide(operatingIncome + interestExpense, interestExpense + (totalDebt * 0.1)) // Assuming 10% average interest rate

  return {
    liquidity: {
      currentRatio,
      quickRatio,
      cashRatio
    },
    leverage: {
      debtToEquity,
      debtToAssets,
      interestCoverage
    },
    profitability: {
      roe,
      roa,
      netProfitMargin,
      grossProfitMargin
    },
    efficiency: {
      assetTurnover,
      inventoryTurnover,
      receivablesTurnover
    },
    coverage: {
      timesInterestEarned,
      debtServiceCoverage
    }
  }
}
