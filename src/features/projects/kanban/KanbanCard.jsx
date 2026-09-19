import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  AvatarGroup,
  LinearProgress,
  Tooltip,
  IconButton,
  Box,
  Stack,
  Divider,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { formatTaskMetadata } from './kanbanAdapter';

export const KanbanCard = ({
  task,
  index,
  onClick,
  onMoveStatus,
  compactView = false,
}) => {
  const meta = formatTaskMetadata(task);

  const getPriorityColor = (priority) => {
    switch (String(priority).toUpperCase()) {
      case 'CRITICAL':
      case 'URGENT':
        return { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', dot: '#dc2626' };
      case 'HIGH':
        return { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa', dot: '#ea580c' };
      case 'LOW':
        return { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', dot: '#16a34a' };
      default:
        return { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', dot: '#2563eb' };
    }
  };

  const priorityStyle = getPriorityColor(meta.priority);

  // Check if task due date is past today
  const isOverdue = React.useMemo(() => {
    if (!meta.dueDate) return false;
    const dueTime = new Date(meta.dueDate).getTime();
    if (isNaN(dueTime)) return false;
    return dueTime < Date.now() && meta.progressPct < 100;
  }, [meta.dueDate, meta.progressPct]);

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick && onClick(task)}
          sx={{
            mb: 1.5,
            userSelect: 'none',
            ...provided.draggableProps.style,
          }}
        >
          <Card
            elevation={snapshot.isDragging ? 8 : 0}
            sx={{
              backgroundColor: isOverdue ? '#fffafb' : '#ffffff',
              borderColor: isOverdue ? '#fca5a5' : snapshot.isDragging ? '#2563eb' : '#e2e8f0',
              borderWidth: snapshot.isDragging ? 2 : 1,
              borderStyle: 'solid',
              borderRadius: 3,
              transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: snapshot.isDragging ? 'rotate(1.2deg) scale(1.02)' : 'none',
              '&:hover': {
                borderColor: '#94a3b8',
                boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.1)',
                transform: 'translateY(-2px)',
                '& .quick-move-btn': {
                  opacity: 1,
                },
              },
            }}
          >
            <CardContent sx={{ p: compactView ? 1.5 : 2, '&:last-child': { pb: compactView ? 1.5 : 2 } }}>
              {/* Header Badges */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Chip
                  size="small"
                  label={meta.priority}
                  icon={
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: priorityStyle.dot,
                        ml: '6px !important',
                      }}
                    />
                  }
                  sx={{
                    backgroundColor: priorityStyle.bg,
                    color: priorityStyle.text,
                    border: `1px solid ${priorityStyle.border}`,
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    height: 24,
                  }}
                />

                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Chip
                    size="small"
                    label={meta.typeBadge}
                    variant="outlined"
                    sx={{
                      backgroundColor: '#f8fafc',
                      color: '#475569',
                      borderColor: '#e2e8f0',
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                      height: 24,
                    }}
                  />

                  {/* 1-Click Quick Move Button */}
                  {onMoveStatus && (
                    <Tooltip title="Move to Next Stage">
                      <IconButton
                        className="quick-move-btn"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveStatus(task._id, task.status);
                        }}
                        sx={{
                          opacity: 0,
                          transition: 'opacity 0.15s ease',
                          width: 24,
                          height: 24,
                          backgroundColor: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          '&:hover': {
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                          },
                        }}
                      >
                        <ChevronRightIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </Box>

              {/* Title */}
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  fontSize: compactView ? '0.9375rem' : '1rem',
                  lineHeight: 1.4,
                  color: 'text.primary',
                  mb: 0.75,
                  transition: 'color 0.15s ease',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {meta.title}
              </Typography>

              {/* Property Context */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1, color: '#475569' }}>
                <ApartmentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" noWrap sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#475569' }}>
                  {meta.propertyContext}
                </Typography>
              </Box>

              {/* Description Snippet (Detailed View Only) */}
              {!compactView && meta.description && (
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    mb: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.45,
                  }}
                >
                  {meta.description}
                </Typography>
              )}

              {/* Progress Bar Section */}
              <Box sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#64748b' }}>
                    {meta.progressPct}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.max(0, meta.progressPct))}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      backgroundColor: meta.progressPct === 100 ? '#16a34a' : '#2563eb',
                    },
                  }}
                />
              </Box>

              <Divider sx={{ my: 1, borderColor: '#f1f5f9' }} />

              {/* Card Footer */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 0.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: 'text.secondary', fontSize: '0.84rem' }}>
                  {/* Comment Count */}
                  <Tooltip title={`${meta.commentsCount} comments`}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ChatBubbleOutlineIcon sx={{ fontSize: 15 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.84rem' }}>
                        {meta.commentsCount}
                      </Typography>
                    </Box>
                  </Tooltip>

                  {/* Attachment Count */}
                  <Tooltip title={`${meta.attachmentsCount} attachments`}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AttachFileIcon sx={{ fontSize: 15 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.84rem' }}>
                        {meta.attachmentsCount}
                      </Typography>
                    </Box>
                  </Tooltip>

                  {/* Due Date */}
                  <Tooltip title={`Target Date: ${meta.dueDate}`}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: isOverdue ? '#dc2626' : 'text.secondary' }}>
                      {isOverdue ? <WarningAmberIcon sx={{ fontSize: 15, color: '#dc2626' }} /> : <CalendarTodayIcon sx={{ fontSize: 15 }} />}
                      <Typography variant="caption" sx={{ fontWeight: isOverdue ? 700 : 600, fontSize: '0.84rem' }}>
                        {meta.dueDate}
                      </Typography>
                    </Box>
                  </Tooltip>
                </Stack>

                {/* Avatar Group Stack */}
                <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 26, height: 26, fontSize: 11 } }}>
                  {(meta.assignees && meta.assignees.length > 0
                    ? meta.assignees
                    : [{ name: 'Claire Bure', avatarUrl: '/img/client1.jpg' }]
                  ).map((user, idx) => (
                    <Avatar key={idx} alt={user.name} src={user.avatarUrl || '/img/client1.jpg'} />
                  ))}
                </AvatarGroup>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Draggable>
  );
};
