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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';

export const FIELD_LOOKUP_DATA = {
  projectName: [
    { id: 'p1', label: 'Emaar Beachfront Tower 1', detail: 'Real Estate & Property Tech' },
    { id: 'p2', label: 'Dubai Mall Expansion Phase 2', detail: 'Retail & Hospitality Infrastructure' },
    { id: 'p3', label: 'Burj Crown Analytics Platform', detail: 'Enterprise Data & Intelligence' },
    { id: 'p4', label: 'Downtown Marina Resort Portal', detail: 'Guest Experience & Mobile App' },
    { id: 'p5', label: 'Dubai Hills Estate Smart Ops', detail: 'IoT & Smart Facility Management' },
    { id: 'p6', label: 'Dubai Creek Harbour Digital Hub', detail: 'Cloud ERP Migration' },
    { id: 'p7', label: 'Emaar South Community Platform', detail: 'Resident Portal & Billing' },
    { id: 'p8', label: 'Dubai Opera Ticketing Platform', detail: 'E-Commerce & High-Volume Ticketing' },
  ],
  projectManagerBusiness: [
    { id: 'm1', label: 'Claire Bure', detail: 'Head of Business PMO (Clair@emaar.com)' },
    { id: 'm2', label: 'Sarah Smith', detail: 'Senior Business Lead (Sarah@emaar.com)' },
    { id: 'm3', label: 'Mariam Al Suwaidi', detail: 'Business Operations Director (Mariam@emaar.com)' },
    { id: 'm4', label: 'Rashid Al Mazrouei', detail: 'Commercial Strategy VP (Rashid@emaar.com)' },
    { id: 'm5', label: 'Laila Al Qassimi', detail: 'Business Transformation Manager (Laila@emaar.com)' },
  ],
  projectManagerIT: [
    { id: 'it1', label: 'Muhammad Ali', detail: 'Senior IT Project Manager (Ali@emaar.com)' },
    { id: 'it2', label: 'Asif Khan', detail: 'IT Solutions Manager (Asif@emaar.com)' },
    { id: 'it3', label: 'Tariq Al Zaabi', detail: 'Lead Software Architect (Tariq@emaar.com)' },
    { id: 'it4', label: 'Zainab Al Mansoori', detail: 'Director of Technology (Zainab@emaar.com)' },
    { id: 'it5', label: 'Hamdan Al Kaabi', detail: 'Engineering Lead (Hamdan@emaar.com)' },
  ],
  programManagerIT: [
    { id: 'pg1', label: 'Ajmal Khan', detail: 'Enterprise IT Program Manager (Ajmal@emaar.com)' },
    { id: 'pg2', label: 'Fatima Al Hashimi', detail: 'VP of Technology Programs (Fatima@emaar.com)' },
    { id: 'pg3', label: 'Omar Al Nuaimi', detail: 'Chief Information Officer (Omar@emaar.com)' },
    { id: 'pg4', label: 'Youssef Al Hosani', detail: 'Head of Infrastructure Programs (Youssef@emaar.com)' },
  ],
  projectOwner: [
    { id: 'po1', label: 'Claire Bure', detail: 'Head of Digital PMO (Clair@emaar.com)' },
    { id: 'po2', label: 'Sarah Smith', detail: 'VP Strategy & Operations (Sarah@emaar.com)' },
    { id: 'po3', label: 'Ajmal Khan', detail: 'Head of Infrastructure (Ajmal@emaar.com)' },
    { id: 'po4', label: 'Muhammad Ali', detail: 'Lead Product Manager (Ali@emaar.com)' },
    { id: 'po5', label: 'Mariam Al Suwaidi', detail: 'Business Operations Director (Mariam@emaar.com)' },
    { id: 'po6', label: 'Rashid Al Mazrouei', detail: 'Commercial Strategy VP (Rashid@emaar.com)' },
  ],
  assignedTo: [
    { id: 'at1', label: 'Asif Khan', detail: 'Senior Solutions Architect (Asif@emaar.com)' },
    { id: 'at2', label: 'Tariq Al Zaabi', detail: 'Lead Software Engineer (Tariq@emaar.com)' },
    { id: 'at3', label: 'Zainab Al Mansoori', detail: 'Director of Technology (Zainab@emaar.com)' },
    { id: 'at4', label: 'Hamdan Al Kaabi', detail: 'Engineering Lead (Hamdan@emaar.com)' },
    { id: 'at5', label: 'Laila Al Qassimi', detail: 'Business Analyst (Laila@emaar.com)' },
    { id: 'at6', label: 'Muhammad Ali', detail: 'Senior Technical PM (Ali@emaar.com)' },
  ],
  departmentLead: [
    { id: 'dl1', label: 'Ajmal Khan (Head of Digital Operations)', detail: 'Digital Infrastructure & Cloud PMO' },
    { id: 'dl2', label: 'Mariam Al Suwaidi (Head of Enterprise PMO)', detail: 'Corporate Governance & Strategy' },
    { id: 'dl3', label: 'Rashid Al Mazrouei (VP Digital Transformation)', detail: 'Transformation & Innovation' },
    { id: 'dl4', label: 'Claire Bure (Chief Technology Officer)', detail: 'Executive Tech Leadership' },
    { id: 'dl5', label: 'Sarah Smith (Director of IT Operations)', detail: 'Global IT Operations' },
  ],
  financeReviewer: [
    { id: 'fr1', label: 'Sarah Smith (VP Finance)', detail: 'Corporate Finance & Budget Control' },
    { id: 'fr2', label: 'Ahmed Al Mansoori (Director Financial Controlling)', detail: 'IT Capital Expenditure Management' },
    { id: 'fr3', label: 'Fatima Al Hashimi (Lead Financial Analyst)', detail: 'Enterprise ERP Financial Planning' },
    { id: 'fr4', label: 'Sultan Al Qassimi (Chief Financial Officer)', detail: 'Executive Financial Sign-Off' },
  ],
  executiveSponsor: [
    { id: 'es1', label: 'Claire Bure (Chief Technology Officer)', detail: 'Executive Technology Sponsor' },
    { id: 'es2', label: 'Omar Al Nuaimi (Chief Information Officer)', detail: 'Group Information Systems Leader' },
    { id: 'es3', label: 'Youssef Al Hosani (Executive Vice President)', detail: 'Real Estate & Infrastructure Development' },
    { id: 'es4', label: 'Mariam Al Suwaidi (Head of Transformation)', detail: 'Enterprise Strategy Sponsor' },
  ],
  clientName: [
    { id: 'cl1', label: 'EMAAR Properties PJSC', detail: 'Corporate Headquarters' },
    { id: 'cl2', label: 'EMAAR Development PJSC', detail: 'Residential & Commercial Projects' },
    { id: 'cl3', label: 'EMAAR Malls Management', detail: 'Retail & Commercial Leasing' },
    { id: 'cl4', label: 'EMAAR Hospitality Group', detail: 'Hotels & Leisure Properties' },
    { id: 'cl5', label: 'EMAAR Entertainment Division', detail: 'Dubai Aquarium & VR Park' },
  ],
};

export const FieldLookupModal = ({
  open,
  onClose,
  fieldName = 'projectName',
  title = 'Search & Select',
  currentValue = '',
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const lookupOptions = useMemo(() => {
    return FIELD_LOOKUP_DATA[fieldName] || FIELD_LOOKUP_DATA.projectName;
  }, [fieldName]);

  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return lookupOptions;
    return lookupOptions.filter(
      (opt) => opt.label.toLowerCase().includes(query) || opt.detail.toLowerCase().includes(query)
    );
  }, [searchQuery, lookupOptions]);

  const handleChoose = (value) => {
    onSelect(value);
    setSearchQuery('');
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
          px: 3.5,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '16px', lineHeight: 1.3 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px', mt: 0.5 }}>
            Search and select an entry to auto-fill the field
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748b', '&:hover': { color: '#0f172a', backgroundColor: '#f1f5f9' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3.5, backgroundColor: '#f8fafc' }}>
        <TextField
          fullWidth
          placeholder={`Search ${title.toLowerCase()}...`}
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
            mt: 1,
            mb: 2.5,
            backgroundColor: '#ffffff',
            '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '14px' },
          }}
        />

        <Paper variant="outlined" sx={{ borderRadius: '12px', borderColor: '#e2e8f0', maxHeight: 320, overflowY: 'auto' }}>
          <List disablePadding>
            {filteredOptions.map((opt, idx) => {
              const isSelected = currentValue === opt.label;
              return (
                <React.Fragment key={opt.id}>
                  <ListItem
                    onClick={() => handleChoose(opt.label)}
                    sx={{
                      py: 1.5,
                      px: 2.5,
                      backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                      '&:hover': { backgroundColor: isSelected ? '#dbeafe' : '#f8fafc' },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                          {opt.label}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12.5px' }}>
                          {opt.detail}
                        </Typography>
                      }
                    />
                    {isSelected && <CheckCircleIcon sx={{ color: '#2563eb', fontSize: 20 }} />}
                  </ListItem>
                  {idx < filteredOptions.length - 1 && <Divider component="li" />}
                </React.Fragment>
              );
            })}
          </List>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ px: 3.5, py: 2, borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: '#cbd5e1',
            color: '#475569',
            fontWeight: 600,
            fontSize: '13px',
            px: 3.5,
            py: 0.8,
            borderRadius: '8px',
            textTransform: 'none',
            '&:hover': {
              borderColor: '#94a3b8',
              backgroundColor: '#f8fafc',
            },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
