import { NextRequest, NextResponse } from 'next/server'
import { analyzeFinancialStatement } from '@/lib/gemini'
import { calculateFinancialRatios } from '@/lib/ratios'
import { generateExcelFile } from '@/lib/excel'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const companyName = formData.get('companyName') as string

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!companyName || companyName.trim().length === 0) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Analyze the PDF with Gemini
    const extractedData = await analyzeFinancialStatement(buffer)

    // Calculate financial ratios
    const ratios = calculateFinancialRatios(extractedData)

    // Generate Excel file
    const excelBuffer = generateExcelFile(extractedData, ratios, companyName.trim())

    // Return Excel file
    return new NextResponse(new Uint8Array(excelBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${new Date().toISOString().split('T')[0].replace(/-/g, '_')}_${companyName.trim()}.xlsx"`,
      },
    })

  } catch (error) {
    console.error('Analysis error:', error)
    
    let errorMessage = 'An error occurred during analysis'
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Gemini API key is not configured. Please check your environment variables.'
      } else if (error.message.includes('PDF')) {
        errorMessage = 'Failed to process PDF. The file may be corrupted, password-protected, or contain no readable text.'
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Failed to extract financial data from PDF. The document may not contain standard financial statements.'
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
