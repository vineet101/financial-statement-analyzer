import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function analyzeFinancialStatement(pdfBuffer: Buffer): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    // Convert PDF buffer to base64
    const pdfBase64 = pdfBuffer.toString('base64')
    
    const prompt = `
    Analyze this financial statement PDF and extract all key financial data. 
    
    Please provide a comprehensive analysis including:
    
    1. Income Statement data (Revenue, Cost of Goods Sold, Gross Profit, Operating Expenses, Operating Income, Interest Expense, Net Income, etc.)
    2. Balance Sheet data (Cash, Accounts Receivable, Inventory, Total Current Assets, Property Plant & Equipment, Total Assets, Accounts Payable, Short-term Debt, Long-term Debt, Total Liabilities, Shareholders' Equity, etc.)
    3. Cash Flow Statement data (Operating Cash Flow, Investing Cash Flow, Financing Cash Flow, Net Cash Flow, etc.)
    4. Any important notes or disclosures
    
    Return the data in the following JSON format:
    {
      "incomeStatement": {
        "Revenue": number,
        "CostOfGoodsSold": number,
        "GrossProfit": number,
        "OperatingExpenses": number,
        "OperatingIncome": number,
        "InterestExpense": number,
        "NetIncome": number,
        "EBITDA": number
      },
      "balanceSheet": {
        "Cash": number,
        "AccountsReceivable": number,
        "Inventory": number,
        "TotalCurrentAssets": number,
        "PropertyPlantEquipment": number,
        "TotalAssets": number,
        "AccountsPayable": number,
        "ShortTermDebt": number,
        "LongTermDebt": number,
        "TotalLiabilities": number,
        "ShareholdersEquity": number,
        "TotalEquity": number
      },
      "cashFlow": {
        "OperatingCashFlow": number,
        "InvestingCashFlow": number,
        "FinancingCashFlow": number,
        "NetCashFlow": number,
        "CapitalExpenditures": number
      },
      "notes": ["note1", "note2", "note3"]
    }
    
    Important:
    - Extract actual numerical values, not percentages
    - If a value is not available, use 0
    - Ensure all numbers are in the same currency unit
    - Include any significant notes or disclosures in the notes array
    - Be thorough in extracting all available financial data
    `
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: pdfBase64
        }
      }
    ])
    
    const response = await result.response
    const text = response.text()
    
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from Gemini response')
    }
    
    const extractedData = JSON.parse(jsonMatch[0])
    return extractedData
    
  } catch (error) {
    console.error('Error analyzing financial statement:', error)
    throw new Error(`Failed to analyze PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
