import { useState, useEffect } from 'react';
import './App.css'

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    
    ws.onmessage = (event) => {
      setMessages(prev => [...prev, event.data]);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="h-screen bg-black">
      <div className="h-[95vh]"></div>
      {messages.map((message, index) => (
        <span key={index} className="bg-white text-black rounded p-4 m-8">
          {message}
        </span>
      ))}

      <div className="w-full bg-white flex p-4">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-4 border border-gray-300 rounded-lg"
        />
        <button className="bg-purple-600 text-white px-6 py-4 rounded-lg ml-2">
          Send message
        </button>
      </div>
    </div>
  )
}

export default App;