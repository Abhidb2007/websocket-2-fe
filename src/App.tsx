import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState(["hi there"]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    
    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data]);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="h-screen bg-black">
      <br/><br/><br/>
      {/* Reduce the height of spacer so we can see messages */}
      <div className="h-[80vh]"></div>
      <div className="text-white text-xl p-4">
        {/* Add some spacing and larger text size */}
        {messages.map((message, index) => (
          <div key={index} className="mb-8">{message}</div>
        ))}
      </div>
      
      <div className="p-4">
        <input 
          type="text" 
          placeholder="Type your message..." 
          className="w-full p-2 rounded"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          Send message
        </button>
      </div>
    </div>
  )
}

export default App