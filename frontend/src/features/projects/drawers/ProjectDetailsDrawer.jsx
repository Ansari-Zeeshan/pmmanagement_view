import {
  AlignLeft,
  AtSign,
  Bell,
  Bold,
  Clock,
  Code,
  CornerDownRight,
  Download,
  Edit2,
  ExternalLink,
  FileText,
  FileUp,
  Filter,
  HelpCircle,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Mail,
  Minus,
  MoreVertical,
  Palette,
  Paperclip,
  Plus,
  RefreshCw,
  Search,
  Send,
  Smile,
  Sparkles,
  Strikethrough,
  Table,
  ThumbsUp,
  Trash2,
  Underline,
  User,
  X
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { LeadProfileModal } from '../../../components/common/LeadProfileModal';

export const ProjectDetailsDrawer = ({ task, onClose, onSave, defaultTab = 'UPDATES' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab); // 'UPDATES' | 'FILES' | 'LOG' | 'DETAILS'
  const [selectedLeadProfile, setSelectedLeadProfile] = useState(null);

  // Lock DOM page scroller when chat/project drawer is open
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalDocOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocOverflow;
    };
  }, []);

  // Title & Edit State
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(task?.title || 'Project 01');
  const [description, setDescription] = useState(task?.description || 'Emaar Enterprise Project Workspace Item');

  // Details Form State
  const [group, setGroup] = useState(task?.group || 'Research');
  const [createdDate, setCreatedDate] = useState(task?.createdDate || 'Oct 20, 2021, 10:00 AM');
  const [startDate, setStartDate] = useState(task?.startDate || 'Oct 20, 2021');
  const [endDate, setEndDate] = useState(task?.endDate || 'Oct 28, 2021');
  const [estHours, setEstHours] = useState(task?.estimatedHours || '40');
  const [status, setStatus] = useState(task?.status || 'On Track');
  const [cost, setCost] = useState(task?.actualBudget || 'AED 200');

  // Assignees & Subscribers
  const [showAssigneeSearch, setShowAssigneeSearch] = useState(false);
  const [showSubscriberPopover, setShowSubscriberPopover] = useState(false);
  const [subscriberSearch, setSubscriberSearch] = useState('');

  const [assignees, setAssignees] = useState(
    task?.assignees || [
      { name: 'Claire Bure', email: 'Clair@emaar.com', avatarUrl: '/img/client1.jpg' },
      { name: 'Ajmal Khan', email: 'Ajmal@emaar.com', avatarUrl: '/img/client2.jpg' },
    ]
  );

  const [subscribers, setSubscribers] = useState([
    { name: 'John Doe', email: 'John@emaar.com', avatar: '/img/client1.jpg' },
    { name: 'Smith', email: 'Smith@emaar.com', avatar: '/img/client2.jpg' },
    { name: 'Muhammad Ali', email: 'Ali@emaar.com', avatar: '/img/client3.jpg' },
  ]);

  const availableMembers = [
    { name: 'Claire Bure', email: 'Clair@emaar.com', avatarUrl: '/img/client1.jpg' },
    { name: 'Ajmal Khan', email: 'Ajmal@emaar.com', avatarUrl: '/img/client2.jpg' },
    { name: 'Muhammad Ali', email: 'Ali@emaar.com', avatarUrl: '/img/client3.jpg' },
    { name: 'Asif Khan', email: 'Asif@emaar.com', avatarUrl: '/img/client4.jpg' },
    { name: 'John Smith', email: 'John@emaar.com', avatarUrl: '/img/client5.jpg' },
  ];

  // Updates & Editor State
  const [updateText, setUpdateText] = useState('');
  const [showGifPopover, setShowGifPopover] = useState(false);
  const [showEmojiPopover, setShowEmojiPopover] = useState(false);
  const [showMentionPopover, setShowMentionPopover] = useState(false);
  const [attachedDraftFiles, setAttachedDraftFiles] = useState([]);
  const [attachedGif, setAttachedGif] = useState(null);

  // Replies & Like State
  const [activeReplyPostId, setActiveReplyPostId] = useState(null);
  const [replyInputText, setReplyInputText] = useState('');

  const [updates, setUpdates] = useState([
    {
      id: 1,
      author: 'John',
      avatar: '/img/client1.jpg',
      text: 'sfdvgd+f+g',
      time: '15 min ago',
      likesCount: 3,
      isLiked: false,
      seenCount: 2,
      replies: [],
    },
    {
      id: 2,
      author: 'Sarah Smith',
      avatar: '/icons/avatr4.svg',
      text: 'Milestone 1 architectural blueprints have been submitted for client review.',
      time: '2 hours ago',
      likesCount: 5,
      isLiked: true,
      seenCount: 4,
      replies: [
        {
          id: 201,
          author: 'Claire Bure',
          avatar: '/img/client2.jpg',
          text: 'Great progress! Structural calculations are also ready.',
          time: '1 hour ago',
        },
      ],
    },
  ]);

  // Files Tab State
  const [selectedFileType, setSelectedFileType] = useState('File Type 01');
  const [showFileTypeDropdown, setShowFileTypeDropdown] = useState(false);
  const [isFinalVersion, setIsFinalVersion] = useState('Yes');
  const [activeFileMenu, setActiveFileMenu] = useState(null);

  const [filesList, setFilesList] = useState([
    {
      id: 1,
      name: 'Ecommerce statement.pdf',
      type: 'File Type 01',
      date: 'Nov 02, 2021, 5:30 PM',
      version: '2.0',
      size: '2.4 MB',
      icon: '/icons/PDF2.svg',
    },
    {
      id: 2,
      name: 'Project_Specification.pdf',
      type: 'File Type 02',
      date: 'Nov 04, 2021, 11:20 AM',
      version: '1.0',
      size: '1.8 MB',
      icon: '/icons/PDF2.svg',
    },
  ]);

  // Dynamic Activity Logs State & Logging Helper
  const [activityLogs, setActivityLogs] = useState([
    { id: 1, time: '10 min ago', user: 'You', project: title, type: 'Update', detail: 'Posted project update' },
    { id: 2, time: '2 h ago', user: 'John', project: title, type: 'Subitems', detail: 'Subitem added' },
    { id: 3, time: '5 h ago', user: 'Smith', project: title, type: 'Timeline', detail: 'Oct 12 - 14', pill: true },
    { id: 4, time: '1 d ago', user: 'Ali', project: title, type: 'Status', detail: 'Changed to On Track' },
    { id: 5, time: '2 d ago', user: 'Claire', project: title, type: 'File', detail: 'Ecommerce statement.pdf uploaded' },
  ]);

  const addActivityLog = (type, detail) => {
    const newLog = {
      id: Date.now() + Math.random(),
      time: 'Just now',
      user: 'You',
      project: title,
      type,
      detail,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Log Filter State
  const [showLogFilterPopover, setShowLogFilterPopover] = useState(false);
  const [showPersonFilterPopover, setShowPersonFilterPopover] = useState(false);
  const [selectedPersonFilter, setSelectedPersonFilter] = useState(null);

  // File Version History Modal State
  const [historyModalFile, setHistoryModalFile] = useState(null);

  // Drag and Drop States
  const [isDragOverFiles, setIsDragOverFiles] = useState(false);
  const [isDragOverComposer, setIsDragOverComposer] = useState(false);

  // GIF & Emoji Picker Expanded Collections
  const [gifSearchQuery, setGifSearchQuery] = useState('');
  const [activeEmojiCategory, setActiveEmojiCategory] = useState('smileys');

  const gifCollection = [
    { label: '🎉 Celebration', gifUrl: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif' },
    { label: '🚀 Launch', gifUrl: 'https://media.giphy.com/media/26n6WywJyh39n1pBu/giphy.gif' },
    { label: '👏 Great Job', gifUrl: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif' },
    { label: '💡 Idea', gifUrl: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' },
    { label: '🎊 Congrats', gifUrl: 'https://media.giphy.com/media/g9582DNuQppxC/giphy.gif' },
    { label: '🙌 High Five', gifUrl: 'https://media.giphy.com/media/3oEjHV0z85GPvqxkZX/giphy.gif' },
    { label: '🔥 On Fire', gifUrl: 'https://media.giphy.com/media/nrXif9Y6SWND2/giphy.gif' },
    { label: '💯 Approved', gifUrl: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif' },
    { label: '🤯 Mind Blown', gifUrl: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' },
    { label: '💻 Working Hard', gifUrl: 'https://media.giphy.com/media/13HgwAK9xk0AiY/giphy.gif' },
  ];

  const emojiCategories = {
    smileys: ['👍', '❤️', '🔥', '😊', '🎉', '🚀', '💡', '👏', '🎯', '📌', '✅', '🙌'],
    work: ['💼', '📊', '🏆', '⭐️', '⚡️', '💯', '🤝', '📁', '💻', '📈', '📋', '🔑'],
    reactions: ['😂', '😍', '🤔', '😎', '🥳', '🤯', '💪', '🙏', '✨', '🌟', '👀', '👋'],
  };

  // Textarea Ref & Rich Text Formatting Handler
  const textareaRef = useRef(null);

  const applyFormatting = (before, after = '') => {
    if (!textareaRef.current) {
      setUpdateText((prev) => prev + before + 'text' + after);
      return;
    }
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = updateText.substring(start, end) || 'text';
    const newText = updateText.substring(0, start) + before + selectedText + after + updateText.substring(end);
    setUpdateText(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  // Formatted Text Parser Renderer
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');
    return lines.map((line, lineIdx) => {
      let parts = [line];

      // Bold **text**
      parts = parts.flatMap((part) => {
        if (typeof part !== 'string') return [part];
        const subParts = part.split(new RegExp('(\\*{2}.*?\\*{2})', 'g'));
        return subParts.map((sub, i) => {
          if (sub.startsWith('**') && sub.endsWith('**') && sub.length > 4) {
            return <strong key={`b-${i}`}>{sub.slice(2, -2)}</strong>;
          }
          return sub;
        });
      });

      // Italic *text*
      parts = parts.flatMap((part) => {
        if (typeof part !== 'string') return [part];
        const subParts = part.split(new RegExp('(\\*[^*]+\\*)', 'g'));
        return subParts.map((sub, i) => {
          if (sub.startsWith('*') && sub.endsWith('*') && sub.length > 2) {
            return <em key={`i-${i}`}>{sub.slice(1, -1)}</em>;
          }
          return sub;
        });
      });

      // Underline <u>text</u>
      parts = parts.flatMap((part) => {
        if (typeof part !== 'string') return [part];
        const subParts = part.split(new RegExp('(<' + 'u>.*?<' + '/u>)', 'gi'));
        return subParts.map((sub, i) => {
          if (sub.toLowerCase().startsWith('<' + 'u>') && sub.toLowerCase().endsWith('<' + '/u>')) {
            return <u key={`u-${i}`}>{sub.slice(3, -4)}</u>;
          }
          return sub;
        });
      });

      // Strikethrough ~~text~~
      parts = parts.flatMap((part) => {
        if (typeof part !== 'string') return [part];
        const subParts = part.split(new RegExp('(~~.*?~~)', 'g'));
        return subParts.map((sub, i) => {
          if (sub.startsWith('~~') && sub.endsWith('~~') && sub.length > 4) {
            return <del key={`s-${i}`}>{sub.slice(2, -2)}</del>;
          }
          return sub;
        });
      });

      // Code `text`
      parts = parts.flatMap((part) => {
        if (typeof part !== 'string') return [part];
        const subParts = part.split(new RegExp('(`.*?`)', 'g'));
        return subParts.map((sub, i) => {
          if (sub.startsWith('`') && sub.endsWith('`') && sub.length > 2) {
            return <code key={`c-${i}`} className="bg-light px-1 py-1 rounded text-danger" style={{ fontSize: '12px' }}>{sub.slice(1, -1)}</code>;
          }
          return sub;
        });
      });

      return (
        <React.Fragment key={lineIdx}>
          {lineIdx > 0 && <br />}
          {parts}
        </React.Fragment>
      );
    });
  };

  // Action Handlers
  const handleToggleAssignee = (member) => {
    if (assignees.some((a) => a.email === member.email)) {
      setAssignees(assignees.filter((a) => a.email !== member.email));
    } else {
      setAssignees([...assignees, member]);
    }
  };

  const handleAddSubscriber = (member) => {
    if (!subscribers.some((s) => s.email === member.email)) {
      setSubscribers([...subscribers, { name: member.name, email: member.email, avatar: member.avatarUrl }]);
      addActivityLog('Subscriber', `Added ${member.name} to team subscribers`);
    }
  };

  const handleRemoveSubscriber = (email) => {
    setSubscribers(subscribers.filter((s) => s.email !== email));
    addActivityLog('Subscriber', `Removed subscriber ${email}`);
  };

  const handleToggleLike = (postId) => {
    setUpdates((prev) =>
      prev.map((up) => {
        if (up.id === postId) {
          const nextLiked = !up.isLiked;
          if (nextLiked) {
            addActivityLog('Reaction', `Liked update post by ${up.author}`);
          }
          return {
            ...up,
            isLiked: nextLiked,
            likesCount: nextLiked ? (up.likesCount || 0) + 1 : Math.max(0, (up.likesCount || 1) - 1),
          };
        }
        return up;
      })
    );
  };

  const handleAddReply = (postId) => {
    if (!replyInputText.trim()) return;
    setUpdates((prev) =>
      prev.map((up) => {
        if (up.id === postId) {
          return {
            ...up,
            replies: [
              ...(up.replies || []),
              {
                id: Date.now(),
                author: 'You',
                avatar: '/img/client1.jpg',
                text: replyInputText,
                time: 'Just now',
              },
            ],
          };
        }
        return up;
      })
    );
    addActivityLog('Reply', `Replied: "${replyInputText.slice(0, 30)}..."`);
    setReplyInputText('');
    setActiveReplyPostId(null);
  };

  const handleDraftFileUpload = (e) => {
    const fileList = Array.from(e.target.files || []);
    if (fileList.length === 0) return;
    const newAttached = fileList.map((f) => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
    }));
    setAttachedDraftFiles((prev) => [...prev, ...newAttached]);
  };

  const handlePostUpdate = (e) => {
    e.preventDefault();
    if (!updateText.trim() && attachedDraftFiles.length === 0 && !attachedGif) return;

    const newPost = {
      id: Date.now(),
      author: 'You',
      avatar: '/img/client1.jpg',
      text: updateText,
      gif: attachedGif,
      attachedFiles: attachedDraftFiles,
      time: 'Just now',
      likesCount: 0,
      isLiked: false,
      seenCount: 1,
      replies: [],
    };

    setUpdates([newPost, ...updates]);

    if (attachedDraftFiles.length > 0) {
      const newFilesForTab = attachedDraftFiles.map((f) => ({
        id: Date.now() + Math.random(),
        name: f.name,
        type: selectedFileType,
        date: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        version: '1.0',
        size: f.size,
        icon: '/icons/PDF2.svg',
      }));
      setFilesList((prev) => [...newFilesForTab, ...prev]);
    }

    addActivityLog('Update', `Posted project update: "${updateText.slice(0, 35) || 'Media update'}..."`);

    setUpdateText('');
    setAttachedDraftFiles([]);
    setAttachedGif(null);
    setShowGifPopover(false);
    setShowEmojiPopover(false);
    setShowMentionPopover(false);
  };

  // File Upload Handler
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    const newFileObj = {
      id: Date.now(),
      name: uploadedFile.name,
      type: selectedFileType,
      date: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      version: isFinalVersion === 'Yes' ? 'Final 1.0' : 'Draft 0.1',
      size: `${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      icon: '/icons/PDF2.svg',
    };
    setFilesList([newFileObj, ...filesList]);
    addActivityLog('File Upload', `Uploaded ${uploadedFile.name}`);
  };

  // File Action Handlers: Open in New Tab, Download, View History, Delete
  const handleOpenFile = (file) => {
    const htmlLines = [
      '<!DOCTYPE html>',
      '<html>',
      '<head>',
      '  <title>' + file.name + ' - Viewer<' + '/title>',
      '  <style>',
      '    body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px; display: flex; justify-content: center; }',
      '    .card { background: #1e293b; border-radius: 12px; padding: 32px; max-width: 720px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }',
      '    h2 { color: #38bdf8; margin-top: 0; display: flex; align-items: center; gap: 10px; }',
      '    .badge { background: #3b82f6; color: white; padding: 4px 10px; border-radius: 20px; font-size: 13px; font-weight: 600; }',
      '    .meta { color: #94a3b8; font-size: 14px; margin: 16px 0; border-bottom: 1px solid #334155; padding-bottom: 16px; display: flex; gap: 20px; }',
      '    .content { line-height: 1.7; color: #cbd5e1; font-size: 15px; }',
      '  <' + '/style>',
      '<' + '/head>',
      '<body>',
      '  <div class="card">',
      '    <h2>📄 ' + file.name + ' <span class="badge">v' + file.version + '<' + '/span><' + '/h2>',
      '    <div class="meta">',
      '      <span>Category: <strong>' + file.type + '<' + '/strong><' + '/span>',
      '      <span>Size: <strong>' + file.size + '<' + '/strong><' + '/span>',
      '      <span>Date: <strong>' + file.date + '<' + '/strong><' + '/span>',
      '    <' + '/div>',
      '    <div class="content">',
      '      <h3>Emaar Enterprise Project Document Preview<' + '/h3>',
      '      <p>This is a live preview window for <strong>' + file.name + '<' + '/strong> associated with project workspace <em>' + title + '<' + '/em>.<' + '/p>',
      '      <p>Document Status: Verified Final Record. Ready for team collaboration and download.<' + '/p>',
      '    <' + '/div>',
      '  <' + '/div>',
      '<' + '/body>',
      '<' + '/html>'
    ];
    const blob = new Blob([htmlLines.join('\n')], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    addActivityLog('File View', `Opened file ${file.name} in new tab`);
    setActiveFileMenu(null);
  };

  const handleDownloadFile = (file) => {
    const content = `Emaar Enterprise Project Document: ${file.name}\nVersion: ${file.version}\nCategory: ${file.type}\nDate: ${file.date}\nSize: ${file.size}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addActivityLog('File Download', `Downloaded ${file.name}`);
    setActiveFileMenu(null);
  };

  const handleDeleteFile = (id) => {
    const file = filesList.find((f) => f.id === id);
    if (window.confirm(`Are you sure you want to delete ${file?.name || 'this file'}?`)) {
      setFilesList((prev) => prev.filter((f) => f.id !== id));
      if (file) {
        addActivityLog('File Delete', `Deleted file ${file.name}`);
      }
      setActiveFileMenu(null);
    }
  };

  // Drag and Drop Handlers
  const handleFilesDrop = (e) => {
    e.preventDefault();
    setIsDragOverFiles(false);
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    if (droppedFiles.length === 0) return;

    const newFiles = droppedFiles.map((f) => ({
      id: Date.now() + Math.random(),
      name: f.name,
      type: selectedFileType,
      date: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      version: isFinalVersion === 'Yes' ? 'Final 1.0' : 'Draft 0.1',
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      icon: '/icons/PDF2.svg',
    }));

    setFilesList((prev) => [...newFiles, ...prev]);
    droppedFiles.forEach((f) => addActivityLog('File Upload', `Uploaded ${f.name} via drag & drop`));
  };

  const handleComposerDrop = (e) => {
    e.preventDefault();
    setIsDragOverComposer(false);
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    if (droppedFiles.length === 0) return;

    const newAttached = droppedFiles.map((f) => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
    }));

    setAttachedDraftFiles((prev) => [...prev, ...newAttached]);
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...task,
        title,
        description,
        group,
        startDate,
        endDate,
        estimatedHours: estHours,
        status,
        actualBudget: cost,
        assignees,
      });
    }
  };

  return (
    <>
      {/* Dimmed Overlay Backdrop - TOP STACKING Z-INDEX 100000 */}
      <div
        className="proj_overlay pm-drawer-backdrop active"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          zIndex: 100000,
          display: 'block',
        }}
      ></div>

      {/* Slide-In Drawer Panel - TOP STACKING Z-INDEX 100005 */}
      <div
        className="proj_edit pm-drawer-panel active shadow-2xl"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '50vw',
          minWidth: '660px',
          maxWidth: '1000px',
          height: '100vh',
          backgroundColor: '#ffffff',
          zIndex: 100005,
          boxShadow: '-16px 0 40px rgba(0, 0, 0, 0.22)',
          overflowY: 'auto',
          padding: '28px 40px',
          display: 'block',
        }}
      >
        {/* ============================================================ */}
        {/* DRAWER TOP CONTROL BAR */}
        {/* ============================================================ */}
        <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4 position-relative">
          {/* Close Button */}
          <button
            type="button"
            className="btn btn-light rounded-circle p-2 border d-flex align-items-center justify-content-center"
            onClick={onClose}
            title="Close Drawer (Esc)"
            style={{ width: '36px', height: '36px' }}
          >
            <X size={18} className="text-secondary" />
          </button>

          {/* Subscribers & Team Avatars */}
          <div className="d-flex align-items-center gap-2 position-relative">
            <div className="d-flex align-items-center me-1">
              {subscribers.slice(0, 3).map((sub, sIdx) => (
                <img
                  key={sIdx}
                  src={sub.avatar}
                  alt={sub.name}
                  className="rounded-circle border border-white"
                  style={{ width: '32px', height: '32px', objectFit: 'cover', marginLeft: sIdx > 0 ? '-8px' : '0', cursor: 'pointer' }}
                  title={`View ${sub.name} profile`}
                  onClick={() => setSelectedLeadProfile({ name: sub.name, type: 'Project Subscriber' })}
                  onError={(e) => { e.target.src = '/icons/avatar1.svg'; }}
                />
              ))}
            </div>

            {/* Add Team Subscriber Button */}
            <button
              type="button"
              className="btn btn-sm btn-light border border-primary border-dashed rounded-circle d-flex align-items-center justify-content-center p-0"
              style={{ width: '32px', height: '32px', borderStyle: 'dashed' }}
              onClick={() => setShowSubscriberPopover(!showSubscriberPopover)}
              title="Add Team Subscribers"
            >
              <Plus size={16} color="#4868DD" />
            </button>

            {/* TEAM SUBSCRIBER POPOVER */}
            {showSubscriberPopover && (
              <div
                className="position-absolute end-0 top-100 mt-2 bg-white border rounded-3 shadow-lg p-3"
                style={{ width: '340px', zIndex: 1080 }}
              >
                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                  <h6 className="m-0 fw-bold text-dark fs-6 d-flex align-items-center gap-1">
                    <Plus size={16} color="#4868DD" /> Add Team Subscribers
                  </h6>
                  <button
                    type="button"
                    className="btn btn-sm btn-light p-1 border-0"
                    onClick={() => setShowSubscriberPopover(false)}
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="mb-3">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control form-control-sm ps-4"
                      placeholder="Enter Name or Email"
                      value={subscriberSearch}
                      onChange={(e) => setSubscriberSearch(e.target.value)}
                    />
                    <Search size={14} className="position-absolute start-0 top-50 translate-middle-y ms-2 text-muted" />
                  </div>
                </div>

                <div className="text-muted small fw-semibold mb-2">Team Subscribers List</div>
                <div className="overflow-auto" style={{ maxHeight: '180px' }}>
                  {subscribers.map((sub, idx) => (
                    <div key={idx} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                      <div className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }} onClick={() => setSelectedLeadProfile({ name: sub.name, type: 'Project Subscriber' })}>
                        <img
                          src={sub.avatar}
                          alt={sub.name}
                          className="rounded-circle"
                          style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = '/icons/avatar1.svg'; }}
                        />
                        <div>
                          <div className="fw-semibold text-dark small text-primary-hover">{sub.name}</div>
                          <div className="text-muted" style={{ fontSize: '11px' }}>{sub.email}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm text-danger p-0 border-0 ms-2"
                        onClick={() => handleRemoveSubscriber(sub.email)}
                        title="Remove Subscriber"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* PROJECT TITLE & DESCRIPTION HEADER */}
        {/* ============================================================ */}
        <div className="mb-4">
          <div className="d-flex align-items-center gap-2">
            {isEditingTitle ? (
              <input
                type="text"
                className="form-control form-control-lg fw-bold"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
              />
            ) : (
              <h1 className="m-0 text-dark fw-bold" style={{ fontSize: '24px', letterSpacing: '-0.5px' }}>
                {title}
              </h1>
            )}
            <button
              type="button"
              className="btn btn-sm p-1 border-0 text-muted"
              onClick={() => setIsEditingTitle(!isEditingTitle)}
              title="Edit Title"
            >
              <Edit2 size={16} />
            </button>
          </div>
          <p className="text-secondary small mt-1 mb-0">{description}</p>
        </div>

        {/* ============================================================ */}
        {/* MAIN DRAWER TAB NAVIGATION */}
        {/* ============================================================ */}
        <div className="nav_div mb-4 border-bottom">
          <ul className="d-flex list-unstyled mb-0" style={{ gap: '32px' }}>
            <li
              className={`pb-2.5 fw-semibold cursor-pointer ${activeTab === 'UPDATES' ? 'text-primary border-bottom border-primary border-2' : 'text-secondary'}`}
              onClick={() => setActiveTab('UPDATES')}
              style={{ cursor: 'pointer', fontSize: '14.5px', transition: 'color 0.15s ease' }}
            >
              Updates ...
            </li>
            <li
              className={`pb-2.5 fw-semibold cursor-pointer ${activeTab === 'FILES' ? 'text-primary border-bottom border-primary border-2' : 'text-secondary'}`}
              onClick={() => setActiveTab('FILES')}
              style={{ cursor: 'pointer', fontSize: '14.5px', transition: 'color 0.15s ease' }}
            >
              Files
            </li>
            <li
              className={`pb-2.5 fw-semibold cursor-pointer ${activeTab === 'LOG' ? 'text-primary border-bottom border-primary border-2' : 'text-secondary'}`}
              onClick={() => setActiveTab('LOG')}
              style={{ cursor: 'pointer', fontSize: '14.5px', transition: 'color 0.15s ease' }}
            >
              Active Log
            </li>
            <li
              className={`pb-2.5 fw-semibold cursor-pointer ${activeTab === 'DETAILS' ? 'text-primary border-bottom border-primary border-2' : 'text-secondary'}`}
              onClick={() => setActiveTab('DETAILS')}
              style={{ cursor: 'pointer', fontSize: '14.5px', transition: 'color 0.15s ease' }}
            >
              Project Information
            </li>
          </ul>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: UPDATES TAB */}
        {/* ============================================================ */}
        {activeTab === 'UPDATES' && (
          <div className="tab_content">
            {/* Rich Editor Block with Drag & Drop Composer */}
            <div
              className={`bg-white border rounded-3 p-3 mb-3 shadow-sm transition-all ${isDragOverComposer ? 'border-primary bg-primary-subtle' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOverComposer(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragOverComposer(false); }}
              onDrop={handleComposerDrop}
              style={{ transition: 'border-color 0.2s ease, background-color 0.2s ease' }}
            >
              {/* Rich Text Formatting Toolbar with Standard Lucide Icons */}
              <div className="d-flex align-items-center gap-1 pb-2 mb-2 border-bottom text-muted flex-wrap" style={{ fontSize: '13px', userSelect: 'none' }}>
                <button type="button" className="btn btn-sm btn-light text-secondary p-1 border-0" title="Paragraph / Normal Text" onClick={() => applyFormatting('')}>
                  <AlignLeft size={15} />
                </button>
                <button type="button" className="btn btn-sm btn-light text-secondary p-1 border-0" title="Bold (**text**)" onClick={() => applyFormatting('**', '**')}>
                  <Bold size={15} />
                </button>
                <button type="button" className="btn btn-sm btn-light text-secondary p-1 border-0" title="Italic (*text*)" onClick={() => applyFormatting('*', '*')}>
                  <Italic size={15} />
                </button>
                <button type="button" className="btn btn-sm btn-light text-secondary p-1 border-0" title="Underline (<u>text</u>)" onClick={() => applyFormatting('<u>', '</u>')}>
                  <Underline size={15} />
                </button>
                <button type="button" className="btn btn-sm btn-light text-secondary p-1 border-0" title="Strikethrough (~~text~~)" onClick={() => applyFormatting('~~', '~~')}>
                  <Strikethrough size={15} />
                </button>
                <button type="button" className="btn btn-sm btn-light text-secondary p-1 border-0" title="Text Color Highlight" onClick={() => applyFormatting('<' + 'span style="color:#2D62ED">', '<' + '/span>')}>
                  <Palette size={15} />
                </button>
                <span className="text-muted opacity-25 px-1">|</span>
                <button type="button" className="btn btn-sm btn-light text-secondary p-1 border-0" title="Bullet List" onClick={() => applyFormatting('\n- ')}>
                  <List size={15} />
                </button>
                <button type="button" className="btn btn-sm btn-light text-secondary p-1 border-0" title="Numbered List" onClick={() => applyFormatting('\n1. ')}>
                  <ListOrdered size={15} />
                </button>
                <button type="button" className="btn btn-sm btn-light text-secondary p-1 border-0" title="Table Grid" onClick={() => applyFormatting('\n| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n')}>
                  <Table size={15} />
                </button>
                <button type="button" className="btn btn-sm btn-light text-secondary p-1 border-0" title="Insert Link" onClick={() => applyFormatting('[Link Text](', ')')}>
                  <LinkIcon size={15} />
                </button>
                <button type="button" className="btn btn-sm btn-light text-secondary p-1 border-0" title="Divider Line" onClick={() => applyFormatting('\n---\n')}>
                  <Minus size={15} />
                </button>
                <button type="button" className="btn btn-sm btn-light text-secondary p-1 border-0" title="Inline Code (`code`)" onClick={() => applyFormatting('`', '`')}>
                  <Code size={15} />
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-light text-secondary p-1 border-0 ms-auto"
                  title="Formatting Guide"
                  onClick={() => alert('Markdown Shortcuts:\n**Bold**\n*Italic*\nUnderline\n~~Strikethrough~~\n`Inline Code`')}
                >
                  <HelpCircle size={15} />
                </button>
              </div>

              <textarea
                ref={textareaRef}
                className="form-control border-0 p-0 shadow-none"
                rows="4"
                placeholder="Write an update for your project team... (Drag & Drop files or images here)"
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
                style={{ resize: 'none', fontSize: '14px', outline: 'none' }}
              ></textarea>

              {/* Attached Draft Preview */}
              {(attachedDraftFiles.length > 0 || attachedGif) && (
                <div className="d-flex flex-wrap gap-2 pt-2 border-top mt-2">
                  {attachedGif && (
                    <div className="position-relative d-inline-block">
                      <img src={attachedGif} alt="Attached GIF" className="rounded border" style={{ height: '60px' }} />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm rounded-circle p-0 position-absolute top-0 end-0 translate-middle"
                        style={{ width: '18px', height: '18px', fontSize: '10px' }}
                        onClick={() => setAttachedGif(null)}
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {attachedDraftFiles.map((f, fIdx) => (
                    <div key={fIdx} className="d-flex align-items-center gap-1 bg-light border rounded px-2 py-1 small">
                      <FileText size={13} color="#2D62ED" />
                      <span className="text-dark fw-medium" style={{ fontSize: '12px' }}>{f.name}</span>
                      <X
                        size={13}
                        className="cursor-pointer text-muted ms-1"
                        onClick={() => setAttachedDraftFiles(attachedDraftFiles.filter((_, i) => i !== fIdx))}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Action Toolbar */}
              <div className="d-flex align-items-center justify-content-between pt-3 mt-2 border-top position-relative">
                <div className="d-flex align-items-center position-relative" style={{ gap: '24px' }}>
                  {/* Add files */}
                  <label
                    className="d-flex align-items-center gap-1 text-primary small cursor-pointer mb-0 fw-medium px-2 py-1 rounded"
                    style={{ cursor: 'pointer', color: '#2D62ED', transition: 'background-color 0.15s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eff6ff')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Paperclip size={16} color="#2D62ED" />
                    <span style={{ fontSize: '13.5px' }}>Add files</span>
                    <input type="file" className="d-none" multiple onChange={handleDraftFileUpload} />
                  </label>

                  {/* Expanded GIF Picker */}
                  <div className="position-relative">
                    <span
                      className="text-primary small cursor-pointer fw-bold px-2 py-1 rounded d-inline-block"
                      style={{
                        cursor: 'pointer',
                        color: '#2D62ED',
                        fontSize: '13.5px',
                        backgroundColor: showGifPopover ? '#eff6ff' : 'transparent',
                        transition: 'background-color 0.15s ease',
                      }}
                      onClick={() => {
                        setShowGifPopover(!showGifPopover);
                        setShowEmojiPopover(false);
                        setShowMentionPopover(false);
                      }}
                      onMouseEnter={(e) => !showGifPopover && (e.currentTarget.style.backgroundColor = '#eff6ff')}
                      onMouseLeave={(e) => !showGifPopover && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      Giff
                    </span>

                    {showGifPopover && (
                      <div className="position-absolute start-0 top-100 mt-2 bg-white border rounded-3 shadow-lg p-2" style={{ zIndex: 1090, width: '280px' }}>
                        <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                          <span className="fw-bold small text-dark d-flex align-items-center gap-1">
                            <Sparkles size={14} color="#2D62ED" /> Select a GIF
                          </span>
                          <X size={14} className="cursor-pointer text-muted" onClick={() => setShowGifPopover(false)} />
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-sm mb-2"
                          placeholder="Search GIFs..."
                          value={gifSearchQuery}
                          onChange={(e) => setGifSearchQuery(e.target.value)}
                        />
                        <div className="d-grid gap-1 overflow-auto" style={{ gridTemplateColumns: '1fr 1fr', maxHeight: '180px' }}>
                          {gifCollection
                            .filter((g) => g.label.toLowerCase().includes(gifSearchQuery.toLowerCase()))
                            .map((g, gIdx) => (
                              <button
                                key={gIdx}
                                type="button"
                                className="btn btn-sm btn-outline-light text-dark border p-1 text-center truncate"
                                style={{ fontSize: '11px' }}
                                onClick={() => {
                                  setAttachedGif(g.gifUrl);
                                  setShowGifPopover(false);
                                }}
                              >
                                {g.label}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Categorized Emoji Picker */}
                  <div className="position-relative">
                    <span
                      className="d-flex align-items-center gap-1 text-primary small cursor-pointer fw-medium px-2 py-1 rounded"
                      style={{
                        cursor: 'pointer',
                        color: '#2D62ED',
                        fontSize: '13.5px',
                        backgroundColor: showEmojiPopover ? '#eff6ff' : 'transparent',
                        transition: 'background-color 0.15s ease',
                      }}
                      onClick={() => {
                        setShowEmojiPopover(!showEmojiPopover);
                        setShowGifPopover(false);
                        setShowMentionPopover(false);
                      }}
                      onMouseEnter={(e) => !showEmojiPopover && (e.currentTarget.style.backgroundColor = '#eff6ff')}
                      onMouseLeave={(e) => !showEmojiPopover && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Smile size={16} color="#2D62ED" />
                      <span>Emoji</span>
                    </span>

                    {showEmojiPopover && (
                      <div className="position-absolute start-0 top-100 mt-2 bg-white border rounded-3 shadow-lg p-2" style={{ zIndex: 1090, width: '250px' }}>
                        <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                          <span className="fw-bold small text-dark">Select Emoji</span>
                          <X size={14} className="cursor-pointer text-muted" onClick={() => setShowEmojiPopover(false)} />
                        </div>
                        {/* Category Tabs */}
                        <div className="d-flex justify-content-around pb-2 border-bottom mb-2 text-muted small">
                          <span
                            className={`cursor-pointer px-1 ${activeEmojiCategory === 'smileys' ? 'fw-bold text-primary border-bottom border-primary' : ''}`}
                            onClick={() => setActiveEmojiCategory('smileys')}
                          >
                            Popular
                          </span>
                          <span
                            className={`cursor-pointer px-1 ${activeEmojiCategory === 'work' ? 'fw-bold text-primary border-bottom border-primary' : ''}`}
                            onClick={() => setActiveEmojiCategory('work')}
                          >
                            Work
                          </span>
                          <span
                            className={`cursor-pointer px-1 ${activeEmojiCategory === 'reactions' ? 'fw-bold text-primary border-bottom border-primary' : ''}`}
                            onClick={() => setActiveEmojiCategory('reactions')}
                          >
                            Reactions
                          </span>
                        </div>
                        <div className="d-flex flex-wrap gap-1 justify-content-center p-1">
                          {emojiCategories[activeEmojiCategory].map((emoji, eIdx) => (
                            <span
                              key={eIdx}
                              className="fs-5 cursor-pointer p-1 rounded hover-bg-light"
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                              onClick={() => {
                                setUpdateText((prev) => prev + ' ' + emoji);
                                setShowEmojiPopover(false);
                              }}
                            >
                              {emoji}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mention Picker */}
                  <div className="position-relative">
                    <span
                      className="d-flex align-items-center gap-1 text-primary small cursor-pointer fw-medium px-2 py-1 rounded"
                      style={{
                        cursor: 'pointer',
                        color: '#2D62ED',
                        fontSize: '13.5px',
                        backgroundColor: showMentionPopover ? '#eff6ff' : 'transparent',
                        transition: 'background-color 0.15s ease',
                      }}
                      onClick={() => {
                        setShowMentionPopover(!showMentionPopover);
                        setShowGifPopover(false);
                        setShowEmojiPopover(false);
                      }}
                      onMouseEnter={(e) => !showMentionPopover && (e.currentTarget.style.backgroundColor = '#eff6ff')}
                      onMouseLeave={(e) => !showMentionPopover && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <AtSign size={16} color="#2D62ED" />
                      <span>Mention</span>
                    </span>

                    {showMentionPopover && (
                      <div className="position-absolute start-0 top-100 mt-2 bg-white border rounded-3 shadow-lg p-2" style={{ zIndex: 1090, width: '220px' }}>
                        <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                          <span className="fw-bold small text-dark">Tag Team Member</span>
                          <X size={14} className="cursor-pointer text-muted" onClick={() => setShowMentionPopover(false)} />
                        </div>
                        <div className="d-flex flex-column gap-1">
                          {[
                            { name: 'John Smith', avatar: '/img/client1.jpg' },
                            { name: 'Sarah Smith', avatar: '/icons/avatr4.svg' },
                            { name: 'Claire Bure', avatar: '/img/client2.jpg' },
                            { name: 'Ajmal Khan', avatar: '/img/client3.jpg' },
                          ].map((m, mIdx) => (
                            <div
                              key={mIdx}
                              className="d-flex align-items-center gap-2 p-2 rounded cursor-pointer hover-bg-light"
                              style={{ cursor: 'pointer', fontSize: '12px' }}
                              onClick={() => {
                                setUpdateText((prev) => prev + ` @${m.name}`);
                                setShowMentionPopover(false);
                              }}
                            >
                              <img src={m.avatar} alt="" className="rounded-circle" style={{ width: '20px', height: '20px' }} />
                              <span className="fw-semibold text-dark">{m.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary px-4 py-2 fw-bold text-uppercase"
                  onClick={handlePostUpdate}
                  style={{ backgroundColor: '#2D62ED', borderColor: '#2D62ED', fontSize: '13px', borderRadius: '6px', boxShadow: '0 2px 6px rgba(45, 98, 237, 0.3)' }}
                >
                  UPDATE
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-end mb-4">
              <a href="#email-update" onClick={(e) => e.preventDefault()} className="text-secondary small d-flex align-items-center gap-1 text-decoration-none">
                <Mail size={14} /> Write Updates via email
              </a>
            </div>

            {/* Updates Stream Feed (Matching reference image) */}
            {updates.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {updates.map((up) => (
                  <div key={up.id} className="p-3 bg-white rounded-3 border shadow-sm position-relative">
                    {/* Post Header */}
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <div className="position-relative">
                          <img
                            src={up.avatar}
                            alt={up.author}
                            className="rounded-circle border"
                            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = '/icons/avatar1.svg'; }}
                          />
                          <span
                            className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-white"
                            style={{ width: '10px', height: '10px' }}
                          ></span>
                        </div>
                        <div>
                          <span className="fw-bold text-dark fs-6 me-2">{up.author}</span>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-3 text-muted small">
                        <span style={{ fontSize: '12px' }}>{up.seenCount || 2} seen</span>
                        <Bell size={15} className="cursor-pointer text-muted" title="Mute notifications" />
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="ps-4 ms-2 border-start py-1 mb-2">
                      <div className="m-0 text-dark" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                        {renderFormattedText(up.text)}
                      </div>
                      {up.gif && (
                        <div className="mt-2">
                          <img src={up.gif} alt="Attached GIF" className="rounded border" style={{ maxHeight: '180px' }} />
                        </div>
                      )}
                      {up.attachedFiles?.map((f, fIdx) => (
                        <div key={fIdx} className="d-inline-flex align-items-center gap-2 bg-light border rounded px-2 py-1 mt-2 me-2">
                          <FileText size={14} color="#2D62ED" />
                          <span className="small text-dark fw-medium">{f.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Post Footer Actions */}
                    <div className="d-flex align-items-center gap-5 text-muted pt-2 border-top" style={{ fontSize: '12.5px' }}>
                      <span className="text-secondary opacity-75">{up.time}</span>

                      {/* Interactive Like Button */}
                      <button
                        type="button"
                        className={`btn btn-sm border-0 p-0 d-flex align-items-center gap-1 ${up.isLiked ? 'text-primary fw-bold' : 'text-secondary'}`}
                        style={{ background: 'transparent', cursor: 'pointer' }}
                        onClick={() => handleToggleLike(up.id)}
                      >
                        <ThumbsUp size={14} fill={up.isLiked ? '#2D62ED' : 'none'} color={up.isLiked ? '#2D62ED' : 'currentColor'} />
                        <span>Like</span>
                        {up.likesCount > 0 && (
                          <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary ms-1" style={{ fontSize: '10px' }}>
                            {up.likesCount}
                          </span>
                        )}
                      </button>

                      {/* Interactive Reply Button */}
                      <button
                        type="button"
                        className="btn btn-sm border-0 p-0 text-secondary d-flex align-items-center gap-1"
                        style={{ background: 'transparent', cursor: 'pointer' }}
                        onClick={() => setActiveReplyPostId(activeReplyPostId === up.id ? null : up.id)}
                      >
                        <CornerDownRight size={14} />
                        <span>Reply</span>
                      </button>
                    </div>

                    {/* Nested Replies Stream */}
                    {up.replies && up.replies.length > 0 && (
                      <div className="mt-3 ps-3 border-start ms-3 d-flex flex-column gap-2">
                        {up.replies.map((reply) => (
                          <div key={reply.id} className="p-2 bg-light rounded border d-flex gap-2">
                            <img src={reply.avatar} alt="" className="rounded-circle" style={{ width: '26px', height: '26px' }} />
                            <div>
                              <div className="d-flex align-items-center gap-2">
                                <span className="fw-bold small text-dark">{reply.author}</span>
                                <span className="text-muted" style={{ fontSize: '11px' }}>{reply.time}</span>
                              </div>
                              <p className="m-0 small text-secondary">{reply.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline Reply Text Input */}
                    {activeReplyPostId === up.id && (
                      <div className="mt-3 pt-2 border-top d-flex gap-2 align-items-center">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Write a reply..."
                          value={replyInputText}
                          onChange={(e) => setReplyInputText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddReply(up.id)}
                          autoFocus
                        />
                        <button type="button" className="btn btn-primary btn-sm px-3 d-flex align-items-center gap-1" onClick={() => handleAddReply(up.id)}>
                          <Send size={12} />
                          <span>Reply</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 text-muted fw-semibold" style={{ fontSize: '14px' }}>
                No Updates Yet
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: FILES TAB */}
        {/* ============================================================ */}
        {activeTab === 'FILES' && (
          <div className="tab_content">
            <div className="row g-4">
              {/* LEFT COLUMN: Document History Stream */}
              <div className="col-md-6">
                <div className="fw-bold text-dark mb-3 fs-6 d-flex align-items-center gap-2">
                  <FileText size={18} color="#4868DD" /> Document History
                </div>

                <div className="d-flex flex-column gap-3">
                  {filesList.map((file) => (
                    <div key={file.id} className="p-3 bg-white rounded-3 border shadow-sm position-relative">
                      <div className="d-flex align-items-start justify-content-between">
                        <div className="d-flex align-items-start gap-3">
                          <img
                            src={file.icon || '/icons/PDF2.svg'}
                            alt="PDF"
                            style={{ width: '32px', height: '32px' }}
                            onError={(e) => { e.target.src = '/icons/Files.svg'; }}
                          />
                          <div>
                            <h6 className="m-0 fw-bold text-dark" style={{ fontSize: '14px' }}>{file.name}</h6>
                            <div className="d-flex align-items-center gap-2 text-muted mt-1" style={{ fontSize: '12px' }}>
                              <span className="badge bg-light text-primary border">{file.type}</span>
                              <span>v{file.version}</span>
                            </div>
                            <div className="text-muted mt-1" style={{ fontSize: '11px' }}>
                              Uploaded: {file.date} ({file.size})
                            </div>
                          </div>
                        </div>

                        {/* Three-Dot Menu */}
                        <div className="position-relative">
                          <button
                            type="button"
                            className="btn btn-sm btn-light border-0 p-1 rounded-circle"
                            onClick={() => setActiveFileMenu(activeFileMenu === file.id ? null : file.id)}
                          >
                            <MoreVertical size={16} className="text-secondary" />
                          </button>

                          {activeFileMenu === file.id && (
                            <div
                              className="position-absolute end-0 top-100 mt-1 bg-white border rounded shadow-lg p-2"
                              style={{ zIndex: 1080, minWidth: '170px' }}
                            >
                              <button
                                className="dropdown-item py-1 px-2 small d-flex align-items-center gap-2 text-dark"
                                onClick={() => handleOpenFile(file)}
                              >
                                <ExternalLink size={14} /> Open File in New Tab
                              </button>
                              <button
                                className="dropdown-item py-1 px-2 small d-flex align-items-center gap-2 text-dark"
                                onClick={() => handleDownloadFile(file)}
                              >
                                <Download size={14} /> Download File
                              </button>
                              <button
                                className="dropdown-item py-1 px-2 small d-flex align-items-center gap-2 text-dark"
                                onClick={() => { setHistoryModalFile(file); setActiveFileMenu(null); }}
                              >
                                <Clock size={14} /> View History
                              </button>
                              <div className="dropdown-divider my-1"></div>
                              <button
                                className="dropdown-item py-1 px-2 small d-flex align-items-center gap-2 text-danger"
                                onClick={() => handleDeleteFile(file.id)}
                              >
                                <Trash2 size={14} /> Delete File
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: File Type, Final Version & Drag & Drop Area */}
              <div className="col-md-6">
                {/* Choose File Type Dropdown */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark small">Choose File Type</label>
                  <div className="position-relative">
                    <button
                      type="button"
                      className="form-select text-start bg-white d-flex align-items-center justify-content-between"
                      onClick={() => setShowFileTypeDropdown(!showFileTypeDropdown)}
                    >
                      <span>{selectedFileType}</span>
                    </button>
                    {showFileTypeDropdown && (
                      <div
                        className="position-absolute start-0 top-100 w-100 mt-1 bg-white border rounded shadow-lg p-1"
                        style={{ zIndex: 1080 }}
                      >
                        {['File Type 01', 'File Type 02', 'File Type 03', 'File Type 04', 'File Type 05'].map((ft) => (
                          <div
                            key={ft}
                            className="dropdown-item py-2 px-3 small cursor-pointer hover-bg-light rounded"
                            onClick={() => {
                              setSelectedFileType(ft);
                              setShowFileTypeDropdown(false);
                            }}
                          >
                            {ft}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Final Version Radio Options */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark small d-block">Is it a final Version?</label>
                  <div className="d-flex align-items-center gap-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="finalVersion"
                        id="finalYes"
                        checked={isFinalVersion === 'Yes'}
                        onChange={() => setIsFinalVersion('Yes')}
                      />
                      <label className="form-check-label small text-dark" htmlFor="finalYes">Yes</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="finalVersion"
                        id="finalNo"
                        checked={isFinalVersion === 'No'}
                        onChange={() => setIsFinalVersion('No')}
                      />
                      <label className="form-check-label small text-dark" htmlFor="finalNo">No</label>
                    </div>
                  </div>
                </div>

                {/* Large Dashed Drop Area with Active Drag Feedback */}
                <label className="w-100">
                  <div
                    className={`border border-2 border-dashed rounded-3 p-4 text-center cursor-pointer transition-all d-flex flex-column align-items-center justify-content-center ${isDragOverFiles ? 'bg-primary-subtle border-primary shadow' : 'bg-light border-secondary-subtle'}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOverFiles(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragOverFiles(false); }}
                    onDrop={handleFilesDrop}
                    style={{ minHeight: '220px', transition: 'all 0.2s ease' }}
                  >
                    <FileUp size={44} color="#4868DD" className="mb-2" />
                    <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '15px' }}>
                      {isDragOverFiles ? 'Drop your Files Here!' : 'Drag & drop your Files here'}
                    </h6>
                    <p className="text-muted small mb-0">Upload, comment, review (PDF, Excel, Word)</p>
                  </div>
                  <input type="file" className="d-none" onChange={handleFileUpload} />
                </label>
              </div>
            </div>

            {/* FILE VERSION HISTORY MODAL */}
            {historyModalFile && (
              <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center" style={{ zIndex: 110000 }}>
                <div className="bg-white rounded-3 p-4 shadow-lg" style={{ width: '500px', maxWidth: '90vw' }}>
                  <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-3">
                    <h6 className="m-0 fw-bold text-dark d-flex align-items-center gap-2">
                      <Clock size={18} color="#4868DD" /> Version History: {historyModalFile.name}
                    </h6>
                    <button type="button" className="btn-close" onClick={() => setHistoryModalFile(null)}></button>
                  </div>
                  <div className="d-flex flex-column gap-3 mb-4">
                    <div className="p-2 bg-light rounded border">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-primary">v2.0 (Current Final)</span>
                        <span className="text-muted small">{historyModalFile.date}</span>
                      </div>
                      <div className="fw-semibold text-dark mt-1">Uploaded by You</div>
                      <p className="m-0 small text-muted">Final client review edits applied. Size: {historyModalFile.size}</p>
                    </div>
                    <div className="p-2 bg-white rounded border">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-secondary">v1.5</span>
                        <span className="text-muted small">Oct 28, 2021, 3:15 PM</span>
                      </div>
                      <div className="fw-semibold text-dark mt-1">Uploaded by Claire Bure</div>
                      <p className="m-0 small text-muted">Internal revision draft with budget line item updates.</p>
                    </div>
                    <div className="p-2 bg-white rounded border">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-secondary">v1.0</span>
                        <span className="text-muted small">Oct 20, 2021, 10:00 AM</span>
                      </div>
                      <div className="fw-semibold text-dark mt-1">Uploaded by Sarah Smith</div>
                      <p className="m-0 small text-muted">Initial document submission.</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <button type="button" className="btn btn-secondary btn-sm px-4" onClick={() => setHistoryModalFile(null)}>
                      Close History
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: ACTIVE LOG TAB */}
        {/* ============================================================ */}
        {activeTab === 'LOG' && (
          <div className="tab_content">
            {/* Filter Log Controls & Refresh / Export */}
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div className="d-flex align-items-center gap-2">
                {/* Filter Log Button */}
                <div className="position-relative">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                    onClick={() => setShowLogFilterPopover(!showLogFilterPopover)}
                  >
                    <Filter size={14} />
                    <span>Filter Log</span>
                  </button>

                  {/* Filter Log Popover */}
                  {showLogFilterPopover && (
                    <div
                      className="position-absolute start-0 top-100 mt-2 bg-white border rounded-3 shadow-lg p-3"
                      style={{ width: '280px', zIndex: 1080 }}
                    >
                      <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                        <span className="fw-bold small text-dark">Filter Log (Showing 6 activity)</span>
                        <span
                          className="text-primary small cursor-pointer"
                          onClick={() => setShowLogFilterPopover(false)}
                        >
                          Clear
                        </span>
                      </div>
                      <div className="mb-2">
                        <label className="small text-muted fw-semibold">Time</label>
                        <select className="form-select form-select-sm mt-1">
                          <option>This year</option>
                          <option>This month</option>
                          <option>This week</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="small text-muted fw-semibold">Group</label>
                        <select className="form-select form-select-sm mt-1">
                          <option>Research</option>
                          <option>Wireframe</option>
                          <option>Visual Design</option>
                        </select>
                      </div>
                      <button
                        className="btn btn-sm btn-primary w-100"
                        onClick={() => setShowLogFilterPopover(false)}
                      >
                        Apply Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Person Filter Button */}
                <div className="position-relative">
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedPersonFilter ? 'btn-primary' : 'btn-outline-secondary'} d-flex align-items-center gap-1`}
                    onClick={() => setShowPersonFilterPopover(!showPersonFilterPopover)}
                  >
                    <User size={14} />
                    <span>{selectedPersonFilter ? selectedPersonFilter.name : 'Person'}</span>
                  </button>

                  {/* Person Filter Popover */}
                  {showPersonFilterPopover && (
                    <div
                      className="position-absolute start-0 top-100 mt-2 bg-white border rounded-3 shadow-lg p-2"
                      style={{ width: '240px', zIndex: 1080 }}
                    >
                      <div className="p-1">
                        <input
                          type="text"
                          className="form-control form-control-sm mb-2"
                          placeholder="Quick Person Filter..."
                        />
                        {availableMembers.map((m, idx) => (
                          <div
                            key={idx}
                            className="d-flex align-items-center gap-2 p-2 hover-bg-light rounded cursor-pointer"
                            onClick={() => {
                              setSelectedPersonFilter(m);
                              setShowPersonFilterPopover(false);
                            }}
                          >
                            <img
                              src={m.avatarUrl}
                              alt={m.name}
                              className="rounded-circle"
                              style={{ width: '24px', height: '24px' }}
                            />
                            <span className="small text-dark fw-semibold">{m.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Refresh & Export Icons */}
              <div className="d-flex align-items-center gap-3">
                <button type="button" className="btn btn-sm btn-light border p-2 rounded-circle" title="Refresh Log">
                  <RefreshCw size={14} className="text-secondary" />
                </button>
                <button type="button" className="btn btn-sm btn-light border p-2 rounded-circle" title="Export Log">
                  <Download size={14} className="text-secondary" />
                </button>
              </div>
            </div>

            {/* Activity Rows */}
            <div className="bg-white border rounded-3 overflow-hidden shadow-sm">
              {activityLogs.map((log) => (
                <div key={log.id} className="d-flex align-items-center justify-content-between p-3 border-bottom text-dark small">
                  <div className="d-flex align-items-center gap-2" style={{ width: '80px' }}>
                    <Clock size={14} className="text-muted" />
                    <span className="text-muted fw-semibold">{log.time}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2" style={{ width: '140px' }}>
                    <span className="badge bg-primary rounded-circle p-1" style={{ width: '20px', height: '20px' }}>
                      {log.user[0]}
                    </span>
                    <span className="fw-semibold">{log.project}</span>
                  </div>
                  <div className="text-secondary" style={{ width: '100px' }}>
                    {log.type}
                  </div>
                  <div className="flex-grow-1 text-end">
                    {log.pill ? (
                      <span
                        className="badge px-3 py-1 fw-semibold"
                        style={{ backgroundColor: '#BCE7BF', color: '#166534', borderRadius: '12px' }}
                      >
                        {log.detail}
                      </span>
                    ) : (
                      <span className="badge bg-light text-dark border px-2 py-1">{log.detail}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: DETAILS / PROJECT INFORMATION TAB */}
        {/* ============================================================ */}
        {activeTab === 'DETAILS' && (
          <div className="tab_content">
            <form onSubmit={handleSaveDetails}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Group Category</label>
                  <input
                    type="text"
                    className="form-control"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Created Date</label>
                  <input
                    type="text"
                    className="form-control"
                    value={createdDate}
                    onChange={(e) => setCreatedDate(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Start Date</label>
                  <input
                    type="text"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">End Date</label>
                  <input
                    type="text"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Estimated Hours</label>
                  <input
                    type="text"
                    className="form-control"
                    value={estHours}
                    onChange={(e) => setEstHours(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Status</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="On Track">On Track</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Approved">Approved</option>
                    <option value="Planned">Planned</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Stuck">Stuck</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Budget / Cost</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                  />
                </div>

                {/* Assignees Selection */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small d-block">Project Assignees</label>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {assignees.map((a, idx) => (
                      <img
                        key={idx}
                        src={a.avatarUrl || '/img/client1.jpg'}
                        alt={a.name}
                        className="rounded-circle border"
                        style={{ width: '36px', height: '36px', objectFit: 'cover', cursor: 'pointer' }}
                        title={`View ${a.name} profile`}
                        onClick={() => setSelectedLeadProfile({ name: a.name, type: 'Project Assignee' })}
                        onError={(e) => { e.target.src = '/icons/avatar1.svg'; }}
                      />
                    ))}
                    <button
                      type="button"
                      className="btn btn-light border rounded-circle p-0 d-flex align-items-center justify-content-center"
                      style={{ width: '36px', height: '36px' }}
                      onClick={() => setShowAssigneeSearch(!showAssigneeSearch)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-4 mt-4 border-top d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary px-4 text-uppercase" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary px-4 text-uppercase" style={{ backgroundColor: '#4868DD' }}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* LEAD PROFILE MODAL */}
      {selectedLeadProfile && (
        <LeadProfileModal
          leadName={selectedLeadProfile.name}
          leadType={selectedLeadProfile.type}
          onClose={() => setSelectedLeadProfile(null)}
        />
      )}
    </>
  );
};
