'use client'

import Link from 'next/link'

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                BrainSAIT
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600 font-medium">Documents</span>
            </div>
            <Link 
              href="/"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Document Management
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Coming Soon in Phase 3
          </p>
          <div className="text-left max-w-md mx-auto mb-8">
            <h3 className="font-semibold mb-3">Planned Features:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span>📄</span>
                <span>Upload PDF, DOCX, and other medical documents</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🔍</span>
                <span>AI-powered document search and analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span>💬</span>
                <span>Chat with your documents using RAG</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📊</span>
                <span>Extract insights and summaries</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🔒</span>
                <span>PDPL/HIPAA compliant storage</span>
              </li>
            </ul>
          </div>
          <Link 
            href="/chat"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Try Chat Instead
          </Link>
        </div>
      </div>
    </div>
  )
}
