import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import {
  Paper,
  Box,
  Typography,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import { KanbanCard } from './KanbanCard';
import { calculateColumnBudgetSummary } from './kanbanAdapter';

export const KanbanColumn = ({
  column,
  tasks = [],
  onCardClick,
  onQuickCreate,
  onMoveStatus,
  compactView = false,
}) => {
  const budgetSummary = calculateColumnBudgetSummary(tasks);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Average progress calculation for column tasks
  const avgProgress = React.useMemo(() => {
    if (!tasks || tasks.length === 0) return 0;
    const sum = tasks.reduce((acc, t) => acc + (t.progress !== undefined ? t.progress : 50), 0);
    return Math.round(sum / tasks.length);
  }, [tasks]);

  const columnColors = {
    BACKLOG: { topBorder: '#94a3b8', dot: '#94a3b8', bg: '#fafcfd', border: '#e2e8f0' },
    TO_DO: { topBorder: '#2563eb', dot: '#2563eb', bg: '#f5f8ff', border: '#e0ebff' },
    IN_PROGRESS: { topBorder: '#0284c7', dot: '#0284c7', bg: '#f3faff', border: '#e0f2fe' },
    REVIEW: { topBorder: '#d97706', dot: '#d97706', bg: '#fffdf5', border: '#fef3c7' },
    DONE: { topBorder: '#16a34a', dot: '#16a34a', bg: '#f4fdf7', border: '#dcfce7' },
  };

  const colStyle = columnColors[column.id] || columnColors.TO_DO;

  return (
    <Paper
      elevation={0}
      sx={{
        flex: '0 0 320px',
        maxWidth: 320,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 230px)',
        backgroundColor: colStyle.bg,
        border: `1px solid ${colStyle.border}`,
        borderTop: `4px solid ${colStyle.topBorder}`,
        transition: 'all 0.2s ease',
      }}
    >
      {/* Column Header */}
      <Box sx={{ p: 2, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: colStyle.dot,
            }}
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
            {column.title}
          </Typography>
          <Chip
            label={tasks.length}
            size="small"
            sx={{
              height: 22,
              fontSize: '0.8125rem',
              fontWeight: 700,
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid rgba(203, 213, 225, 0.8)',
              '& .MuiChip-label': { px: 0.9 },
            }}
          />
        </Box>

        <Box>
          <IconButton size="small" onClick={handleOpenMenu} sx={{ color: 'text.secondary' }}>
            <MoreHorizIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            PaperProps={{
              sx: { borderRadius: 2, minWidth: 170, boxShadow: '0 10px 25px rgba(15,23,42,0.1)' },
            }}
          >
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                onQuickCreate && onQuickCreate(column.id);
              }}
              sx={{ fontSize: '0.875rem', fontWeight: 600 }}
            >
              + Add Task to {column.title}
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Column Progress Bar */}
      <Box sx={{ px: 2, mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>
            Avg Progress
          </Typography>
          <Typography variant="caption" sx={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 700 }}>
            {avgProgress}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={avgProgress}
          sx={{
            height: 5,
            borderRadius: 2.5,
            backgroundColor: '#cbd5e1',
            '& .MuiLinearProgress-bar': {
              borderRadius: 2.5,
              backgroundColor: colStyle.dot,
            },
          }}
        />
      </Box>

      {/* Financial Budget Tally Summary */}
      <Typography variant="caption" sx={{ px: 2, mb: 1, fontWeight: 600, color: 'text.secondary', fontSize: '0.84rem' }}>
        {budgetSummary}
      </Typography>

      {/* Droppable Card Stack */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              px: 1.5,
              py: 1,
              overflowY: 'auto',
              flexGrow: 1,
              minHeight: 180,
              backgroundColor: snapshot.isDraggingOver ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
              borderRadius: 2,
              transition: 'background-color 0.2s ease',
            }}
          >
            {tasks.map((task, index) => (
              <KanbanCard
                key={task._id}
                task={task}
                index={index}
                onClick={onCardClick}
                onMoveStatus={onMoveStatus}
                compactView={compactView}
              />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>

      {/* Bottom Add Task Button */}
      <Box sx={{ p: 1.5, pt: 0.5 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddIcon fontSize="small" />}
          onClick={() => onQuickCreate && onQuickCreate(column.id)}
          sx={{
            borderStyle: 'dashed',
            borderColor: '#cbd5e1',
            color: '#475569',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            py: 0.9,
            fontWeight: 600,
            fontSize: '0.875rem',
            '&:hover': {
              backgroundColor: '#ffffff',
              borderColor: '#2563eb',
              color: '#2563eb',
            },
          }}
        >
          Add task
        </Button>
      </Box>
    </Paper>
  );
};
