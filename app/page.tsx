'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FinancialAnalyzer } from '@/components/FinancialAnalyzer'

export default function Home() {
  const [companyName, setCompanyName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.size <= 10 * 1024 * 1024) { // 10MB limit
      setFile(file)
      setError('')
    } else {
      setError('File size must be less than 10MB')
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  const handleAnalyze = async () => {
    if (!companyName.trim() || !file) {
      setError('Please enter company name and upload a PDF file')
      return
    }

    setIsProcessing(true)
    setError('')
    setProgress('Uploading...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('companyName', companyName.trim())

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Analysis failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      setDownloadUrl(url)
      setProgress('Analysis complete!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setProgress('')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a')
      link.href = downloadUrl
      const fileName = `${new Date().toISOString().split('T')[0].replace(/-/g, '_')}_${companyName.trim()}.xlsx`
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Financial Statement Analyzer
          </h1>
          <p className="text-gray-600 mb-8">
            Upload a company's financial statement PDF to extract key financial data and calculate credit underwriting ratios.
          </p>

          <div className="space-y-6">
            {/* Company Name Input */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name (max 100 characters)"
                maxLength={100}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isProcessing}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Financial Statement PDF *
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input {...getInputProps()} disabled={isProcessing} />
                <div className="space-y-2">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {file ? (
                    <div>
                      <p className="text-sm text-gray-600">Selected: {file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600">
                        {isDragActive
                          ? 'Drop the PDF file here'
                          : 'Drag & drop a PDF file here, or click to select'}
                      </p>
                      <p className="text-xs text-gray-500">Maximum file size: 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Indicator */}
            {isProcessing && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">{progress}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAnalyze}
                disabled={isProcessing || !companyName.trim() || !file}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Analyzing...' : 'Analyze Financial Statement'}
              </button>

              {downloadUrl && (
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  Download Excel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
