import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { helix } from 'ldrs';

helix.register();


function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // This is where we store all messages
  const [isLoading, setIsLoading] = useState(false);

  const handleSend2 = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { text: input, sender: 'User' }]);
      setInput(""); // Clear the input box after sending the message
    }
  };


  const handleSend = async () => {
    if (input.trim() !== "") {
      // Add the user's message to the conversation
      const newMessages = [...messages, { text: input, sender: 'User' }];
      setMessages(newMessages);
      setInput("");
      setIsLoading(true); // Start loading spinner
   
      // Call the OpenAI API
      try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', 
        {
          model: "gpt-4o-mini", // Use "gpt-3.5-turbo" if you have access to GPT-4
          messages: [
            { role: "system", content: "You are now Harry Potter, respond as if you are him." },
            { role: "user", content: input }
          ],
        }, 
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // Use the env variable
            'Content-Type': 'application/json'
          }
        });

        // Extract the bot's response from the API response
        const botResponse = response.data.choices[0].message.content;

        // Add the bot's response to the conversation
        setMessages([...newMessages, { text: botResponse, sender: 'Bot' }]);
      } catch (error) {
        console.error("Error connecting to ChatGPT API:", error);
        // Add an error message to the conversation
        setMessages([...newMessages, { text: "Oops! Something went wrong. Please try again later.", sender: 'Bot' }]);

      }

      setIsLoading(false); // Stop loading spinner

      // Clear the input box after sending the message
      setInput("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  
  return (
    <div className="App">
      <div className="header">
        <h1>Chat with AI Harry Potter</h1>
        {isLoading && (
          <l-helix
            size="45"
            speed="2.5"
            color="yellow"
            className="loader"
          ></l-helix>
        )}
      </div>
      <div className="chat-container">
        <div className="chat-box">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
            placeholder="Type your message here..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
