import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

export const ChatDrawer = () => {
  const { isChatDrawerOpen, setChatDrawerOpen } = useWorkspaceStore();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'Sarah Smith', avatar: 'icons/avatr4.svg', text: 'Hello team! Groundbreaking ceremony scheduled for Thursday.', time: '10:15 AM' },
    { id: 'm2', sender: 'You', avatar: 'icons/avatar1.svg', text: 'Great! All contractor permits are already uploaded in document history.', time: '10:18 AM' },
  ]);

  if (!isChatDrawerOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now().toString(), sender: 'You', avatar: 'icons/avatar1.svg', text: messageText, time: 'Just now' },
    ]);
    setMessageText('');
  };

  return (
    <div className="position-fixed top-0 end-0 h-100 bg-white border-start shadow-lg d-flex flex-column" style={{ width: '400px', zIndex: 1065 }}>
      {/* Header */}
      <div className="p-3 border-bottom bg-primary text-white d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <i className="material-icons fs-5">forum</i>
          <h6 className="m-0 fw-bold">Emaar Team Chat</h6>
        </div>
        <button className="btn-close btn-close-white" onClick={() => setChatDrawerOpen(false)}></button>
      </div>

      {/* Messages Feed */}
      <div className="p-3 flex-grow-1 overflow-auto bg-light">
        {messages.map((m) => {
          const isMe = m.sender === 'You';
          return (
            <div key={m.id} className={`d-flex gap-2 mb-3 ${isMe ? 'flex-row-reverse' : ''}`}>
              <img src={`/${m.avatar}`} alt={m.sender} className="rounded-circle border" style={{ width: '28px', height: '28px' }} />
              <div className={`p-2 rounded-3 max-w-75 ${isMe ? 'bg-primary text-white' : 'bg-white text-dark border shadow-sm'}`} style={{ maxWidth: '75%' }}>
                <div className="d-flex justify-content-between align-items-center gap-2 mb-1">
                  <strong style={{ fontSize: '11px' }}>{m.sender}</strong>
                  <span style={{ fontSize: '9px', opacity: 0.8 }}>{m.time}</span>
                </div>
                <p className="m-0 small">{m.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-2 border-top bg-white">
        <div className="input-group">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button className="btn btn-primary btn-sm" type="submit">
            <i className="material-icons fs-6">send</i>
          </button>
        </div>
      </form>
    </div>
  );
};
