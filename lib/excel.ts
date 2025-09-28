import * as XLSX from 'xlsx'
import { FinancialRatios } from './ratios'

interface FinancialData {
  incomeStatement: Record<string, number>
  balanceSheet: Record<string, number>
  cashFlow: Record<string, number>
  notes: string[]
}

export function generateExcelFile(
  data: FinancialData,
  ratios: FinancialRatios,
  companyName: string
): Buffer {
  const workbook = XLSX.utils.book_new()

  // Summary Sheet
  const summaryData = [
    ['Financial Analysis Summary', ''],
    ['Company Name', companyName],
    ['Analysis Date', new Date().toLocaleDateString()],
    [''],
    ['LIQUIDITY RATIOS', ''],
    ['Current Ratio', ratios.liquidity.currentRatio],
    ['Quick Ratio', ratios.liquidity.quickRatio],
    ['Cash Ratio', ratios.liquidity.cashRatio],
    [''],
    ['LEVERAGE RATIOS', ''],
    ['Debt-to-Equity', ratios.leverage.debtToEquity],
    ['Debt-to-Assets', ratios.leverage.debtToAssets],
    ['Interest Coverage', ratios.leverage.interestCoverage],
    [''],
    ['PROFITABILITY RATIOS', ''],
    ['Return on Equity (ROE)', `${ratios.profitability.roe}%`],
    ['Return on Assets (ROA)', `${ratios.profitability.roa}%`],
    ['Net Profit Margin', `${ratios.profitability.netProfitMargin}%`],
    ['Gross Profit Margin', `${ratios.profitability.grossProfitMargin}%`],
    [''],
    ['EFFICIENCY RATIOS', ''],
    ['Asset Turnover', ratios.efficiency.assetTurnover],
    ['Inventory Turnover', ratios.efficiency.inventoryTurnover],
    ['Receivables Turnover', ratios.efficiency.receivablesTurnover],
    [''],
    ['COVERAGE RATIOS', ''],
    ['Times Interest Earned', ratios.coverage.timesInterestEarned],
    ['Debt Service Coverage', ratios.coverage.debtServiceCoverage]
  ]

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

  // Income Statement Sheet
  const incomeData = [
    ['Income Statement', ''],
    ['Item', 'Amount'],
    ...Object.entries(data.incomeStatement).map(([key, value]) => [key, value])
  ]
  const incomeSheet = XLSX.utils.aoa_to_sheet(incomeData)
  XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Income Statement')

  // Balance Sheet Sheet
  const balanceData = [
    ['Balance Sheet', ''],
    ['Item', 'Amount'],
    ...Object.entries(data.balanceSheet).map(([key, value]) => [key, value])
  ]
  const balanceSheet = XLSX.utils.aoa_to_sheet(balanceData)
  XLSX.utils.book_append_sheet(workbook, balanceSheet, 'Balance Sheet')

  // Cash Flow Sheet
  const cashFlowData = [
    ['Cash Flow Statement', ''],
    ['Item', 'Amount'],
    ...Object.entries(data.cashFlow).map(([key, value]) => [key, value])
  ]
  const cashFlowSheet = XLSX.utils.aoa_to_sheet(cashFlowData)
  XLSX.utils.book_append_sheet(workbook, cashFlowSheet, 'Cash Flow')

  // Notes Sheet
  const notesData = [
    ['Notes and Disclosures', ''],
    ['Note', 'Description'],
    ...data.notes.map((note, index) => [`Note ${index + 1}`, note])
  ]
  const notesSheet = XLSX.utils.aoa_to_sheet(notesData)
  XLSX.utils.book_append_sheet(workbook, notesSheet, 'Notes')

  // Generate buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
  return buffer
}
