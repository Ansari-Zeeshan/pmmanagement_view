import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

export const ChatDrawer = () => {
  const { isChatDrawerOpen, setChatDrawerOpen, activeTaskDetail } = useWorkspaceStore();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'Sarah Smith', avatar: 'icons/avatr4.svg', text: 'Hello team! Groundbreaking ceremony scheduled for Thursday.', time: '10:15 AM' },
    { id: 'm2', sender: 'You', avatar: 'icons/avatar1.svg', text: 'Great! All contractor permits are already uploaded in document history.', time: '10:18 AM' },
  ]);

  // Lock DOM page scroll when chat drawer is active
  useEffect(() => {
    if (!isChatDrawerOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalDocOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocOverflow;
    };
  }, [isChatDrawerOpen]);

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
    <>
      {/* Background Dimmed Overlay Backdrop */}
      <div
        className="pm-chat-drawer-backdrop position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
        style={{ zIndex: 1060, backdropFilter: 'blur(2px)' }}
        onClick={() => setChatDrawerOpen(false)}
      />

      {/* Chat Drawer Side Panel */}
      <div className="pm-chat-drawer-panel position-fixed top-0 end-0 h-100 bg-white border-start shadow-lg d-flex flex-column" style={{ width: '450px', zIndex: 1065 }}>
        {/* Drawer Header */}
        <div className="pm-chat-drawer-header p-3 border-bottom bg-primary text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="material-icons fs-5">forum</i>
            <div>
              <h6 className="pm-chat-title m-0 fw-bold" style={{ fontSize: '14px' }}>
                {activeTaskDetail?.title || activeTaskDetail?.name ? (activeTaskDetail.title || activeTaskDetail.name) : 'Emaar Team Chat'}
              </h6>
              {activeTaskDetail && (
                <span className="pm-chat-subtitle" style={{ fontSize: '11px', opacity: 0.85 }}>Task Chat</span>
              )}
            </div>
          </div>
          <button className="pm-chat-close-btn btn-close btn-close-white" onClick={() => setChatDrawerOpen(false)}></button>
        </div>

        {/* Messages Feed Container */}
        <div className="pm-chat-drawer-feed p-3 flex-grow-1 overflow-auto bg-light">
          {messages.map((m) => {
            const isMe = m.sender === 'You';
            return (
              <div key={m.id} className={`pm-chat-message-item d-flex gap-2 mb-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                <img src={`/${m.avatar}`} alt={m.sender} className="pm-chat-avatar rounded-circle border" style={{ width: '28px', height: '28px' }} />
                <div className={`pm-chat-message-bubble p-2 rounded-3 max-w-75 ${isMe ? 'bg-primary text-white' : 'bg-white text-dark border shadow-sm'}`} style={{ maxWidth: '75%' }}>
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

        {/* Message Input Form */}
        <form onSubmit={handleSend} className="pm-chat-drawer-input-form p-2 border-top bg-white">
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
    </>
  );
};
