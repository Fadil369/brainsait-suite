'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [geminiStatus, setGeminiStatus] = useState<boolean>(false)

  useEffect(() => {
    checkApiHealth()
  }, [])

  const checkApiHealth = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/health')
      const data = await response.json()
      setApiStatus('online')
      setGeminiStatus(data.services?.gemini || false)
    } catch (error) {
      setApiStatus('offline')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">BrainSAIT Suite</h1>
            <div className="flex gap-4">
              <Link href="/chat" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Chat
              </Link>
              <Link href="/documents" className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50">
                Documents
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Healthcare AI Platform
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Powered by Google Gemini • NPHIES Compliant • Saudi Arabia & Sudan
          </p>
          
          <div className="flex justify-center gap-4 mb-12">
            <div className="px-6 py-3 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">API Status</div>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-3 h-3 rounded-full ${
                  apiStatus === 'online' ? 'bg-green-500' : 
                  apiStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <span className="font-semibold">{apiStatus}</span>
              </div>
            </div>
            <div className="px-6 py-3 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Gemini AI</div>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-3 h-3 rounded-full ${geminiStatus ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-semibold">{geminiStatus ? 'Ready' : 'Not Ready'}</span>
              </div>
            </div>
          </div>

          <Link 
            href="/chat"
            className="inline-block px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Start Chatting with AI
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Chat</h3>
            <p className="text-gray-600">
              Chat with Gemini AI for healthcare insights, NPHIES compliance, and medical information.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Document RAG</h3>
            <p className="text-gray-600">
              Upload medical documents and query them with AI-powered retrieval augmented generation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">PDPL/HIPAA Compliant</h3>
            <p className="text-gray-600">
              Built with healthcare compliance in mind. Secure, audited, and regulation-ready.
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h3 className="text-2xl font-bold mb-4">Features</h3>
          <ul className="grid md:grid-cols-2 gap-4">
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>✅ Gemini 2.0 Flash Exp Integration</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>✅ Bilingual Support (Arabic & English)</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>✅ Real-time AI Chat Interface</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>✅ NPHIES Compliance Tools</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>🚧 Document Upload & RAG (Coming Soon)</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>🚧 Voice Assistant (Coming Soon)</span>
            </li>
          </ul>
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            Version 1.0.0 • Built with Next.js 15 & Google Gemini • November 2025
          </p>
        </div>
      </main>
    </div>
  )
}
