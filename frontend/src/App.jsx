import { useState, useRef, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import Disclaimer from './components/Disclaimer'
import './App.css'

function App() {
  return (
    <div className="app">
      <Disclaimer />
      <ChatInterface />
    </div>
  )
}

export default App

