'use client'

import { useState, useEffect } from 'react'

interface FinancialData {
  incomeStatement: Record<string, number>
  balanceSheet: Record<string, number>
  cashFlow: Record<string, number>
  notes: string[]
}

interface FinancialRatios {
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

interface FinancialAnalyzerProps {
  data: FinancialData
  ratios: FinancialRatios
  companyName: string
}

export function FinancialAnalyzer({ data, ratios, companyName }: FinancialAnalyzerProps) {
  const [activeTab, setActiveTab] = useState('summary')

  const tabs = [
    { id: 'summary', name: 'Summary' },
    { id: 'income', name: 'Income Statement' },
    { id: 'balance', name: 'Balance Sheet' },
    { id: 'cashflow', name: 'Cash Flow' },
    { id: 'notes', name: 'Notes' }
  ]

  const formatNumber = (value: number): string => {
    if (value === 0) return '0'
    if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(2)}B`
    if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(2)}M`
    if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(2)}K`
    return value.toFixed(2)
  }

  const formatRatio = (value: number): string => {
    if (isNaN(value) || !isFinite(value)) return 'N/A'
    return value.toFixed(2)
  }

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Liquidity Ratios */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-900 mb-3">Liquidity Ratios</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Current Ratio:</span>
              <span className="font-medium">{formatRatio(ratios.liquidity.currentRatio)}</span>
            </div>
            <div className="flex justify-between">
              <span>Quick Ratio:</span>
              <span className="font-medium">{formatRatio(ratios.liquidity.quickRatio)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cash Ratio:</span>
              <span className="font-medium">{formatRatio(ratios.liquidity.cashRatio)}</span>
            </div>
          </div>
        </div>

        {/* Leverage Ratios */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-900 mb-3">Leverage Ratios</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Debt-to-Equity:</span>
              <span className="font-medium">{formatRatio(ratios.leverage.debtToEquity)}</span>
            </div>
            <div className="flex justify-between">
              <span>Debt-to-Assets:</span>
              <span className="font-medium">{formatRatio(ratios.leverage.debtToAssets)}</span>
            </div>
            <div className="flex justify-between">
              <span>Interest Coverage:</span>
              <span className="font-medium">{formatRatio(ratios.leverage.interestCoverage)}</span>
            </div>
          </div>
        </div>

        {/* Profitability Ratios */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-900 mb-3">Profitability Ratios</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>ROE:</span>
              <span className="font-medium">{formatRatio(ratios.profitability.roe)}%</span>
            </div>
            <div className="flex justify-between">
              <span>ROA:</span>
              <span className="font-medium">{formatRatio(ratios.profitability.roa)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Net Profit Margin:</span>
              <span className="font-medium">{formatRatio(ratios.profitability.netProfitMargin)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Gross Profit Margin:</span>
              <span className="font-medium">{formatRatio(ratios.profitability.grossProfitMargin)}%</span>
            </div>
          </div>
        </div>

        {/* Efficiency Ratios */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-900 mb-3">Efficiency Ratios</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Asset Turnover:</span>
              <span className="font-medium">{formatRatio(ratios.efficiency.assetTurnover)}</span>
            </div>
            <div className="flex justify-between">
              <span>Inventory Turnover:</span>
              <span className="font-medium">{formatRatio(ratios.efficiency.inventoryTurnover)}</span>
            </div>
            <div className="flex justify-between">
              <span>Receivables Turnover:</span>
              <span className="font-medium">{formatRatio(ratios.efficiency.receivablesTurnover)}</span>
            </div>
          </div>
        </div>

        {/* Coverage Ratios */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-900 mb-3">Coverage Ratios</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Times Interest Earned:</span>
              <span className="font-medium">{formatRatio(ratios.coverage.timesInterestEarned)}</span>
            </div>
            <div className="flex justify-between">
              <span>Debt Service Coverage:</span>
              <span className="font-medium">{formatRatio(ratios.coverage.debtServiceCoverage)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderFinancialStatement = (data: Record<string, number>, title: string) => (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="px-6 py-4 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">{key}</span>
            <span className="text-sm text-gray-600 font-mono">{formatNumber(value)}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const renderNotes = () => (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
      </div>
      <div className="px-6 py-4">
        {data.notes.length > 0 ? (
          <ul className="space-y-2">
            {data.notes.map((note, index) => (
              <li key={index} className="text-sm text-gray-700">
                • {note}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No notes extracted</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'summary' && renderSummary()}
        {activeTab === 'income' && renderFinancialStatement(data.incomeStatement, 'Income Statement')}
        {activeTab === 'balance' && renderFinancialStatement(data.balanceSheet, 'Balance Sheet')}
        {activeTab === 'cashflow' && renderFinancialStatement(data.cashFlow, 'Cash Flow Statement')}
        {activeTab === 'notes' && renderNotes()}
      </div>
    </div>
  )
}
