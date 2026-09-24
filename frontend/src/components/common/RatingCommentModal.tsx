import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const RatingCommentModal = ({
  open,
  onClose,
  parameterName = '',
  initialComment = '',
  onSaveComment,
}) => {
  const [commentText, setCommentText] = useState(initialComment);

  useEffect(() => {
    setCommentText(initialComment || '');
  }, [initialComment, open]);

  const handleSave = () => {
    onSaveComment(commentText);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
            }}
          >
            <ChatBubbleOutlineIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', lineHeight: 1.2 }}>
              Optional Feedback & Comments
            </Typography>
            <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 600 }}>
              {parameterName}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, backgroundColor: '#f8fafc' }}>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 1.5, fontSize: '13px' }}>
          Provide any specific observations or comments for this parameter (optional):
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Enter your observations or comments for this evaluation item..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          sx={{
            backgroundColor: '#ffffff',
            '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '13px' },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0', justifyContent: 'space-between' }}>
        <Button onClick={onClose} sx={{ color: '#64748b', fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<CheckCircleIcon fontSize="small" />}
          sx={{
            backgroundColor: '#2563eb',
            '&:hover': { backgroundColor: '#1d4ed8' },
            fontWeight: 700,
            fontSize: '13px',
            borderRadius: '8px',
            px: 3,
          }}
        >
          Save Feedback
        </Button>
      </DialogActions>
    </Dialog>
  );
};
