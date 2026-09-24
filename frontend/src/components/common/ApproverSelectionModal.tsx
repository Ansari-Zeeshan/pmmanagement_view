import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Checkbox,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Badge,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { APPROVERS_DIRECTORY, DEPARTMENTS } from '../../data/approversDirectory';

export const ApproverSelectionModal = ({
  open,
  onClose,
  existingApprovers = [],
  onAddApprovers,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedIds, setSelectedIds] = useState([]);

  // Existing approver IDs set for fast lookup
  const existingIdsSet = useMemo(() => {
    return new Set(existingApprovers.map((item) => String(item.id || item.email)));
  }, [existingApprovers]);

  // Filter directory items based on search query & department
  const filteredDirectory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return APPROVERS_DIRECTORY.filter((user) => {
      const matchesDept = selectedDept === 'All Departments' || user.department === selectedDept;
      if (!matchesDept) return false;

      if (!query) return true;
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, selectedDept]);

  // Handle individual toggle
  const handleToggleSelect = (userId) => {
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Handle select all filtered (excluding already added)
  const handleSelectAllFiltered = () => {
    const availableFilteredIds = filteredDirectory
      .filter((u) => !existingIdsSet.has(u.id) && !existingIdsSet.has(u.email))
      .map((u) => u.id);

    const allSelected = availableFilteredIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !availableFilteredIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...availableFilteredIds])));
    }
  };

  // Handle confirm submit
  const handleConfirmAdd = () => {
    const selectedUsers = APPROVERS_DIRECTORY.filter((u) => selectedIds.includes(u.id));
    onAddApprovers(selectedUsers);
    setSelectedIds([]);
    setSearchQuery('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
            }}
          >
            <PersonAddIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.25rem', lineHeight: 1.2 }}>
              Add Approvers / Members
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px' }}>
              Select from company directory of {APPROVERS_DIRECTORY.length}+ employees
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748b', '&:hover': { color: '#0f172a', backgroundColor: '#f1f5f9' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content Container */}
      <DialogContent sx={{ p: 3, backgroundColor: '#f8fafc', overflowY: 'auto' }}>
        {/* Search Bar & Stats */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            placeholder="Search by name, email, department or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#64748b' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                fontSize: '14px',
              },
            }}
          />
        </Box>

        {/* Department Filter Chips */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mb: 2.5,
            overflowX: 'auto',
            pb: 0.5,
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: 2 },
          }}
        >
          {DEPARTMENTS.map((dept) => {
            const isSelected = selectedDept === dept;
            return (
              <Chip
                key={dept}
                label={dept}
                clickable
                onClick={() => setSelectedDept(dept)}
                sx={{
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '12.5px',
                  backgroundColor: isSelected ? '#2563eb' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#475569',
                  border: isSelected ? '1px solid #2563eb' : '1px solid #cbd5e1',
                  '&:hover': {
                    backgroundColor: isSelected ? '#1d4ed8' : '#f1f5f9',
                  },
                }}
              />
            );
          })}
        </Box>

        {/* Action Controls Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, px: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569', fontSize: '13px' }}>
            Showing <span style={{ color: '#2563eb', fontWeight: 700 }}>{filteredDirectory.length}</span> candidates
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              onClick={handleSelectAllFiltered}
              sx={{ fontSize: '12px', textTransform: 'none', fontWeight: 600, color: '#2563eb' }}
            >
              Toggle Select Filtered
            </Button>
            {selectedIds.length > 0 && (
              <Button
                size="small"
                onClick={() => setSelectedIds([])}
                sx={{ fontSize: '12px', textTransform: 'none', fontWeight: 600, color: '#dc2626' }}
              >
                Clear Selected ({selectedIds.length})
              </Button>
            )}
          </Box>
        </Box>

        {/* Directory User List */}
        <Paper
          variant="outlined"
          sx={{
            borderRadius: '12px',
            borderColor: '#e2e8f0',
            backgroundColor: '#ffffff',
            maxHeight: 380,
            overflowY: 'auto',
          }}
        >
          {filteredDirectory.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <FilterListIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#475569' }}>
                No approvers found
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Try adjusting your search query or department filter
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {filteredDirectory.map((user, idx) => {
                const isAlreadyAdded = existingIdsSet.has(user.id) || existingIdsSet.has(user.email);
                const isChecked = selectedIds.includes(user.id);

                return (
                  <React.Fragment key={user.id}>
                    <ListItem
                      onClick={() => !isAlreadyAdded && handleToggleSelect(user.id)}
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        backgroundColor: isChecked ? '#eff6ff' : isAlreadyAdded ? '#f8fafc' : '#ffffff',
                        opacity: isAlreadyAdded ? 0.65 : 1,
                        '&:hover': {
                          backgroundColor: isAlreadyAdded ? '#f8fafc' : isChecked ? '#dbeafe' : '#f8fafc',
                        },
                      }}
                    >
                      <Checkbox
                        checked={isChecked || isAlreadyAdded}
                        disabled={isAlreadyAdded}
                        sx={{
                          color: '#cbd5e1',
                          '&.Mui-checked': { color: isAlreadyAdded ? '#94a3b8' : '#2563eb' },
                          mr: 1,
                        }}
                      />
                      <ListItemAvatar>
                        <Avatar
                          src={user.avatar}
                          alt={user.name}
                          sx={{
                            width: 42,
                            height: 42,
                            bgcolor: '#2563eb',
                            fontSize: '14px',
                            fontWeight: 700,
                          }}
                        >
                          {user.name.split(' ').map((n) => n[0]).join('')}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                              {user.name}
                            </Typography>
                            <Chip
                              label={user.department}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '11px',
                                fontWeight: 600,
                                backgroundColor: '#f1f5f9',
                                color: '#475569',
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.3 }}>
                            <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 600, fontSize: '12px' }}>
                              {user.role}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '11.5px' }}>
                              {user.email}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction sx={{ right: 20 }}>
                        {isAlreadyAdded ? (
                          <Chip
                            label="Already Added"
                            size="small"
                            sx={{
                              height: 24,
                              fontSize: '11px',
                              fontWeight: 600,
                              backgroundColor: '#e2e8f0',
                              color: '#64748b',
                            }}
                          />
                        ) : isChecked ? (
                          <Chip
                            label="Selected"
                            size="small"
                            color="primary"
                            icon={<CheckCircleIcon style={{ fontSize: 14 }} />}
                            sx={{ height: 24, fontSize: '11px', fontWeight: 700, backgroundColor: '#2563eb' }}
                          />
                        ) : null}
                      </ListItemSecondaryAction>
                    </ListItem>
                    {idx < filteredDirectory.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </Paper>
      </DialogContent>

      {/* Dialog Footer Actions */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569', fontSize: '13.5px' }}>
          {selectedIds.length > 0 ? (
            <span>
              Selected <strong style={{ color: '#2563eb' }}>{selectedIds.length}</strong> new approver(s)
            </span>
          ) : (
            <span>No new approvers selected</span>
          )}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: '#cbd5e1',
              color: '#64748b',
              fontWeight: 600,
              fontSize: '13px',
              borderRadius: '8px',
              px: 2.5,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={selectedIds.length === 0}
            onClick={handleConfirmAdd}
            startIcon={<CheckCircleIcon fontSize="small" />}
            sx={{
              backgroundColor: '#2563eb',
              '&:hover': { backgroundColor: '#1d4ed8' },
              fontWeight: 700,
              fontSize: '13px',
              borderRadius: '8px',
              px: 3.5,
              boxShadow: selectedIds.length > 0 ? '0 4px 14px rgba(37, 99, 235, 0.3)' : 'none',
            }}
          >
            Add Selected ({selectedIds.length})
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
