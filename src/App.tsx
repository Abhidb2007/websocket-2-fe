import { useEffect, useRef, useState } from 'react'
import './App.css'

type ChatMessage = {
  id: string
  text: string
  fromMe?: boolean
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'initial', text: 'hi there', fromMe: false },
  ])
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000')
    wsRef.current = ws

    ws.onopen = () => {
      console.log('ws open')
      setConnected(true)
    }

    ws.onmessage = (ev) => {
      const text = String(ev.data)
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-${prev.length}`, text, fromMe: false },
      ])
    }

    ws.onclose = () => {
      console.log('ws closed')
      setConnected(false)
    }

    ws.onerror = (err) => {
      console.error('ws error', err)
    }

    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [])

  
  useEffect(() => {
    const el = containerRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages])

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(text)
    }
    
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-me`, text, fromMe: true },
    ])
    setInput('')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      
      <div
        ref={containerRef}
        className="text-white p-4 overflow-auto flex-grow"
        style={{ maxHeight: '100%' }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`inline-block rounded px-4 py-2 mb-3 ${
              m.fromMe ? 'bg-purple-600 text-white self-end' : 'bg-white text-black'
            }`}
            style={{ display: 'block', maxWidth: '80%' }}
          >
            {m.text}
          </div>
        ))}
      </div>

      
      <div className="bg-gray-900 p-4">
        <div className="flex items-center gap-4 mb-2">
          <div className="text-sm text-gray-300">
            Status: {connected ? <span className="text-green-400">connected</span> : <span className="text-red-400">disconnected</span>}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
          className="flex gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded"
            aria-label="message"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={!connected && input.trim().length === 0}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default App