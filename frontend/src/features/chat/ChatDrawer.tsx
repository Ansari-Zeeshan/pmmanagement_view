import { useEffect, useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

export const ChatDrawer = () => {
  const { isChatDrawerOpen, setChatDrawerOpen, activeTaskDetail, projectChats, addChatMessage } = useWorkspaceStore();
  const [messageText, setMessageText] = useState('');

  const taskId = activeTaskDetail?._id || 'general';
  const taskTitle = activeTaskDetail?.title || activeTaskDetail?.name || 'Project Team Chat';

  const defaultMessages = [
    { id: 'm1', sender: 'Sarah Smith', avatar: 'img/client3.jpg', text: `Discussing progress and updates for ${taskTitle}.`, time: '10:15 AM' },
    { id: 'm2', sender: 'Claire Bure', avatar: 'img/client1.jpg', text: 'All milestone deliverables and documents are synced in repository.', time: '10:18 AM' },
  ];

  const currentMessages = projectChats[taskId] && projectChats[taskId].length > 0
    ? projectChats[taskId]
    : defaultMessages;

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

    const newMsg = {
      id: 'm-' + Date.now(),
      sender: 'You',
      avatar: 'img/client1.jpg',
      text: messageText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    addChatMessage(taskId, newMsg);
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
        <div className="pm-chat-drawer-header p-3 border-bottom text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#0f172a' }}>
          <div className="d-flex align-items-center gap-2">
            <span className="badge rounded-circle bg-primary p-2">💬</span>
            <div>
              <h6 className="pm-chat-title m-0 fw-bold text-white" style={{ fontSize: '14px' }}>
                {taskTitle}
              </h6>
              <span className="pm-chat-subtitle text-white-50" style={{ fontSize: '11px' }}>
                {activeTaskDetail?.reference ? `Task Reference: ${activeTaskDetail.reference}` : 'General Chat'}
              </span>
            </div>
          </div>
          <button className="btn-close btn-close-white" onClick={() => setChatDrawerOpen(false)}></button>
        </div>

        {/* Messages Feed Container */}
        <div className="pm-chat-drawer-feed p-3 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8fafc' }}>
          {currentMessages.map((m) => {
            const isMe = m.sender === 'You';
            return (
              <div key={m.id} className={`pm-chat-message-item d-flex gap-2 mb-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                <img src={`/${m.avatar || 'img/client1.jpg'}`} alt={m.sender} className="pm-chat-avatar rounded-circle border" style={{ width: '28px', height: '28px', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }} />
                <div className={`pm-chat-message-bubble p-2 rounded-3 max-w-75 ${isMe ? 'bg-primary text-white' : 'bg-white text-dark border shadow-sm'}`} style={{ maxWidth: '75%' }}>
                  <div className="d-flex justify-content-between align-items-center gap-2 mb-1">
                    <strong style={{ fontSize: '11px', color: isMe ? '#ffffff' : '#0f172a' }}>{m.sender}</strong>
                    <span style={{ fontSize: '9px', opacity: 0.8 }}>{m.time}</span>
                  </div>
                  <p className="m-0 small" style={{ fontSize: '12.5px', lineHeight: 1.4 }}>{m.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSend} className="pm-chat-drawer-input-form p-3 border-top bg-white">
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-sm rounded-pill px-3"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              style={{ height: '38px', fontSize: '13px' }}
            />
            <button className="btn btn-primary btn-sm rounded-pill px-3 ms-2 fw-semibold" type="submit" style={{ height: '38px', backgroundColor: '#2563eb', borderColor: '#2563eb' }}>
              Send
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatDrawer;
