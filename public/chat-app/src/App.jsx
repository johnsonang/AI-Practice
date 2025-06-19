import { useState } from 'react';
import './App.css';

function App() {
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const messageToSend = currentMessage; // Store current message
    const userMessage = { type: 'user', message: messageToSend };
    setChatLog(prevChatLog => [...prevChatLog, userMessage]);
    setCurrentMessage(''); // Clear input after capturing the message

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageToSend }), // Use stored message
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = { type: 'ai', message: data.response };
      setChatLog(prevChatLog => [...prevChatLog, aiMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage = { type: 'error', message: 'Error fetching response from AI.' };
      setChatLog(prevChatLog => [...prevChatLog, errorMessage]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat with AI</h1>
      </header>
      <div className="chat-log">
        {chatLog.map((entry, index) => (
          <div key={index} className={`message ${entry.type}`}>
            <p><strong>{entry.type === 'user' ? 'You' : 'AI'}:</strong> {entry.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
}

export default App;
