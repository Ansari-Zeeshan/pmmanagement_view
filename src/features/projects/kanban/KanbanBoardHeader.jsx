import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  AvatarGroup,
  Avatar,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Grid,
  Badge,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShareIcon from '@mui/icons-material/Share';
import SyncIcon from '@mui/icons-material/Sync';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { mapStatusToColumnId } from './kanbanAdapter';

export const KanbanBoardHeader = ({
  title = 'Tasks',
  subtitle = 'Organize projects and collaborate with your team',
  lastUpdated = 'Just now',
  tasks = [],
  activeStatusFilter = 'ALL',
  onSelectStatusFilter,
  assignees = [
    { name: 'Claire Bure', avatarUrl: '/img/client1.jpg' },
    { name: 'Ajmal Khan', avatarUrl: '/img/client2.jpg' },
    { name: 'Sarah Smith', avatarUrl: '/img/client3.jpg' },
  ],
  onShare,
}) => {
  const [expanded, setExpanded] = useState(true);

  // Calculate KPI stats
  const totalCount = tasks.length;
  const backlogCount = tasks.filter((t) => mapStatusToColumnId(t.status) === 'BACKLOG').length;
  const todoCount = tasks.filter((t) => mapStatusToColumnId(t.status) === 'TO_DO').length;
  const inProgressCount = tasks.filter((t) => mapStatusToColumnId(t.status) === 'IN_PROGRESS').length;
  const reviewCount = tasks.filter((t) => mapStatusToColumnId(t.status) === 'REVIEW').length;
  const doneCount = tasks.filter((t) => mapStatusToColumnId(t.status) === 'DONE').length;

  const kpis = [
    { id: 'ALL', label: 'Total Tasks', count: totalCount, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
    { id: 'BACKLOG', label: 'Backlog', count: backlogCount, color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' },
    { id: 'TO_DO', label: 'To Do', count: todoCount, color: '#3b82f6', bg: '#f0f9ff', border: '#bae6fd' },
    { id: 'IN_PROGRESS', label: 'In Progress', count: inProgressCount, color: '#0284c7', bg: '#f0fdf4', border: '#bbf7d0' },
    { id: 'REVIEW', label: 'In Review', count: reviewCount, color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
    { id: 'DONE', label: 'Completed', count: doneCount, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {/* Top Header Row */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.5rem' }}>
              {title}
            </Typography>
            <Chip
              label="EMAAR Enterprise"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: '0.8125rem', height: 26 }}
            />
            <Chip
              icon={<SyncIcon sx={{ fontSize: '14px !important', color: '#16a34a !important' }} />}
              label="Live Sync"
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                height: 26,
                backgroundColor: '#f0fdf4',
                color: '#16a34a',
                borderColor: '#bbf7d0',
                border: '1px solid',
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9375rem' }}>
            {subtitle} • <span style={{ color: '#94a3b8' }}>Last updated {lastUpdated}</span>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Avatar Group */}
          <Tooltip title="Team members collaborating on this board">
            <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 34, height: 34, fontSize: 13 } }}>
              {assignees.map((user, idx) => (
                <Avatar key={idx} alt={user.name} src={user.avatarUrl} />
              ))}
            </AvatarGroup>
          </Tooltip>

          {/* Share Button */}
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ShareIcon fontSize="small" />}
            onClick={onShare}
            sx={{
              borderColor: '#cbd5e1',
              color: '#334155',
              fontWeight: 600,
              fontSize: '0.875rem',
              px: 2.2,
              py: 0.85,
            }}
          >
            Share Board
          </Button>
        </Box>
      </Box>

      {/* MUI Accordion for Executive KPI Summary Cards */}
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        elevation={0}
        sx={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px !important',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
          sx={{
            backgroundColor: '#f8fafc',
            px: 2.5,
            py: 0.5,
            minHeight: '48px',
            '& .MuiAccordionSummary-content': { margin: '8px 0' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AssessmentIcon color="primary" fontSize="small" />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
              Executive KPI Summary
            </Typography>
            <Chip
              label={`${totalCount} Tasks`}
              size="small"
              color="primary"
              sx={{ fontWeight: 700, height: 22, fontSize: '0.8125rem' }}
            />
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
          <Grid container spacing={2}>
            {kpis.map((kpi) => {
              const isActive = activeStatusFilter === kpi.id;
              return (
                <Grid item xs={6} sm={4} md={2} key={kpi.id}>
                  <Card
                    elevation={isActive ? 2 : 0}
                    onClick={() => onSelectStatusFilter && onSelectStatusFilter(kpi.id)}
                    sx={{
                      backgroundColor: kpi.bg,
                      borderColor: isActive ? kpi.color : kpi.border,
                      borderWidth: isActive ? 2 : 1,
                      borderStyle: 'solid',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(15, 23, 42, 0.08)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: '14px 16px !important' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            color: kpi.color,
                            fontSize: '0.84rem',
                            textTransform: 'uppercase',
                          }}
                        >
                          {kpi.label}
                        </Typography>
                        <Chip
                          label={kpi.count}
                          size="small"
                          sx={{
                            backgroundColor: kpi.color,
                            color: '#ffffff',
                            fontWeight: 700,
                            height: 22,
                            fontSize: '0.8125rem',
                            '& .MuiChip-label': { px: 1 },
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.5rem', lineHeight: 1 }}>
                          {kpi.count}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.84rem' }}>
                          {totalCount > 0 ? `${Math.round((kpi.count / totalCount) * 100)}%` : '0%'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </AccordionDetails>
      </Accordion>`
    </Box>
  );
};
