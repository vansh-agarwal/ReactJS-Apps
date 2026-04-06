import { useState, useRef, useEffect } from "react";
import "./App.css";

const CURRENT_USER = "You";
const OTHER_USER = "Alex";

const formatTime = (date) =>
  date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const seedMessages = [
  { id: 1, sender: OTHER_USER, text: "Hey! How's it going?", time: new Date(Date.now() - 300000) },
  { id: 2, sender: CURRENT_USER, text: "Pretty good! Just working on some React stuff 😄", time: new Date(Date.now() - 240000) },
  { id: 3, sender: OTHER_USER, text: "Nice! React is great. What are you building?", time: new Date(Date.now() - 180000) },
  { id: 4, sender: CURRENT_USER, text: "A real-time chat UI actually 😂", time: new Date(Date.now() - 120000) },
  { id: 5, sender: OTHER_USER, text: "Haha meta! Send me a screenshot when done 📸", time: new Date(Date.now() - 60000) },
];

export default function App() {
  const [messages, setMessages] = useState(seedMessages);
  const [input, setInput] = useState("");
  const [simulateReply, setSimulateReply] = useState(true);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const nextId = useRef(6);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const newMsg = { id: nextId.current++, sender: CURRENT_USER, text, time: new Date() };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    inputRef.current?.focus();

    if (simulateReply) {
      const replies = [
        "That's interesting! 🤔",
        "Got it! Tell me more.",
        "Haha, sounds good! 😄",
        "Nice one! 👍",
        "I agree completely!",
        "Wait really? That's wild.",
        "Ok, I'll check it out later.",
        "Wow, that's awesome 🔥",
      ];
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId.current++,
            sender: OTHER_USER,
            text: replies[Math.floor(Math.random() * replies.length)],
            time: new Date(),
          },
        ]);
      }, 800 + Math.random() * 700);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="app">
      <div className="chat-container">
        {/* HEADER */}
        <div className="chat-header">
          <div className="contact-info">
            <div className="avatar">{OTHER_USER[0]}</div>
            <div>
              <div className="contact-name">{OTHER_USER}</div>
              <div className="contact-status">● Online</div>
            </div>
          </div>
          <div className="header-actions">
            <label className="toggle-label">
              <input type="checkbox" checked={simulateReply} onChange={(e) => setSimulateReply(e.target.checked)} />
              <span>Auto-reply</span>
            </label>
            <button className="btn-clear" onClick={clearChat}>🗑️ Clear</button>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="messages-area">
          {messages.length === 0 && (
            <div className="empty-chat">No messages yet. Start the conversation!</div>
          )}
          {messages.map((msg, idx) => {
            const isSelf = msg.sender === CURRENT_USER;
            const isFirst = idx === 0 || messages[idx - 1].sender !== msg.sender;
            return (
              <div key={msg.id} className={`message-wrapper ${isSelf ? "self" : "other"}`}>
                {!isSelf && isFirst && <div className="msg-avatar">{msg.sender[0]}</div>}
                {!isSelf && !isFirst && <div className="msg-avatar-spacer" />}
                <div className={`bubble ${isSelf ? "bubble-self" : "bubble-other"}`}>
                  {!isSelf && isFirst && <div className="bubble-name">{msg.sender}</div>}
                  <p>{msg.text}</p>
                  <span className="timestamp">{formatTime(msg.time)}</span>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* INPUT */}
        <form className="input-area" onSubmit={sendMessage}>
          <input
            ref={inputRef}
            type="text"
            className="message-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="send-btn" disabled={!input.trim()}>
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
