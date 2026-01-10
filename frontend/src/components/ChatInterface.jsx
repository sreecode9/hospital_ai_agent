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
        content: `**To provide you with the most accurate guidance, I need a bit more information:**

⏰ **How long have you been experiencing these symptoms?**
*(Examples: "started this morning", "for 2 days", "about a week", "off and on for months")*

📊 **Additional helpful details:**
• How severe are the symptoms on a scale of 1-10?
• Have they been getting better, worse, or staying the same?
• Are there any other symptoms you've noticed?
• Have you tried any home remedies or medications?

This information helps me give you more personalized and accurate health guidance!`,
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
    const symptoms = this.conversationState.symptoms
    const duration = this.conversationState.duration

    let response = ""

    // Personalized greeting based on symptoms
    if (symptoms.length > 0) {
      const mainSymptom = symptoms[0]
      response += `I hear you're dealing with ${mainSymptom}${symptoms.length > 1 ? ` and ${symptoms.slice(1).join(', ')}` : ''}${duration ? ` for ${duration}` : ''}. `
    } else {
      response += "Thanks for sharing your symptoms with me. "
    }

    // Risk-based comprehensive guidance
    switch (riskLevel) {
      case 'HIGH':
        response += `**🚨 This requires IMMEDIATE medical attention!**

I'm concerned about these symptoms - they could indicate a serious health issue that needs urgent care.

**URGENT ACTION NEEDED:**
• **Call 911 immediately** or go to the nearest emergency room
• **Don't drive yourself** - have someone take you or call an ambulance
• **Time is critical** - seek help right now

**While waiting for help:**
• Stay as calm as possible
• If conscious, try to remain still and comfortable
• Keep your phone handy for communication
• If you have emergency contacts, let someone know your situation

**What to tell medical staff:**
• "I've been experiencing [your symptoms] for [duration]"
• Any medications you're taking
• Any known medical conditions
• When symptoms started and how they've progressed

**Remember:** When it comes to potential emergencies, it's always better to seek help immediately. Your healthcare team is there to help you through this.`
        break

      case 'MODERATE':
        response += `**📋 These symptoms need medical evaluation soon.**

While not an immediate emergency, these symptoms should be checked by a healthcare professional within the next 1-2 days to ensure proper care.

**RECOMMENDED NEXT STEPS:**
• **Call your primary care doctor** today to schedule an appointment
• **Visit urgent care** if you can't get a same-day appointment
• **Consider telemedicine** if available in your area

**PREPARE FOR YOUR VISIT:**
• Write down all your symptoms and when they started
• Note any patterns (better/worse at certain times)
• List any medications, supplements, or recent changes
• Bring a list of questions you have

**SELF-CARE WHILE WAITING:**
• Rest in a comfortable, quiet environment
• Stay well-hydrated with water or clear fluids
• Eat light, nutritious meals if you can
• Avoid alcohol, caffeine, and heavy foods that might worsen symptoms
• Get adequate sleep and manage stress

**MONITOR CLOSELY:**
• Track if symptoms improve, stay the same, or worsen
• Note any new symptoms that develop
• Keep a record of your temperature if you have fever
• Pay attention to how symptoms affect your daily activities

**Don't delay:** If symptoms worsen or you become more concerned, seek care sooner rather than later.`
        break

      case 'LOW':
        response += `**💚 These symptoms appear manageable at home for now.**

Most symptoms like these resolve with time and self-care, but it's smart that you're paying attention to your health.

**HOME CARE APPROACH:**
• **Rest and Recovery:** Give your body time to heal naturally
• **Hydration:** Drink plenty of water throughout the day
• **Nutrition:** Eat balanced meals with fruits, vegetables, and lean proteins
• **Sleep:** Aim for 7-9 hours of quality sleep each night
• **Gentle Activity:** Light walking or stretching if it feels good

**OVER-THE-COUNTER SUPPORT:**
• **Pain relief:** Acetaminophen (Tylenol) or ibuprofen if appropriate
• **Cough relief:** Honey, throat lozenges, or humidifiers
• **Nasal congestion:** Saline nasal spray or steam inhalation
• **Always check:** Labels and consult pharmacist if unsure

**WHEN TO RECHECK:**
• If symptoms persist beyond 3-5 days without improvement
• If symptoms suddenly worsen or become more severe
• If you develop new symptoms or complications
• If you're feeling progressively worse despite home care
• If you have underlying health conditions or are pregnant

**HELPFUL HABITS:**
• Keep a symptom journal to track progress
• Avoid known triggers (smoke, allergens, etc.)
• Practice good hand hygiene to prevent spread
• Stay current with vaccinations and health screenings
• Maintain regular check-ups with your healthcare provider

**TRUST YOUR INSTINCTS:** If something doesn't feel right or you're worried, don't hesitate to contact a healthcare professional for personalized advice.`
        break
    }

    // Add helpful resources and final guidance
    response += `\n\n**💡 ADDITIONAL RESOURCES:**
• **Health Hotlines:** Call your local health department for guidance
• **Telehealth Options:** Many areas offer virtual consultations
• **Pharmacy Consultation:** Pharmacists can provide guidance on medications
• **Trusted Health Websites:** CDC, Mayo Clinic, WebMD for general information

**Remember:** I'm here to provide general health awareness information, but I'm not a substitute for professional medical care. Always consult qualified healthcare providers for your specific situation and needs.

*Stay informed, stay healthy, and take care of yourself!* 🌟`

    return response
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
          content: `🌟 **Welcome to your Health Awareness Assistant!**

Hi there! I'm here to help you navigate health concerns with confidence and care. As your AI health companion, I can assist you with:

**🩺 SYMPTOM ANALYSIS**
• Understand what your symptoms might indicate
• Assess potential urgency levels (low, moderate, or high priority)
• Provide clear guidance on next steps

**📋 PERSONALIZED GUIDANCE**
• Help you decide when to seek medical attention
• Offer evidence-based self-care recommendations
• Suggest questions to ask your healthcare provider

**💡 HEALTH EDUCATION**
• Share general health information and prevention tips
• Help you understand common health concerns
• Support informed decision-making about your care

**🤝 COMPASSIONATE SUPPORT**
• Listen without judgment to your health concerns
• Provide reassurance and clear information
• Help reduce health anxiety through knowledge

**⚠️ IMPORTANT REMINDERS:**
• I provide **general health information only** - not medical diagnosis
• I'm designed to **complement, not replace** professional medical care
• Always consult healthcare providers for your specific situation
• When in doubt, seek professional medical attention

**How can I help you today?** Feel free to describe any symptoms or health concerns you're experiencing, and I'll guide you through understanding them and determining appropriate next steps.`,
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

