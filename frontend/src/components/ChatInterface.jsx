import { useState, useRef, useEffect } from 'react'
import './ChatInterface.css'

// API URL configuration for different environments
const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://hospital-ai-agent-backend.vercel.app/chat'
    : 'http://localhost:8000/chat')

// Ultra Modern Healthcare AI Assistant v3.0 - Complete Implementation

class SymptomAnalyzer {
  constructor() {
    this.conversationState = {
      symptoms: [],
      duration: null,
      severity: null,
      riskLevel: null,
      awaitingDuration: false
    }
  }

  // Risk classification logic
  assessRiskLevel(message) {
    const messageLower = message.toLowerCase()

    // HIGH RISK symptoms
    const highRiskPatterns = [
      /chest pain/i, /difficulty breathing/i, /severe headache/i, /unconscious/i,
      /bleeding heavily/i, /heart attack/i, /stroke/i, /seizure/i,
      /severe allergic reaction/i, /poisoning/i, /broken bone/i, /dislocation/i,
      /severe burn/i, /electrocution/i, /drowning/i, /loss of consciousness/i,
      /sudden weakness/i, /paralysis/i, /high fever with confusion/i,
      /suicidal thoughts/i, /severe mental distress/i
    ]

    // MODERATE RISK symptoms
    const moderateRiskPatterns = [
      /persistent pain/i, /fever.*days/i, /worsening symptoms/i, /repeated vomiting/i,
      /blood in stool/i, /blood in urine/i, /confusion/i, /severe dizziness/i,
      /rapid heartbeat/i, /difficulty swallowing/i, /severe rash/i, /eye injury/i,
      /ear pain.*fever/i, /fever over 103/i, /severe pain/i
    ]

    if (highRiskPatterns.some(pattern => pattern.test(messageLower))) {
      return 'HIGH'
    } else if (moderateRiskPatterns.some(pattern => pattern.test(messageLower))) {
      return 'MODERATE'
    } else {
      return 'LOW'
    }
  }

  // Extract symptoms from message
  extractSymptoms(message) {
    const symptomPatterns = [
      // Common symptoms
      /\b(headache|pain|fever|cough|nausea|vomiting|dizziness|fatigue|weakness)\b/gi,
      /\b(chest|back|stomach|joint|muscle|throat|ear|eye)\b.*?\b(pain|ache)\b/gi,
      /\b(rash|swelling|bruising|bleeding|discharge)\b/gi,
      /\b(difficulty breathing|shortness of breath|wheezing|coughing)\b/gi,
      /\b(nausea|vomiting|diarrhea|constipation|abdominal pain)\b/gi
    ]

    const symptoms = []
    symptomPatterns.forEach(pattern => {
      const matches = message.match(pattern)
      if (matches) {
        symptoms.push(...matches)
      }
    })

    return [...new Set(symptoms)] // Remove duplicates
  }

  // Check if duration is mentioned
  hasDuration(message) {
    const durationPatterns = [
      /\b(\d+)\s*(day|days|week|weeks|month|months|hour|hours)\b/i,
      /\b(for|since)\s+(\d+)\s*(day|days|week|weeks|month|months|hour|hours)\b/i,
      /\b(today|yesterday|this morning|last night)\b/i
    ]

    return durationPatterns.some(pattern => pattern.test(message))
  }

  // Generate response based on current state
  generateResponse(message) {
    const symptoms = this.extractSymptoms(message)
    const riskLevel = this.assessRiskLevel(message)
    const hasDuration = this.hasDuration(message)

    // Update conversation state
    if (symptoms.length > 0) {
      this.conversationState.symptoms = [...new Set([...this.conversationState.symptoms, ...symptoms])]
    }

    // If we don't have duration and haven't asked for it yet, ask for it
    if (!hasDuration && !this.conversationState.duration && this.conversationState.symptoms.length > 0) {
      this.conversationState.awaitingDuration = true
      return {
        type: 'question',
        content: "How many days have you been experiencing these symptoms?",
        riskLevel: null
      }
    }

    // If this is a response to our duration question
    if (this.conversationState.awaitingDuration) {
      // Try to extract duration from this message
      const durationMatch = message.match(/(\d+)\s*(day|days|week|weeks|month|months)/i)
      if (durationMatch) {
        this.conversationState.duration = durationMatch[0]
        this.conversationState.awaitingDuration = false
      }
    }

    // Generate final assessment response
    const response = this.generateAssessmentResponse(riskLevel)
    this.conversationState.riskLevel = riskLevel

    return {
      type: 'assessment',
      content: response,
      riskLevel: riskLevel,
      symptoms: this.conversationState.symptoms,
      duration: this.conversationState.duration
    }
  }

  generateAssessmentResponse(riskLevel) {
    const symptomSummary = this.conversationState.symptoms.length > 0
      ? `Based on your description of ${this.conversationState.symptoms.join(', ')}`
      : "Based on your symptoms"

    let guidance = ""

    switch (riskLevel) {
      case 'HIGH':
        guidance = `\n\n**URGENT MEDICAL ATTENTION REQUIRED**\n\nThis symptom pattern requires IMMEDIATE medical attention. Please contact emergency services (911) or go to the nearest emergency room right away. Do not delay seeking professional medical care.`
        break

      case 'MODERATE':
        guidance = `\n\n**MEDICAL EVALUATION RECOMMENDED**\n\nThese symptoms should be evaluated by a healthcare provider within 24-48 hours. Consider contacting your primary care physician or visiting an urgent care center for proper assessment.`
        break

      case 'LOW':
        guidance = `\n\n**GENERAL HEALTH AWARENESS**\n\nWhile these symptoms may be concerning, they appear to be of lower urgency. Monitor your symptoms closely and consult a healthcare provider if they persist, worsen, or if you have any concerns.`
        break
    }

    const durationInfo = this.conversationState.duration
      ? ` (lasting ${this.conversationState.duration})`
      : ""

    return `${symptomSummary}${durationInfo}:\n\n**Risk level: ${riskLevel}**${guidance}\n\n*This information is for awareness only and does not replace professional medical advice.*`
  }
}

// Initialize the analyzer
const analyzer = new SymptomAnalyzer()

function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showHeader, setShowHeader] = useState(false)
  const [showInitialMessage, setShowInitialMessage] = useState(false)
  const messagesEndRef = useRef(null)
  const sessionId = useRef(`session_${Date.now()}`)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' })
  }

  // Initialize the interface with proper timing
  useEffect(() => {
    const initSequence = async () => {
      // Wait for header animation to complete (0.8s animation + buffer)
      await new Promise(resolve => setTimeout(resolve, 1200))

      // Show header
      setShowHeader(true)

      // Wait for header to be visible, then show message
      await new Promise(resolve => setTimeout(resolve, 400))

      // Show the complete initial message
      setMessages([
        {
          role: 'assistant',
          content: 'Hello! I\'m your AI-powered health awareness assistant. I can help you understand the possible seriousness of your symptoms and guide you on whether medical attention may be needed.\n\nPlease describe what symptoms you\'re experiencing, and I\'ll provide general health awareness guidance.',
          riskLevel: null,
          timestamp: new Date().toLocaleTimeString()
        }
      ])
      setShowInitialMessage(true)
    }

    initSequence()
  }, [])

  useEffect(() => {
    if (showInitialMessage) {
      // Scroll after initial message is shown
      setTimeout(() => {
        scrollToBottom()
      }, 200)
    }
  }, [messages, showInitialMessage])

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
      // First try to use the backend API
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
        throw new Error('Backend not available')
      }
    } catch (error) {
      console.error('Backend error, using local analysis:', error)

      // Use local symptom analyzer as fallback
      const analysis = analyzer.generateResponse(userMessage)

      // Quick response for better UX - no delay
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: analysis.content,
        riskLevel: analysis.riskLevel,
        timestamp: new Date().toLocaleTimeString(),
        type: analysis.type
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
      {showHeader ? (
        <div className="chat-header">
          <h1>Symptom Checking Assistant</h1>
          <p className="subtitle">AI-powered health awareness guidance</p>
        </div>
      ) : (
        <div className="chat-header-placeholder">
          <div className="loading-pulse"></div>
        </div>
      )}

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">
              {msg.content.split('\n').map((line, lineIdx) => (
                <span key={lineIdx}>
                  {line}
                  {lineIdx < msg.content.split('\n').length - 1 && <br />}
                </span>
              ))}
              {msg.timestamp && (
                <div className="message-timestamp">
                  {msg.timestamp}
                </div>
              )}
              {msg.riskLevel && msg.riskLevel !== 'null' && (
                <div className={`risk-badge risk-${msg.riskLevel.toLowerCase()}`}>
                  {msg.riskLevel === 'HIGH' && '🚨'}
                  {msg.riskLevel === 'MODERATE' && '⚡'}
                  {msg.riskLevel === 'LOW' && '💚'}
                  {msg.riskLevel} PRIORITY
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-content">
              <span className="typing-indicator">
                Analyzing<span className="dots">...</span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid rgba(148, 163, 184, 0.15)',
          borderRadius: '3rem',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          boxSizing: 'border-box',
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your symptoms..."
            disabled={loading}
            style={{
              backgroundColor: 'transparent',
              color: '#000000',
              border: 'none',
              borderRadius: '3rem',
              padding: '1.25rem 1.75rem',
              fontSize: '1.05rem',
              fontWeight: '450',
              fontFamily: 'inherit',
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none'
            }}
          />
        </div>
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

