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
  FormControlLabel,
  Switch,
  Button,
  Grid,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

export const KanbanRequestTaskModal = ({ onClose, onRequestSubmit }) => {
  const [requestTitle, setRequestTitle] = useState('');
  const [requestType, setRequestType] = useState('Authority Approval');
  const [urgent, setUrgent] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!requestTitle.trim()) return;

    const newTask = {
      _id: `task-req-${Date.now()}`,
      title: requestTitle,
      group: 'Research',
      status: 'Planned',
      priority: urgent ? 'Critical' : 'High',
      type: requestType,
      plannedBudget: 'AED 300K',
      actualBudget: 'AED 0',
      description: `Task Request: ${notes || requestTitle}`,
      plannedDate: 'Dec 01 - Dec 31',
      actualDate: 'Dec 01, 2026',
      progress: 0,
      assignees: [
        { _id: 'u1', name: 'Claire Bure', email: 'Clair@emaar.com', avatarUrl: '/img/client1.jpg' },
      ],
    };

    onRequestSubmit(newTask);
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
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'primary.main',
          color: '#ffffff',
          borderRadius: '10px 10px 0 0',
          py: 2,
          px: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AssignmentTurnedInIcon sx={{ color: '#ffffff' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2, color: '#ffffff' }}>
              Request New Real-Estate Task
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Submit a work order or approval request
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: '#ffffff' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Request Title *"
                placeholder="e.g. Request MEP Inspection for Sector B..."
                value={requestTitle}
                onChange={(e) => setRequestTitle(e.target.value)}
                required
                autoFocus
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Task Category / Type</InputLabel>
                <Select
                  value={requestType}
                  label="Task Category / Type"
                  onChange={(e) => setRequestType(e.target.value)}
                >
                  <MenuItem value="Authority Approval">Authority Approval</MenuItem>
                  <MenuItem value="Site Inspection">Site Inspection</MenuItem>
                  <MenuItem value="MEP Coordination">MEP Coordination</MenuItem>
                  <MenuItem value="Procurement Package">Procurement Package</MenuItem>
                  <MenuItem value="Quality Audit">Quality Audit</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={urgent}
                    onChange={(e) => setUrgent(e.target.checked)}
                    color="error"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 600, color: urgent ? 'error.main' : 'text.primary' }}>
                    Mark as High Priority / Urgent
                  </Typography>
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Justification & Scope Notes"
                placeholder="Provide context for project managers..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, borderTop: '1px solid #e2e8f0', pt: 1.5 }}>
          <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 700, px: 3 }}>
            Submit Request
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
