import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { getStatusForColumn, KANBAN_COLUMNS } from './kanbanAdapter';

export const KanbanQuickCreateModal = ({
  columnId = 'TO_DO',
  onClose,
  onCreateTask,
}) => {
  const colObj = KANBAN_COLUMNS.find((c) => c.id === columnId) || KANBAN_COLUMNS[1];

  const [title, setTitle] = useState('');
  const [group, setGroup] = useState('Research');
  const [priority, setPriority] = useState('Medium');
  const [type, setType] = useState('Construction Phase');
  const [plannedBudget, setPlannedBudget] = useState('AED 150K');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      _id: `task-${Date.now()}`,
      title,
      group,
      status: getStatusForColumn(columnId),
      priority,
      type,
      plannedBudget,
      actualBudget: 'AED 0',
      description: description || 'Real-estate development task created via Kanban board.',
      plannedDate: 'Nov 01 - Dec 30',
      actualDate: 'Nov 01, 2026',
      progress: 0,
      assignees: [
        { _id: 'u1', name: 'Claire Bure', email: 'Clair@emaar.com', avatarUrl: '/img/client1.jpg' },
      ],
    };

    onCreateTask(newTask);
    onClose();
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 0.5 },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AddTaskIcon color="primary" fontSize="small" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.2 }}>
              Add Task to {colObj.title}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Create a new real-estate task item
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 2.5 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Title *"
                placeholder="e.g. Tower 01 Facade Structural Approval..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
                size="small"
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priority}
                  label="Priority"
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Task Type</InputLabel>
                <Select
                  value={type}
                  label="Task Type"
                  onChange={(e) => setType(e.target.value)}
                >
                  <MenuItem value="Design & Architecture">Design & Architecture</MenuItem>
                  <MenuItem value="Construction Phase">Construction Phase</MenuItem>
                  <MenuItem value="Procurement Package">Procurement Package</MenuItem>
                  <MenuItem value="Authority Approval">Authority Approval</MenuItem>
                  <MenuItem value="Site Inspection">Site Inspection</MenuItem>
                  <MenuItem value="MEP Coordination">MEP Coordination</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Group Category</InputLabel>
                <Select
                  value={group}
                  label="Group Category"
                  onChange={(e) => setGroup(e.target.value)}
                >
                  <MenuItem value="Research">Research</MenuItem>
                  <MenuItem value="Wireframe">Wireframe</MenuItem>
                  <MenuItem value="Visual Studio">Visual Studio</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="Planned Budget"
                placeholder="e.g. AED 250K"
                value={plannedBudget}
                onChange={(e) => setPlannedBudget(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                placeholder="Task scope, specification or notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, borderTop: '1px solid #e2e8f0', pt: 1.5 }}>
          <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 700, px: 3 }}>
            Create Task
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
