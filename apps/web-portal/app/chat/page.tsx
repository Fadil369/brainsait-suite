'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState<'ar' | 'en'>('en')

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chat/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: input,
          workspace_id: 'ws_demo_public',
          language: language,
          cultural_context: 'saudi',
          use_rag: false,
          include_citations: false
        })
      })

      const data = await response.json()
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer || 'Sorry, I could not process your request.',
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Error: Could not connect to the API. Please make sure the backend is running.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

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
              <span className="text-gray-600 font-medium">AI Chat</span>
            </div>
            <div className="flex gap-3">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'ar' | 'en')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
              <Link 
                href="/"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Start a conversation
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Ask me anything about healthcare, NPHIES compliance, or medical information
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => setInput('What is NPHIES?')}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 text-sm"
                    >
                      What is NPHIES?
                    </button>
                    <button
                      onClick={() => setInput('Explain PDPL compliance')}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 text-sm"
                    >
                      Explain PDPL compliance
                    </button>
                    <button
                      onClick={() => setInput('Healthcare best practices in Saudi Arabia')}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 text-sm"
                    >
                      Healthcare best practices
                    </button>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-3">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t p-4 bg-gray-50">
              <div className="flex gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message here...'}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={2}
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
