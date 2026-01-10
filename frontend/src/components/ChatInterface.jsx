import { useState, useRef, useEffect } from 'react'
import './ChatInterface.css'

// API URL configuration for different environments
const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://hospital-ai-agent-backend.vercel.app/chat'
    : 'http://localhost:8000/chat')

// Modern UI Version: v3.0 - Ultra Modern Healthcare Interface

// Advanced AI responses with better risk assessment
const getAdvancedResponse = (message) => {
  const responses = {
    high: [
      "🚨 **HIGH PRIORITY ALERT** 🚨\n\nThis symptom pattern requires IMMEDIATE medical attention. Please contact emergency services (911) or go to the nearest emergency room right away. Do not delay seeking professional medical care.",
      "⚠️ **URGENT MEDICAL ATTENTION REQUIRED** ⚠️\n\nYour symptoms suggest a potentially serious condition. Call emergency services immediately or have someone take you to the nearest hospital emergency department.",
      "🆘 **EMERGENCY SITUATION** 🆘\n\nBased on your description, this requires immediate professional medical intervention. Please seek emergency care without delay."
    ],
    moderate: [
      "⚡ **MODERATE CONCERN** ⚡\n\nThese symptoms should be evaluated by a healthcare provider within 24-48 hours. Consider contacting your primary care physician or visiting an urgent care center.",
      "📋 **MEDICAL EVALUATION RECOMMENDED** 📋\n\nYour symptoms warrant professional assessment. Please schedule an appointment with your healthcare provider or visit a clinic for proper evaluation.",
      "🔍 **FURTHER ASSESSMENT NEEDED** 🔍\n\nThese symptoms suggest you should consult with a medical professional. Consider seeing your doctor or visiting an urgent care facility."
    ],
    low: [
      "💚 **GENERAL HEALTH INFORMATION** 💚\n\nWhile these symptoms may be concerning, they appear to be of lower urgency. Monitor your symptoms and consult a healthcare provider if they persist or worsen.",
      "ℹ️ **HEALTH AWARENESS** ℹ️\n\nThis seems to be a common health concern. Stay hydrated, rest well, and monitor your symptoms. Seek medical advice if symptoms persist or change.",
      "📖 **GENERAL GUIDANCE** 📖\n\nThese symptoms are often manageable with self-care. However, if they persist or worsen, please consult with a healthcare professional for personalized advice."
    ]
  }

  // Enhanced keyword-based risk assessment
  const highRiskKeywords = [
    'chest pain', 'difficulty breathing', 'severe headache', 'unconscious', 'bleeding heavily',
    'heart attack', 'stroke', 'seizure', 'severe allergic reaction', 'poisoning',
    'broken bone', 'dislocation', 'severe burn', 'electrocution', 'drowning'
  ]
  const moderateRiskKeywords = [
    'fever over 103', 'severe pain', 'persistent vomiting', 'blood in stool',
    'blood in urine', 'confusion', 'severe dizziness', 'rapid heartbeat',
    'difficulty swallowing', 'severe rash', 'eye injury', 'ear pain with fever'
  ]

  const messageLower = message.toLowerCase()
  let riskLevel = 'low'

  if (highRiskKeywords.some(keyword => messageLower.includes(keyword))) {
    riskLevel = 'high'
  } else if (moderateRiskKeywords.some(keyword => messageLower.includes(keyword))) {
    riskLevel = 'moderate'
  }

  const responseList = responses[riskLevel]
  const response = responseList[Math.floor(Math.random() * responseList.length)]

  return {
    response: response,
    risk_level: riskLevel,
    disclaimer: true,
    timestamp: new Date().toLocaleTimeString()
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
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toLocaleTimeString()
    }])

    try {
      // Try to call the backend first
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId.current
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response || 'Thank you for sharing your symptoms.',
          riskLevel: data.risk_level || 'low',
          timestamp: new Date().toLocaleTimeString()
        }])
      } else {
        // Fallback to local advanced response
        const data = getAdvancedResponse(userMessage)
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response,
          riskLevel: data.risk_level,
          timestamp: data.timestamp
        }])
      }
    } catch (error) {
      console.error('Error:', error)
      // Fallback to local response
      const data = getAdvancedResponse(userMessage)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        riskLevel: data.risk_level,
        timestamp: data.timestamp
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
              {msg.timestamp && (
                <div className="message-timestamp">
                  {msg.timestamp}
                </div>
              )}
              {msg.riskLevel && (
                <div className={`risk-badge risk-${msg.riskLevel}`}>
                  {msg.riskLevel === 'high' && '🚨'}
                  {msg.riskLevel === 'moderate' && '⚡'}
                  {msg.riskLevel === 'low' && '💚'}
                  {msg.riskLevel.toUpperCase()} PRIORITY
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

