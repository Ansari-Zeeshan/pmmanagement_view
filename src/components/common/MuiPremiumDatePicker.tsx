import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Popover,
  Typography,
  IconButton,
  Button,
  Grid,
  InputAdornment,
  Select,
  MenuItem,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const YEARS = Array.from({ length: 31 }, (_, i) => 2020 + i);

export interface MuiPremiumDatePickerProps {
  value?: any;
  onChange?: (val: any) => void;
  label?: any;
  placeholder?: string;
  error?: any;
  helperText?: any;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const MuiPremiumDatePicker: React.FC<MuiPremiumDatePickerProps> = ({
  value,
  onChange = () => {},
  label,
  placeholder = 'Select date...',
  error = false,
  helperText = '',
  required = false,
  fullWidth = true,
  disabled = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  // Parse current selected date or fallback to today
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const selectedDate = parseDate(value);
  const today = new Date();

  // Calendar View State (Month & Year)
  const [viewDate, setViewDate] = useState(() => selectedDate || new Date());

  useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate);
    }
  }, [value]);

  const handleOpen = (e) => {
    if (disabled) return;
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isOpen = Boolean(anchorEl);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleSelectDay = (dayNumber) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(dayNumber).padStart(2, '0');
    const dateString = `${currentYear}-${formattedMonth}-${formattedDay}`;
    onChange(dateString);
    handleClose();
  };

  const handleSelectToday = () => {
    const yr = today.getFullYear();
    const mo = String(today.getMonth() + 1).padStart(2, '0');
    const da = String(today.getDate()).padStart(2, '0');
    onChange(`${yr}-${mo}-${da}`);
    setViewDate(new Date());
    handleClose();
  };

  const handleClear = () => {
    onChange('');
    handleClose();
  };

  // Generate calendar grid array
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPrev: true,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday =
      today.getFullYear() === currentYear &&
      today.getMonth() === currentMonth &&
      today.getDate() === d;

    const isSelected =
      selectedDate &&
      selectedDate.getFullYear() === currentYear &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getDate() === d;

    calendarDays.push({
      day: d,
      isCurrentMonth: true,
      isToday,
      isSelected,
    });
  }

  // Next month leading days to complete 35 or 42 grid cells
  const remainingCells = (7 - (calendarDays.length % 7)) % 7;
  for (let n = 1; n <= remainingCells; n++) {
    calendarDays.push({
      day: n,
      isCurrentMonth: false,
      isNext: true,
    });
  }

  // Formatted display text for input
  const formatDisplay = (d) => {
    if (!d) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = MONTH_NAMES[d.getMonth()].slice(0, 3);
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
          {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
        </Typography>
      )}

      <TextField
        fullWidth={fullWidth}
        size="small"
        placeholder={placeholder}
        value={formatDisplay(selectedDate)}
        onClick={handleOpen}
        error={error}
        helperText={helperText}
        disabled={disabled}
        inputProps={{ readOnly: true, style: { cursor: disabled ? 'default' : 'pointer' } }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" sx={{ pointerEvents: 'none' }}>
              <CalendarTodayIcon fontSize="small" sx={{ color: '#2563eb' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: 40,
            fontSize: '13px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            cursor: disabled ? 'default' : 'pointer',
            transition: 'all 0.15s ease-in-out',
            '&:hover': {
              borderColor: '#2563eb',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.15)',
            },
          },
        }}
      />

      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            p: 2,
            mt: 1,
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
            border: '1px solid #e2e8f0',
            width: 335,
            backgroundColor: '#ffffff',
          },
        }}
      >
        {/* Calendar Header with Month & Year Selectors */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 0.5 }}>
          <IconButton size="small" onClick={handlePrevMonth} sx={{ color: '#475569', p: 0.5, '&:hover': { backgroundColor: '#f1f5f9' } }}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            {/* Month Select */}
            <Select
              size="small"
              value={currentMonth}
              onChange={(e) => setViewDate(new Date(currentYear, Number(e.target.value), 1))}
              sx={{
                height: 32,
                fontSize: '13px',
                fontWeight: 400,
                color: '#0f172a',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                '& .MuiSelect-select': { py: 0.5, px: 1, fontWeight: 400 },
                '& fieldset': { borderColor: '#e2e8f0' },
                '&:hover fieldset': { borderColor: '#2563eb' },
              }}
            >
              {MONTH_NAMES.map((m, idx) => (
                <MenuItem key={m} value={idx} sx={{ fontSize: '13px', fontWeight: 400 }}>
                  {m}
                </MenuItem>
              ))}
            </Select>

            {/* Year Select */}
            <Select
              size="small"
              value={YEARS.includes(currentYear) ? currentYear : YEARS[0]}
              onChange={(e) => setViewDate(new Date(Number(e.target.value), currentMonth, 1))}
              sx={{
                height: 32,
                fontSize: '13px',
                fontWeight: 400,
                color: '#0f172a',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                '& .MuiSelect-select': { py: 0.5, px: 1, fontWeight: 400 },
                '& fieldset': { borderColor: '#e2e8f0' },
                '&:hover fieldset': { borderColor: '#2563eb' },
              }}
            >
              {YEARS.map((yr) => (
                <MenuItem key={yr} value={yr} sx={{ fontSize: '13px', fontWeight: 400 }}>
                  {yr}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <IconButton size="small" onClick={handleNextMonth} sx={{ color: '#475569', p: 0.5, '&:hover': { backgroundColor: '#f1f5f9' } }}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Weekday Labels */}
        <Grid container spacing={0.5} sx={{ mb: 1 }}>
          {WEEKDAYS.map((wd) => (
            <Grid item xs={12 / 7} key={wd} sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                {wd}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Days Grid */}
        <Grid container spacing={0.5}>
          {calendarDays.map((cell, idx) => {
            if (!cell.isCurrentMonth) {
              return (
                <Grid item xs={12 / 7} key={idx} sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#cbd5e1',
                      userSelect: 'none',
                    }}
                  >
                    {cell.day}
                  </Box>
                </Grid>
              );
            }

            return (
              <Grid item xs={12 / 7} key={idx} sx={{ textAlign: 'center' }}>
                <Box
                  onClick={() => handleSelectDay(cell.day)}
                  sx={{
                    height: 32,
                    width: 32,
                    mx: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: cell.isSelected || cell.isToday ? 700 : 500,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: cell.isSelected ? '#ffffff' : cell.isToday ? '#2563eb' : '#1e293b',
                    backgroundColor: cell.isSelected ? '#2563eb' : 'transparent',
                    border: cell.isToday && !cell.isSelected ? '1px solid #2563eb' : 'none',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      backgroundColor: cell.isSelected ? '#1d4ed8' : '#eff6ff',
                      color: cell.isSelected ? '#ffffff' : '#2563eb',
                    },
                  }}
                >
                  {cell.day}
                </Box>
              </Grid>
            );
          })}
        </Grid>

        {/* Footer Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2.5, pt: 1.5, borderTop: '1px solid #f1f5f9' }}>
          <Button
            size="small"
            onClick={handleClear}
            sx={{ fontSize: '12px', color: '#64748b', fontWeight: 600, px: 1, minWidth: 'auto', '&:hover': { color: '#dc2626', backgroundColor: '#fef2f2' } }}
          >
            Clear
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleSelectToday}
            sx={{ fontSize: '12px', fontWeight: 600, backgroundColor: '#2563eb', color: '#ffffff', px: 2, borderRadius: '6px', '&:hover': { backgroundColor: '#1d4ed8' } }}
          >
            Today
          </Button>
        </Box>
      </Popover>
    </Box>
  );
};

export default MuiPremiumDatePicker;
