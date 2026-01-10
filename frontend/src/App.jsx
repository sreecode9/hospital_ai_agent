import { useState, useRef, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import Disclaimer from './components/Disclaimer'
import './App.css'

function App() {
  return (
    <div className="app">
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999
      }}>
        ULTRA MODERN UI v3.0 ✅
      </div>
      <Disclaimer />
      <ChatInterface />
    </div>
  )
}

export default App

