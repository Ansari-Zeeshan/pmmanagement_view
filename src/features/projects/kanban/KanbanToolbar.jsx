import React from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Button,
  Chip,
  Stack,
  Typography,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';

export const KanbanToolbar = ({
  search = '',
  onSearchChange,
  priorityFilter = 'ALL',
  onPriorityFilterChange,
  assigneeFilter = 'ALL',
  onAssigneeFilterChange,
  sortBy = 'DEFAULT',
  onSortByChange,
  compactView = false,
  onToggleCompactView,
  onRequestTask,
  onExportCSV,
  onClearFilters,
}) => {
  const isFiltered = search || priorityFilter !== 'ALL' || assigneeFilter !== 'ALL' || sortBy !== 'DEFAULT';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        border: '1px solid #e2e8f0',
        borderRadius: 3,
        backgroundColor: '#ffffff',
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        {/* Left Side: Search & Filter Controls */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
          {/* Search TextField */}
          <TextField
            size="small"
            placeholder="Search tasks, properties..."
            value={search}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 260, '& .MuiOutlinedInput-root': { height: 38 } }}
          />

          {/* Priority Select */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange && onPriorityFilterChange(e.target.value)}
              displayEmpty
              sx={{ height: 38, fontWeight: 600, color: priorityFilter !== 'ALL' ? 'primary.main' : 'text.primary' }}
            >
              <MenuItem value="ALL">All Priorities</MenuItem>
              <MenuItem value="CRITICAL">🔴 Critical</MenuItem>
              <MenuItem value="HIGH">🟠 High</MenuItem>
              <MenuItem value="MEDIUM">🔵 Medium</MenuItem>
              <MenuItem value="LOW">🟢 Low</MenuItem>
            </Select>
          </FormControl>

          {/* Assignee Select */}
          <FormControl size="small" sx={{ minWidth: 145 }}>
            <Select
              value={assigneeFilter}
              onChange={(e) => onAssigneeFilterChange && onAssigneeFilterChange(e.target.value)}
              displayEmpty
              sx={{ height: 38, fontWeight: 600, color: assigneeFilter !== 'ALL' ? 'primary.main' : 'text.primary' }}
            >
              <MenuItem value="ALL">All Assignees</MenuItem>
              <MenuItem value="Claire Bure">Claire Bure</MenuItem>
              <MenuItem value="Ajmal Khan">Ajmal Khan</MenuItem>
              <MenuItem value="Sarah Smith">Sarah Smith</MenuItem>
            </Select>
          </FormControl>

          {/* Sort By Select */}
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={sortBy}
              onChange={(e) => onSortByChange && onSortByChange(e.target.value)}
              displayEmpty
              sx={{ height: 38, fontWeight: 600, color: sortBy !== 'DEFAULT' ? 'primary.main' : 'text.primary' }}
            >
              <MenuItem value="DEFAULT">Sort: Default</MenuItem>
              <MenuItem value="PRIORITY">Sort: Priority (High → Low)</MenuItem>
              <MenuItem value="DUE_DATE">Sort: Due Date (Earliest)</MenuItem>
              <MenuItem value="PROGRESS">Sort: Progress %</MenuItem>
              <MenuItem value="TITLE">Sort: Title (A-Z)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Right Side Action Buttons */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {/* View Density Toggle */}
          <Tooltip title={compactView ? 'Switch to Detailed View' : 'Switch to Compact View'}>
            <Button
              variant={compactView ? 'contained' : 'outlined'}
              color="primary"
              size="small"
              onClick={onToggleCompactView}
              startIcon={compactView ? <ViewAgendaIcon fontSize="small" /> : <ViewModuleIcon fontSize="small" />}
              sx={{ height: 38, px: 1.8, fontSize: '0.875rem', fontWeight: 600, borderColor: '#cbd5e1', color: compactView ? '#ffffff' : '#334155' }}
            >
              {compactView ? 'Compact' : 'Detailed'}
            </Button>
          </Tooltip>

          {/* Export CSV Button */}
          <Tooltip title="Export Kanban tasks to CSV spreadsheet">
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={onExportCSV}
              startIcon={<DownloadIcon fontSize="small" />}
              sx={{ height: 38, px: 2, fontSize: '0.875rem', borderColor: '#cbd5e1', color: '#334155', fontWeight: 600 }}
            >
              Export
            </Button>
          </Tooltip>

          {/* Request Task CTA */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={onRequestTask}
            startIcon={<AddIcon fontSize="small" />}
            sx={{
              height: 38,
              px: 2.5,
              fontSize: '0.875rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            }}
          >
            Request Task
          </Button>
        </Stack>
      </Box>

      {/* Active Filter Chips Bar */}
      {isFiltered && (
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mt: 2, pt: 1.5, borderTop: '1px solid #f1f5f9' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.84rem' }}>
            Active Filters:
          </Typography>
          {search && (
            <Chip
              label={`Search: "${search}"`}
              size="small"
              color="primary"
              variant="outlined"
              onDelete={() => onSearchChange('')}
              sx={{ height: 26, fontSize: '0.8125rem', fontWeight: 600 }}
            />
          )}
          {priorityFilter !== 'ALL' && (
            <Chip
              label={`Priority: ${priorityFilter}`}
              size="small"
              color="warning"
              variant="outlined"
              onDelete={() => onPriorityFilterChange('ALL')}
              sx={{ height: 26, fontSize: '0.8125rem', fontWeight: 600 }}
            />
          )}
          {assigneeFilter !== 'ALL' && (
            <Chip
              label={`Assignee: ${assigneeFilter}`}
              size="small"
              color="info"
              variant="outlined"
              onDelete={() => onAssigneeFilterChange('ALL')}
              sx={{ height: 26, fontSize: '0.8125rem', fontWeight: 600 }}
            />
          )}
          {sortBy !== 'DEFAULT' && (
            <Chip
              label={`Sort: ${sortBy}`}
              size="small"
              color="secondary"
              variant="outlined"
              onDelete={() => onSortByChange('DEFAULT')}
              sx={{ height: 26, fontSize: '0.8125rem', fontWeight: 600 }}
            />
          )}
          <Button
            size="small"
            color="error"
            startIcon={<FilterListOffIcon fontSize="small" />}
            onClick={onClearFilters}
            sx={{ ml: 'auto !important', fontWeight: 600, fontSize: '0.84rem', p: 0.5 }}
          >
            Reset All
          </Button>
        </Stack>
      )}
    </Paper>
  );
};
