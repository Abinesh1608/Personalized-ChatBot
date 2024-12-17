import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Welcome to 608 AssignmentBot! How can I help with your reading assignment today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const channelToken = 'Abinesh608';  // Fixed channel token
  const apiKey = 'BuhWLuzZ.3xLhxAh7dHseSatY4apZJDDBZAm7j7El';  // Your API key
  const endpointId = 'HQ9S7Q3TEH'; // Your unique endpoint_id

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { sender: 'user', text: input }]);
      setInput('');
      setLoading(true);  // Set loading state to true while waiting for the API response

      // Set up the API request payload
      const payload = {
        payload: input,
        custom_variables: {
          long_polling: false, // Set to true if you want long polling
        }
      };

      const options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Apikey': `Api-Key ${apiKey}`,
        },
        body: JSON.stringify(payload),
      };

      // Send the request to the API and process the response
      fetch(`https://payload.vextapp.com/hook/${endpointId}/catch/${channelToken}`, options)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`API error: ${res.status} ${res.statusText}`);
          }
          return res.json(); // Convert the response to JSON
        })
        .then((res) => {
          console.log('API Response:', res); // Log the response to the console

          // Check if 'text' exists in the response and update the chat
          if (res.text) {
            setMessages((prevMessages) => [
              ...prevMessages,
              { sender: 'bot', text: res.text }, // Display the text from the API response
            ]);
          } else {
            setMessages((prevMessages) => [
              ...prevMessages,
              { sender: 'bot', text: "Sorry, there was no response text." },
            ]);
          }
        })
        .catch((err) => {
          console.error('Error:', err);
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'bot', text: "Sorry, there was an error processing your request." }
          ]);
        })
        .finally(() => {
          setLoading(false);  // Reset loading state after the request is completed
        });
    }
  };

  return (
    <div className="chat-container">
      {/* Page Title */}
      <h1 className="chat-title">608 AssignmentBot</h1>

      {/* Chat Box */}
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage} disabled={loading}>
          {loading ? 'Processing...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default App;
