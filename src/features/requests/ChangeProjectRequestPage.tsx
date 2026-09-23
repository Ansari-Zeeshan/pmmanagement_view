import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  Alert,
  Snackbar,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Fade,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { MuiPremiumDatePicker } from '../../components/common/MuiPremiumDatePicker';
import { ApproverSelectionModal } from '../../components/common/ApproverSelectionModal';

const steps = [
  { id: 1, label: 'Information' },
  { id: 2, label: 'Attachments' },
  { id: 3, label: 'Approvers' },
];

const INITIAL_MEMBERS = [
  { id: 1, name: 'Claire Bure', email: 'Clair@emaar.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 2, name: 'Ajmal Khan', email: 'Ajmal@emaar.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 3, name: 'Muhammad Ali', email: 'Ali@emaar.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { id: 4, name: 'Asif Khan', email: 'Asif@emaar.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
  { id: 5, name: 'Sarah Smith', email: 'Sarah@emaar.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
];

export const ChangeProjectRequestPage = () => {
  const [activeStep, setActiveStep] = useState(1);
  const navigate = useNavigate();

  // Step 1: Form Data
  const [formData, setFormData] = useState<any>({
    // Step 1: Information
    dateOfRequest: '2026-09-18',
    priority: '',
    projectName: '',
    changeType: { scope: false, time: false, cost: false },
    baselinedEndDate: '',
    revisedEndDate: '',
    baselineBudget: '',
    revisedBudget: '',
    changeSummary: '',
    changeImpact: '',
    planOfAction: '',

    // Step 2: Attachments
    attachments: [],

    // Step 3: Approvers
    approvers: INITIAL_MEMBERS,
  });

  // Assignee Search / Add input in Step 3
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Validation State
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleCheckboxChange = (type) => (e) => {
    setFormData((prev) => ({
      ...prev,
      changeType: { ...prev.changeType, [type]: e.target.checked },
    }));
  };

  // Step Validation Logic
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.dateOfRequest) newErrors.dateOfRequest = 'Date of Request is required';
      if (!formData.priority) newErrors.priority = 'Priority is required';
      if (!formData.baselineBudget.trim()) newErrors.baselineBudget = 'Baseline Budget is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(activeStep)) {
      setSnackbarMsg('Please fill in all mandatory fields before proceeding.');
      setSnackbarOpen(true);
      return;
    }

    if (activeStep < 3) {
      setActiveStep((prev) => prev + 1);
    } else {
      setSnackbarMsg('Change Project Request submitted successfully!');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/requests');
      }, 1200);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
    } else {
      navigate('/requests');
    }
  };

  const handleStepClick = (stepId) => {
    if (stepId < activeStep) {
      setActiveStep(stepId);
    } else if (stepId > activeStep) {
      if (validateStep(activeStep)) {
        setActiveStep(stepId);
      } else {
        setSnackbarMsg('Please complete mandatory fields on current step.');
        setSnackbarOpen(true);
      }
    }
  };

  // File Upload Handlers (Step 2)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = files.map((f: any) => ({
        id: Date.now() + Math.random(),
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
      }));
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles],
      }));
      setSnackbarMsg(`${files.length} file(s) attached.`);
      setSnackbarOpen(true);
    }
  };

  const handleRemoveFile = (id) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((f) => f.id !== id),
    }));
  };

  // Member Approver Handlers (Step 3)
  const handleAddMember = () => {
    if (assigneeSearch.trim()) {
      const newMember = {
        id: `custom-${Date.now()}`,
        name: assigneeSearch.trim(),
        email: assigneeSearch.trim().toLowerCase().replace(/\s+/g, '.') + '@emaar.ae',
        avatar: '',
      };
      setFormData((prev) => ({
        ...prev,
        approvers: [...prev.approvers, newMember],
      }));
      setAssigneeSearch('');
      setSnackbarMsg('New approver added.');
      setSnackbarOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleModalAddApprovers = (selectedUsers) => {
    setFormData((prev) => {
      const existingIds = new Set(prev.approvers.map((a) => String(a.id || a.email)));
      const filteredNew = selectedUsers.filter(
        (u) => !existingIds.has(String(u.id)) && !existingIds.has(String(u.email))
      );
      return {
        ...prev,
        approvers: [...prev.approvers, ...filteredNew],
      };
    });
    setSnackbarMsg(`${selectedUsers.length} approver(s) added successfully.`);
    setSnackbarOpen(true);
  };

  const handleRemoveMember = (id) => {
    setFormData((prev) => ({
      ...prev,
      approvers: prev.approvers.filter((m) => m.id !== id),
    }));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Grid container spacing={3}>
        {/* Left Column: Vertical Stepper Timeline */}
        <Grid item xs={12} md={3.5} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
            }}
          >
            <Box sx={{ position: 'relative' }}>
              {steps.map((s, idx) => {
                const isActive = activeStep === s.id;
                const isCompleted = activeStep > s.id;
                const isLast = idx === steps.length - 1;

                return (
                  <Box key={s.id} sx={{ position: 'relative', mb: isLast ? 0 : 2.2 }}>
                    {/* Vertical connecting line */}
                    {!isLast && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 22,
                          left: 26,
                          height: 'calc(100% + 10px)',
                          width: '2px',
                          borderLeft: isCompleted ? '2px solid #16a34a' : '2px dashed #cbd5e1',
                          zIndex: 0,
                          transition: 'border-color 0.3s ease',
                        }}
                      />
                    )}

                    <Box
                      onClick={() => handleStepClick(s.id)}
                      sx={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        py: 1.4,
                        px: 2,
                        borderRadius: 2.5,
                        cursor: 'pointer',
                        transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                        backgroundColor: isActive ? '#2563eb' : isCompleted ? '#f0fdf4' : 'transparent',
                        boxShadow: isActive ? '0 4px 14px rgba(37, 99, 235, 0.25)' : 'none',
                        '&:hover': {
                          backgroundColor: isActive ? '#1d4ed8' : isCompleted ? '#e6f7ed' : '#f8fafc',
                          transform: 'translateX(3px)',
                        },
                      }}
                    >
                      {/* Circle Node Icon */}
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isCompleted ? '#16a34a' : isActive ? '#ffffff' : '#e2e8f0',
                          color: isCompleted ? '#ffffff' : isActive ? '#2563eb' : '#64748b',
                          flexShrink: 0,
                          zIndex: 2,
                          boxShadow: isActive ? '0 0 0 3px rgba(255, 255, 255, 0.35)' : 'none',
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircleIcon sx={{ fontSize: 20, color: '#16a34a', backgroundColor: '#ffffff', borderRadius: '50%' }} />
                        ) : isActive ? (
                          <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#2563eb' }} />
                        ) : (
                          <Box sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#ffffff' }} />
                        )}
                      </Box>

                      {/* Step Title Label */}
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: isActive ? 700 : isCompleted ? 600 : 500,
                          fontSize: '14.5px',
                          color: isActive ? '#ffffff !important' : isCompleted ? '#15803d' : '#475569',
                          letterSpacing: '0.01em',
                        }}
                      >
                        {s.label}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Form Wizard Steps */}
        <Grid item xs={12} md={8.5} lg={9}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: '16px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
              minHeight: 600,
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
            }}
          >
            {/* Step Content */}
            <Fade in key={activeStep} timeout={350}>
              <Box>
                {/* STEP 1: Information */}
                {activeStep === 1 && (
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5, fontSize: '2rem' }}>
                      Information
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', mb: 3.5, fontSize: '1.2rem' }}>
                      Provide the <span style={{ color: '#2563eb', fontWeight: 600 }}>Information</span>
                    </Typography>

                    <Grid container spacing={2.5}>
                      {/* Date of Request * */}
                      <Grid item xs={12} sm={6}>
                        <MuiPremiumDatePicker
                          label="Date of Request"
                          required
                          value={formData.dateOfRequest}
                          onChange={(val) => {
                            setFormData((prev) => ({ ...prev, dateOfRequest: val }));
                            if (errors.dateOfRequest) setErrors((prev) => ({ ...prev, dateOfRequest: null }));
                          }}
                          error={Boolean(errors.dateOfRequest)}
                          helperText={errors.dateOfRequest}
                          placeholder="Date"
                        />
                      </Grid>

                      {/* Priority * */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                          Priority <span style={{ color: '#dc2626' }}>*</span>
                        </Typography>
                        <FormControl fullWidth size="small" error={Boolean(errors.priority)}>
                          <Select
                            displayEmpty
                            value={formData.priority}
                            onChange={handleChange('priority')}
                            sx={{ height: 40, fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' }}
                          >
                            <MenuItem value="" disabled sx={{ fontSize: '13px' }}>
                              <span style={{ color: '#94a3b8' }}>Select The Priority</span>
                            </MenuItem>
                            <MenuItem value="High Priority" sx={{ fontSize: '13px' }}>High Priority</MenuItem>
                            <MenuItem value="Medium Priority" sx={{ fontSize: '13px' }}>Medium Priority</MenuItem>
                            <MenuItem value="Low Priority" sx={{ fontSize: '13px' }}>Low Priority</MenuItem>
                          </Select>
                          {errors.priority && <FormHelperText sx={{ fontSize: '13px' }}>{errors.priority}</FormHelperText>}
                        </FormControl>
                      </Grid>

                      {/* Project Name */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                          Project Name
                        </Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            displayEmpty
                            value={formData.projectName}
                            onChange={handleChange('projectName')}
                            sx={{ height: 40, fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' }}
                          >
                            <MenuItem value="" disabled sx={{ fontSize: '13px' }}>
                              <span style={{ color: '#94a3b8' }}>Select</span>
                            </MenuItem>
                            <MenuItem value="Emaar Beachfront Tower 1" sx={{ fontSize: '13px' }}>Emaar Beachfront Tower 1</MenuItem>
                            <MenuItem value="Dubai Mall Expansion Phase 2" sx={{ fontSize: '13px' }}>Dubai Mall Expansion Phase 2</MenuItem>
                            <MenuItem value="Burj Crown Analytics" sx={{ fontSize: '13px' }}>Burj Crown Analytics</MenuItem>
                            <MenuItem value="Downtown Marina Resort" sx={{ fontSize: '13px' }}>Downtown Marina Resort</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Change Type Checkboxes (Bigger Size) */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                          Change Type
                        </Typography>
                        <FormGroup row sx={{ pt: 0.5, gap: 1.5 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                checked={formData.changeType.scope}
                                onChange={handleCheckboxChange('scope')}
                                sx={{
                                  color: '#94a3b8',
                                  '&.Mui-checked': { color: '#2563eb' },
                                  '& .MuiSvgIcon-root': { fontSize: 20 },
                                  p: 0.75,
                                }}
                              />
                            }
                            label={<Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Scope</Typography>}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                checked={formData.changeType.time}
                                onChange={handleCheckboxChange('time')}
                                sx={{
                                  color: '#94a3b8',
                                  '&.Mui-checked': { color: '#2563eb' },
                                  '& .MuiSvgIcon-root': { fontSize: 20 },
                                  p: 0.75,
                                }}
                              />
                            }
                            label={<Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Time</Typography>}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                checked={formData.changeType.cost}
                                onChange={handleCheckboxChange('cost')}
                                sx={{
                                  color: '#94a3b8',
                                  '&.Mui-checked': { color: '#2563eb' },
                                  '& .MuiSvgIcon-root': { fontSize: 20 },
                                  p: 0.75,
                                }}
                              />
                            }
                            label={<Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Cost</Typography>}
                          />
                        </FormGroup>
                      </Grid>

                    {/* Baselined End Date */}
                    <Grid item xs={12} sm={6}>
                      <MuiPremiumDatePicker
                        label="Baselined End Date"
                        value={formData.baselinedEndDate}
                        onChange={(val) => setFormData((prev) => ({ ...prev, baselinedEndDate: val }))}
                        placeholder="Date"
                      />
                    </Grid>

                    {/* Revised End Date */}
                    <Grid item xs={12} sm={6}>
                      <MuiPremiumDatePicker
                        label="Revised End Date"
                        value={formData.revisedEndDate}
                        onChange={(val) => setFormData((prev) => ({ ...prev, revisedEndDate: val }))}
                        placeholder="Date"
                      />
                    </Grid>

                    {/* Baseline Budget * */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Baseline Budget <span style={{ color: '#dc2626' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Search"
                        value={formData.baselineBudget}
                        onChange={handleChange('baselineBudget')}
                        error={Boolean(errors.baselineBudget)}
                        helperText={errors.baselineBudget}
                        sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                      />
                    </Grid>

                    {/* Revised Budget */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Revised Budget
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Search"
                        value={formData.revisedBudget}
                        onChange={handleChange('revisedBudget')}
                        sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                      />
                    </Grid>

                    {/* Change Summary */}
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Change Summary
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3.5}
                        placeholder="Summary"
                        value={formData.changeSummary}
                        onChange={handleChange('changeSummary')}
                        sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                      />
                    </Grid>

                    {/* Change Impact */}
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Change Impact
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3.5}
                        placeholder="Summary"
                        value={formData.changeImpact}
                        onChange={handleChange('changeImpact')}
                        sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                      />
                    </Grid>

                    {/* Plan of Action */}
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Plan of Action
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3.5}
                        placeholder="Summary"
                        value={formData.planOfAction}
                        onChange={handleChange('planOfAction')}
                        sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* STEP 2: Attachments */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5, fontSize: '2rem' }}>
                    Attachments
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', mb: 3.5, fontSize: '1.2rem' }}>
                    Provide the information
                  </Typography>

                  {/* Upload Drop Zone Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', fontSize: '14px' }}>
                      Upload
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 500, fontSize: '12px' }}>
                      (Supports pdf, doc, docx, xlsx, xls, jpg, png, tiff, bmp, txt, ppt, pptx, msg files size should not exceed 30 MB.)
                    </Typography>
                  </Box>

                  {/* Drag and Drop Zone */}
                  <Paper
                    variant="outlined"
                    component="label"
                    sx={{
                      p: 5,
                      border: '2px dashed #93c5fd',
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#eff6ff',
                        borderColor: '#2563eb',
                      },
                    }}
                  >
                    <input type="file" multiple hidden onChange={handleFileUpload} />
                    <CloudUploadIcon sx={{ fontSize: 48, color: '#2563eb', mb: 1.5 }} />
                    <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500, fontSize: '14px' }}>
                      Drag a file here or <span style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'underline' }}>Browse</span> for a file to upload.
                    </Typography>
                  </Paper>

                  {/* Uploaded Files List */}
                  {formData.attachments.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 1.5, fontSize: '14px' }}>
                        Attached Files ({formData.attachments.length})
                      </Typography>
                      <Grid container spacing={1.5}>
                        {formData.attachments.map((file) => (
                          <Grid item xs={12} sm={6} key={file.id}>
                            <Paper
                              variant="outlined"
                              sx={{
                                p: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderRadius: '8px',
                                backgroundColor: '#ffffff',
                                borderColor: '#e2e8f0',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
                                <InsertDriveFileIcon sx={{ color: '#2563eb' }} />
                                <Box sx={{ overflow: 'hidden' }}>
                                  <Typography variant="body2" noWrap sx={{ fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>
                                    {file.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '11px' }}>
                                    {file.size}
                                  </Typography>
                                </Box>
                              </Box>
                              <IconButton size="small" onClick={() => handleRemoveFile(file.id)} sx={{ color: '#94a3b8', '&:hover': { color: '#dc2626' } }}>
                                <DeleteOutlineIcon className="css-120dh41-MuiSvgIcon-root" sx={{ fontSize: '18px !important' }} />
                              </IconButton>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </Box>
              )}

              {/* STEP 3: Approvers */}
              {activeStep === 3 && (
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5, fontSize: '2rem' }}>
                    Approvers
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', mb: 3.5, fontSize: '1.2rem' }}>
                    Provide the Approvers information
                  </Typography>

                  {/* Add Assignee Input */}
                  <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Type name to add or browse directory..."
                      value={assigneeSearch}
                      onChange={(e) => setAssigneeSearch(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" sx={{ color: '#64748b' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddMember}
                      startIcon={<PersonAddIcon fontSize="small" />}
                      sx={{
                        backgroundColor: '#2563eb',
                        '&:hover': { backgroundColor: '#1d4ed8' },
                        fontWeight: 600,
                        fontSize: '13px',
                        px: 3,
                        height: 40,
                        borderRadius: '8px',
                        textTransform: 'none',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                      }}
                    >
                      {assigneeSearch.trim() ? 'Add Quick' : 'Add / Directory'}
                    </Button>
                  </Box>

                  {/* Members List Paper Container */}
                  <Paper
                    variant="outlined"
                    sx={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      borderColor: '#e2e8f0',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    {/* Members List Header */}
                    <Box sx={{ px: 2.5, py: 1.5, backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', fontSize: '13px' }}>
                          Members
                        </Typography>
                        <Chip label={`${formData.approvers.length} Selected`} size="small" sx={{ height: 22, fontSize: '11px', fontWeight: 700, bgcolor: '#dbeafe', color: '#1e40af' }} />
                      </Box>
                      <Button
                        size="small"
                        onClick={() => setIsModalOpen(true)}
                        startIcon={<PersonAddIcon style={{ fontSize: 16 }} />}
                        sx={{ fontSize: '12px', fontWeight: 600, color: '#2563eb', textTransform: 'none' }}
                      >
                        + Browse 100+ Approvers
                      </Button>
                    </Box>

                    {/* Members List with Vertical Scrollbar for > 5-6 names */}
                    <Box
                      sx={{
                        maxHeight: { xs: 300, md: 350 },
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': { width: 6 },
                        '&::-webkit-scrollbar-track': { backgroundColor: '#f1f5f9' },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: 3, '&:hover': { backgroundColor: '#94a3b8' } },
                      }}
                    >
                      <List disablePadding>
                        {formData.approvers.map((member, idx) => (
                          <ListItem
                            key={member.id}
                            divider={idx !== formData.approvers.length - 1}
                            sx={{
                              py: 1.5,
                              px: 2.5,
                              '&:hover': { backgroundColor: '#f8fafc' },
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar src={member.avatar} alt={member.name} sx={{ width: 40, height: 40, bgcolor: '#2563eb', fontSize: '14px', fontWeight: 700 }}>
                                {member.name.split(' ').map((n) => n[0]).join('')}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                                  {member.name}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12px' }}>
                                  {member.email}
                                </Typography>
                              }
                            />
                            <ListItemSecondaryAction>
                              <IconButton edge="end" size="small" onClick={() => handleRemoveMember(member.id)} sx={{ color: '#94a3b8', '&:hover': { color: '#dc2626' } }}>
                                <DeleteOutlineIcon className="css-120dh41-MuiSvgIcon-root" sx={{ fontSize: '18px !important' }} />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Paper>
                </Box>
              )}
            </Box>
          </Fade>

            {/* Bottom Sticky Action Bar */}
            <Box
              className="css-1fkd7on"
              sx={{
                pt: 3,
                mt: 4,
                borderTop: '2px solid #eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              {/* BACK Button */}
              <Button
                variant="outlined"
                onClick={handleBack}
                startIcon={<ArrowBackIcon fontSize="small" />}
                sx={{
                  borderColor: '#cbd5e1',
                  color: '#64748b',
                  fontWeight: 600,
                  fontSize: '13px',
                  px: 3.5,
                  height: 40,
                  borderRadius: 2,
                  textTransform: 'uppercase',
                  '&:hover': {
                    borderColor: '#94a3b8',
                    backgroundColor: '#f8fafc',
                  },
                }}
              >
                BACK
              </Button>

              {/* Step Counter Indicator */}
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b', fontSize: '14px' }}>
                <span style={{ color: '#2563eb', fontWeight: 700 }}>STEP {activeStep}</span> / STEP 3
              </Typography>

              {/* NEXT / SUBMIT Button */}
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={activeStep === 3 ? <SendIcon fontSize="small" /> : <ArrowForwardIcon fontSize="small" />}
                sx={{
                  backgroundColor: '#2563eb',
                  '&:hover': { backgroundColor: '#1d4ed8' },
                  fontWeight: 700,
                  fontSize: '13px',
                  px: 4,
                  height: 40,
                  borderRadius: 2,
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                }}
              >
                {activeStep === 3 ? 'SUBMIT' : 'NEXT'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar Alert Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="warning" onClose={() => setSnackbarOpen(false)} sx={{ width: '100%', borderRadius: 2 }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>

      {/* Approvers Selection Directory Modal Popup */}
      <ApproverSelectionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        existingApprovers={formData.approvers}
        onAddApprovers={handleModalAddApprovers}
      />
    </Box>
  );
};

export default ChangeProjectRequestPage;
