# Financial Statement Analyzer

A web application that uses AI to analyze company financial statements, extract key financial data, and calculate credit underwriting ratios.

## Features

- **PDF Upload**: Upload financial statement PDFs (up to 10MB)
- **AI Analysis**: Uses Google Gemini AI to extract financial data
- **Comprehensive Ratios**: Calculates all standard credit underwriting ratios
- **Excel Export**: Downloads analysis results as Excel files
- **No Login Required**: Simple, straightforward interface

## Financial Ratios Calculated

### Liquidity Ratios
- Current Ratio
- Quick Ratio  
- Cash Ratio

### Leverage Ratios
- Debt-to-Equity
- Debt-to-Assets
- Interest Coverage

### Profitability Ratios
- Return on Equity (ROE)
- Return on Assets (ROA)
- Net Profit Margin
- Gross Profit Margin

### Efficiency Ratios
- Asset Turnover
- Inventory Turnover
- Receivables Turnover

### Coverage Ratios
- Times Interest Earned
- Debt Service Coverage

## Setup Instructions

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

1. Copy `env.example` to `.env.local`:
```bash
cp env.example .env.local
```

2. Edit `.env.local` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy

```bash
vercel
```

### 4. Set Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add `GEMINI_API_KEY` with your actual API key
5. Redeploy the project

## Usage

1. Enter the company name
2. Upload a financial statement PDF
3. Click "Analyze Financial Statement"
4. Wait for processing to complete
5. Download the Excel file with results

## File Naming Convention

Downloaded Excel files follow this format:
`YYYY_MM_DD_CompanyName.xlsx`

## Excel Output Structure

The generated Excel file contains 5 tabs:

1. **Summary**: Key financial ratios and metrics
2. **Income Statement**: Extracted income statement data
3. **Balance Sheet**: Extracted balance sheet data
4. **Cash Flow**: Extracted cash flow statement data
5. **Notes**: Important notes and disclosures

## Error Handling

The application provides specific error messages for common issues:

- File size exceeds 10MB limit
- Non-PDF file uploads
- PDF processing failures (corrupted, password-protected, or unreadable files)
- Missing API key configuration
- Financial data extraction failures

## Technical Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI Processing**: Google Gemini API
- **File Processing**: PDF analysis with Gemini
- **Excel Generation**: XLSX library
- **Deployment**: Vercel

## Limitations

- Maximum file size: 10MB
- PDF format only
- Requires internet connection for AI processing
- Processing time depends on PDF complexity and size

## Support

For issues or questions, please check the error messages provided by the application or review the setup instructions above.
