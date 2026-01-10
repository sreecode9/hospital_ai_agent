import { useState, useRef, useEffect } from 'react'
import './ChatInterface.css'

// API URL configuration for different environments
const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://hospital-ai-agent-backend.vercel.app/chat'
    : 'http://localhost:8000/chat')

// Force refresh marker: v2.2 - Built at 2025-01-10

// Simple response function for demo
const getSimpleResponse = (message) => {
  const responses = [
    "Thank you for sharing your symptoms. This appears to be a common concern. Please consult a healthcare professional for proper evaluation.",
    "I understand you're experiencing discomfort. While I can provide general information, please seek medical advice from a qualified professional.",
    "Your symptoms warrant attention. Consider scheduling an appointment with your healthcare provider for a proper assessment.",
    "Health concerns should always be evaluated by medical professionals. Please contact your doctor or healthcare provider.",
    "This sounds important to address. While I can offer general guidance, professional medical evaluation is essential."
  ]

  // Simple keyword-based risk assessment
  const highRiskKeywords = ['chest pain', 'difficulty breathing', 'severe headache', 'unconscious', 'bleeding heavily', 'heart attack', 'stroke']
  const moderateRiskKeywords = ['fever', 'pain', 'nausea', 'dizziness', 'weakness', 'cough', 'rash']

  const messageLower = message.toLowerCase()
  let riskLevel = 'low'

  if (highRiskKeywords.some(keyword => messageLower.includes(keyword))) {
    riskLevel = 'high'
  } else if (moderateRiskKeywords.some(keyword => messageLower.includes(keyword))) {
    riskLevel = 'moderate'
  }

  return {
    response: responses[Math.floor(Math.random() * responses.length)],
    risk_level: riskLevel,
    disclaimer: true
  }
}

function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m here to help you understand your symptoms better. Please describe what symptoms you\'re experiencing, and I\'ll provide general health awareness guidance.',
      riskLevel: null
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const sessionId = useRef(`session_${Date.now()}`)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    try {
      // Use simple response for now (backend is working but simplified)
      const data = getSimpleResponse(userMessage)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Add assistant response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        riskLevel: data.risk_level
      }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        riskLevel: null
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h1>Symptom Checking Assistant</h1>
        <p className="subtitle">AI-powered health awareness guidance</p>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">
              {msg.content}
              {msg.riskLevel && (
                <div className={`risk-badge risk-${msg.riskLevel}`}>
                  Risk Level: {msg.riskLevel}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-content">
              <span className="typing-indicator">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe your symptoms..."
          disabled={loading}
        />
        <button
          className="send-button"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Sending
            </>
          ) : (
            <>
              Send
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default ChatInterface

