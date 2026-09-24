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
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Fade,
  Rating,
  Divider,
  Tooltip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import StarIcon from '@mui/icons-material/Star';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { MuiPremiumDatePicker } from '../../components/common/MuiPremiumDatePicker';
import { ApproverSelectionModal } from '../../components/common/ApproverSelectionModal';
import { DigitalSignaturePad } from '../../components/common/DigitalSignaturePad';
import { FieldLookupModal } from '../../components/common/FieldLookupModal';
import { RatingCommentModal } from '../../components/common/RatingCommentModal';

const closureSteps = [
  { id: 1, label: 'Project Information' },
  { id: 2, label: 'Project Background' },
  { id: 3, label: 'Project Achievements' },
  { id: 4, label: 'Customer Feedback' },
  { id: 5, label: 'Sign-Off' },
];

const DEFAULT_SIGN_OFF_MEMBERS = [
  { id: 1, name: 'Claire Bure', role: 'Business Project Manager', email: 'Clair@emaar.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 2, name: 'Ajmal Khan', role: 'IT Program Manager', email: 'Ajmal@emaar.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 3, name: 'Muhammad Ali', role: 'IT Project Manager', email: 'Ali@emaar.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
];

export const ITProjectClosurePage = () => {
  const [activeStep, setActiveStep] = useState(1);
  const navigate = useNavigate();

  // Form Data State across 5 steps
  const [formData, setFormData] = useState<any>({
    // Step 1: Project Information
    projectName: '',
    projectManagerBusiness: '',
    projectManagerIT: '',
    programManagerIT: '',
    teamMembersBusiness: '',
    teamMembersIT: '',

    // Step 2: Project Background
    projectScope: '',
    effortBudgetEstimated: '',
    timelinesCommitted: '',

    // Step 3: Project Achievements
    projectAccomplishments: '',
    effortBudgetSpent: '',
    timelinesDelivered: '',
    reasonsForDelay: '',
    commentsLearning: '',

    // Step 4: Customer Feedback (Default 0: no rating selected initially)
    ratingSchedule: 0,
    ratingObjective: 0,
    ratingSkillLevel: 0,
    ratingResponsiveness: 0,
    ratingCommunication: 0,
    ratingOverall: 0,
    ratingComments: {},
    impactOnBusiness: '',
    otherComments: '',

    // Step 5: Sign-Off
    customerName: '',
    customerDesignation: '',
    customerSignature: null,
    itClosureName: '',
    itClosureDesignation: '',
    itClosureSignature: null,
    signOffDate: '2026-09-18',
    signOffRemarks: '',
    signOffApprovers: DEFAULT_SIGN_OFF_MEMBERS,
    signOffAttachments: [],
  });

  // Modal & Validation state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lookupModalConfig, setLookupModalConfig] = useState<any>(null); // { open: true, fieldName: 'projectName', title: 'Project Name' }
  const [activeCommentParam, setActiveCommentParam] = useState<any>(null); // { open: true, key: 'ratingSchedule', label: 'Project completion...' }
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleRatingChange = (field) => (event, newValue) => {
    setFormData((prev) => ({ ...prev, [field]: newValue || 0 }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSaveRatingComment = (key, text) => {
    setFormData((prev) => ({
      ...prev,
      ratingComments: { ...prev.ratingComments, [key]: text },
    }));
    setSnackbarMsg('Optional feedback saved for parameter.');
    setSnackbarOpen(true);
  };

  // Step Validation logic
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.projectName.trim()) newErrors.projectName = 'Project Name is required';
      if (!formData.projectManagerBusiness.trim()) newErrors.projectManagerBusiness = 'Project Manager Business is required';
      if (!formData.projectManagerIT.trim()) newErrors.projectManagerIT = 'Project Manager IT is required';
    } else if (step === 2) {
      if (!formData.projectScope.trim()) newErrors.projectScope = 'Project Scope is required';
      if (!formData.effortBudgetEstimated.trim()) newErrors.effortBudgetEstimated = 'Effort / Budget Estimated is required';
      if (!formData.timelinesCommitted.trim()) newErrors.timelinesCommitted = 'Timelines Committed is required';
    } else if (step === 3) {
      if (!formData.projectAccomplishments.trim()) newErrors.projectAccomplishments = 'Project Accomplishments is required';
      if (!formData.effortBudgetSpent.trim()) newErrors.effortBudgetSpent = 'Effort / Budget Spent is required';
      if (!formData.timelinesDelivered.trim()) newErrors.timelinesDelivered = 'Timelines Delivered is required';
    } else if (step === 4) {
      if (!formData.ratingSchedule) newErrors.ratingSchedule = 'Rating is required';
      if (!formData.ratingObjective) newErrors.ratingObjective = 'Rating is required';
      if (!formData.ratingSkillLevel) newErrors.ratingSkillLevel = 'Rating is required';
      if (!formData.ratingResponsiveness) newErrors.ratingResponsiveness = 'Rating is required';
      if (!formData.impactOnBusiness.trim()) newErrors.impactOnBusiness = 'Impact on Business description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(activeStep)) {
      setSnackbarMsg('Please complete mandatory fields before proceeding.');
      setSnackbarOpen(true);
      return;
    }

    if (activeStep < 5) {
      setActiveStep((prev) => prev + 1);
    } else {
      setSnackbarMsg('IT Project Closure Report submitted successfully!');
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

  const handleModalAddApprovers = (selectedUsers) => {
    setFormData((prev) => {
      const existingIds = new Set(prev.signOffApprovers.map((a) => String(a.id || a.email)));
      const filteredNew = selectedUsers.filter(
        (u) => !existingIds.has(String(u.id)) && !existingIds.has(String(u.email))
      );
      return {
        ...prev,
        signOffApprovers: [...prev.signOffApprovers, ...filteredNew],
      };
    });
    setSnackbarMsg(`${selectedUsers.length} approver(s) added for sign-off.`);
    setSnackbarOpen(true);
  };

  const handleRemoveApprover = (id) => {
    setFormData((prev) => ({
      ...prev,
      signOffApprovers: prev.signOffApprovers.filter((m) => m.id !== id),
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newAttachments = files.map((file: any) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    }));
    setFormData((prev) => ({
      ...prev,
      signOffAttachments: [...prev.signOffAttachments, ...newAttachments],
    }));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Grid container spacing={3.5} alignItems="stretch">
        {/* Left Column: Vertical Stepper Timeline */}
        <Grid item xs={12} md={3.2} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
              height: '100%',
              minHeight: 520,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 3, color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Closure Workflow
            </Typography>

            <Box sx={{ position: 'relative', py: 0.5 }}>
              {closureSteps.map((s, idx) => {
                const isActive = activeStep === s.id;
                const isCompleted = activeStep > s.id;
                const isLast = idx === closureSteps.length - 1;

                return (
                  <Box key={s.id} sx={{ position: 'relative', mb: isLast ? 0 : 2.2 }}>
                    {/* Vertical Connecting Line */}
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

                      {/* Step Label */}
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: isActive ? 700 : isCompleted ? 600 : 500,
                          fontSize: '14px',
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
        <Grid item xs={12} md={8.8} lg={9}>
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
              justifyContent: 'space-between',
            }}
          >
            {/* Step Content Wrapper */}
            <Fade in key={activeStep} timeout={350}>
              <Box>
                {/* STEP 1: Project Information */}
                {activeStep === 1 && (
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5, fontSize: '2rem' }}>
                      Project Information
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', mb: 3.5, fontSize: '1.2rem' }}>
                      Provide the project information details
                    </Typography>

                    <Grid container spacing={2.5}>
                      {/* Project Name * */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                          Project Name *
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Project Name *"
                          value={formData.projectName}
                          onChange={handleChange('projectName')}
                          error={!!errors.projectName}
                          helperText={errors.projectName}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Tooltip title="Search Project Name">
                                  <IconButton
                                    size="small"
                                    onClick={() => setLookupModalConfig({ open: true, fieldName: 'projectName', title: 'Search Project Name' })}
                                    sx={{ color: '#64748b', '&:hover': { color: '#2563eb' } }}
                                  >
                                    <SearchIcon className="css-oclf15-MuiSvgIcon-root" sx={{ fontSize: '16px !important' }} />
                                  </IconButton>
                                </Tooltip>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                        />
                      </Grid>

                      {/* Project Manager Business * */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                          Project Manager Business *
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Project Manager Business *"
                          value={formData.projectManagerBusiness}
                          onChange={handleChange('projectManagerBusiness')}
                          error={!!errors.projectManagerBusiness}
                          helperText={errors.projectManagerBusiness}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Tooltip title="Search Project Manager Business">
                                  <IconButton
                                    size="small"
                                    onClick={() => setLookupModalConfig({ open: true, fieldName: 'projectManagerBusiness', title: 'Search Project Manager Business' })}
                                    sx={{ color: '#64748b', '&:hover': { color: '#2563eb' } }}
                                  >
                                    <SearchIcon className="css-oclf15-MuiSvgIcon-root" sx={{ fontSize: '16px !important' }} />
                                  </IconButton>
                                </Tooltip>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                        />
                      </Grid>

                      {/* Project Manager IT * */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                          Project Manager IT *
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Program Manager *"
                          value={formData.projectManagerIT}
                          onChange={handleChange('projectManagerIT')}
                          error={!!errors.projectManagerIT}
                          helperText={errors.projectManagerIT}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Tooltip title="Search Project Manager IT">
                                  <IconButton
                                    size="small"
                                    onClick={() => setLookupModalConfig({ open: true, fieldName: 'projectManagerIT', title: 'Search Project Manager IT' })}
                                    sx={{ color: '#64748b', '&:hover': { color: '#2563eb' } }}
                                  >
                                    <SearchIcon className="css-oclf15-MuiSvgIcon-root" sx={{ fontSize: '16px !important' }} />
                                  </IconButton>
                                </Tooltip>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                        />
                      </Grid>

                      {/* Program Manager IT * */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                          Program Manager IT *
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Program Manager IT *"
                          value={formData.programManagerIT}
                          onChange={handleChange('programManagerIT')}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Tooltip title="Search Program Manager IT">
                                  <IconButton
                                    size="small"
                                    onClick={() => setLookupModalConfig({ open: true, fieldName: 'programManagerIT', title: 'Search Program Manager IT' })}
                                    sx={{ color: '#64748b', '&:hover': { color: '#2563eb' } }}
                                  >
                                    <SearchIcon className="css-oclf15-MuiSvgIcon-root" sx={{ fontSize: '16px !important' }} />
                                  </IconButton>
                                </Tooltip>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                        />
                      </Grid>

                      {/* Team Members (Business) : */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                          Team Members (Business) :
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Program Manager IT *"
                          value={formData.teamMembersBusiness}
                          onChange={handleChange('teamMembersBusiness')}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Tooltip title="Search Business Team Members">
                                  <IconButton
                                    size="small"
                                    onClick={() => setLookupModalConfig({ open: true, fieldName: 'projectManagerBusiness', title: 'Search Business Team Members' })}
                                    sx={{ color: '#64748b', '&:hover': { color: '#2563eb' } }}
                                  >
                                    <SearchIcon className="css-oclf15-MuiSvgIcon-root" sx={{ fontSize: '16px !important' }} />
                                  </IconButton>
                                </Tooltip>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                        />
                      </Grid>

                      {/* Team Members (IT) : */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                          Team Members (IT) :
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Client Name"
                          value={formData.teamMembersIT}
                          onChange={handleChange('teamMembersIT')}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Tooltip title="Search IT Team Members">
                                  <IconButton
                                    size="small"
                                    onClick={() => setLookupModalConfig({ open: true, fieldName: 'projectManagerIT', title: 'Search IT Team Members' })}
                                    sx={{ color: '#64748b', '&:hover': { color: '#2563eb' } }}
                                  >
                                    <SearchIcon className="css-oclf15-MuiSvgIcon-root" sx={{ fontSize: '16px !important' }} />
                                  </IconButton>
                                </Tooltip>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* STEP 2: Project Background */}
                {activeStep === 2 && (
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5, fontSize: '2rem' }}>
                      Project Background
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', mb: 3.5, fontSize: '1.2rem' }}>
                      Provide the project background details
                    </Typography>

                    <Grid container spacing={2.5}>
                      {/* Project Scope * */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                          Project Scope *
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Project Name *"
                          value={formData.projectScope}
                          onChange={handleChange('projectScope')}
                          error={!!errors.projectScope}
                          helperText={errors.projectScope}
                          sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                        />
                      </Grid>

                      {/* Effort / Budget Estimated * */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                          Effort / Budget Estimated *
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Project Manager Business *"
                          value={formData.effortBudgetEstimated}
                          onChange={handleChange('effortBudgetEstimated')}
                          error={!!errors.effortBudgetEstimated}
                          helperText={errors.effortBudgetEstimated}
                          sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                        />
                      </Grid>

                      {/* Timelines Committed * */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                          Timelines Committed *
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Program Manager *"
                          value={formData.timelinesCommitted}
                          onChange={handleChange('timelinesCommitted')}
                          error={!!errors.timelinesCommitted}
                          helperText={errors.timelinesCommitted}
                          sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* STEP 3: Project Achievements */}
                {activeStep === 3 && (
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5, fontSize: '2rem' }}>
                      Project Achievements
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', mb: 3.5, fontSize: '1.2rem' }}>
                      Provide the project achievement details
                    </Typography>

                    <Grid container spacing={2.5}>
                      {/* Project Accomplishments * */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                          Project Accomplishments *
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Project Name *"
                          value={formData.projectAccomplishments}
                          onChange={handleChange('projectAccomplishments')}
                          error={!!errors.projectAccomplishments}
                          helperText={errors.projectAccomplishments}
                          sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                        />
                      </Grid>

                      {/* Effort / Budget Spent * */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                          Effort / Budget Spent *
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Project Manager Business *"
                          value={formData.effortBudgetSpent}
                          onChange={handleChange('effortBudgetSpent')}
                          error={!!errors.effortBudgetSpent}
                          helperText={errors.effortBudgetSpent}
                          sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                        />
                      </Grid>

                      {/* Timelines Delivered * */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                          Timelines Delivered *
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Timelines Delivered"
                          value={formData.timelinesDelivered}
                          onChange={handleChange('timelinesDelivered')}
                          error={!!errors.timelinesDelivered}
                          helperText={errors.timelinesDelivered}
                          sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                        />
                      </Grid>

                      {/* Reasons for delay ( if any ) * */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                          Reasons for delay ( if any ) *
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Reason for delay"
                          value={formData.reasonsForDelay}
                          onChange={handleChange('reasonsForDelay')}
                          sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                        />
                      </Grid>

                      {/* Comments / Learning (Optional) */}
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                          Comments / Learning (Optional)
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Comments or Learning"
                          value={formData.commentsLearning}
                          onChange={handleChange('commentsLearning')}
                          sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* STEP 4: Customer Feedback */}
                {activeStep === 4 && (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '2rem' }}>
                        Customer Feedback
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic' }}>
                        ( to be filled by Project Owner/Project Manager)
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ display: 'block', color: '#0f172a', fontWeight: 700, mb: 3.5, fontSize: '13px' }}>
                      Quality of Delivery: 1 is lowest satisfaction, 5 is highest satisfaction
                    </Typography>

                    <Grid container spacing={3}>
                      {/* Rating 1: Project completion as per the agreed schedule * */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#334155', fontSize: '13px' }}>
                          Project completion as per the agreed schedule *
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1, fontSize: '11px' }}>
                          Rating
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '11px' }}>Less</Typography>
                          <Rating
                            value={formData.ratingSchedule}
                            onChange={handleRatingChange('ratingSchedule')}
                            precision={1}
                            icon={<StarIcon fontSize="medium" sx={{ color: '#f59e0b' }} />}
                            emptyIcon={<StarIcon fontSize="medium" sx={{ color: '#cbd5e1' }} />}
                          />
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '11px' }}>High</Typography>
                          <Tooltip title={formData.ratingComments.ratingSchedule ? `Feedback: ${formData.ratingComments.ratingSchedule}` : 'Add optional feedback'}>
                            <IconButton
                              size="small"
                              onClick={() => setActiveCommentParam({ key: 'ratingSchedule', label: 'Project completion as per the agreed schedule *' })}
                              sx={{ color: formData.ratingComments.ratingSchedule ? '#2563eb' : '#cbd5e1', '&:hover': { color: '#2563eb' } }}
                            >
                              <ChatBubbleOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        {errors.ratingSchedule && <Typography variant="caption" color="error">{errors.ratingSchedule}</Typography>}
                      </Grid>

                      {/* Rating 2: Project objective met as per agreed schedule * */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#334155', fontSize: '13px' }}>
                          Project objective met as per agreed schedule *
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1, fontSize: '11px' }}>
                          Rating
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '11px' }}>Less</Typography>
                          <Rating
                            value={formData.ratingObjective}
                            onChange={handleRatingChange('ratingObjective')}
                            precision={1}
                            icon={<StarIcon fontSize="medium" sx={{ color: '#f59e0b' }} />}
                            emptyIcon={<StarIcon fontSize="medium" sx={{ color: '#cbd5e1' }} />}
                          />
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '11px' }}>High</Typography>
                          <Tooltip title={formData.ratingComments.ratingObjective ? `Feedback: ${formData.ratingComments.ratingObjective}` : 'Add optional feedback'}>
                            <IconButton
                              size="small"
                              onClick={() => setActiveCommentParam({ key: 'ratingObjective', label: 'Project objective met as per agreed schedule *' })}
                              sx={{ color: formData.ratingComments.ratingObjective ? '#2563eb' : '#cbd5e1', '&:hover': { color: '#2563eb' } }}
                            >
                              <ChatBubbleOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        {errors.ratingObjective && <Typography variant="caption" color="error">{errors.ratingObjective}</Typography>}
                      </Grid>

                      {/* Rating 3: Skill level of the project team * */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#334155', fontSize: '13px' }}>
                          Skill level of the project team *
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1, fontSize: '11px' }}>
                          Rating
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '11px' }}>Less</Typography>
                          <Rating
                            value={formData.ratingSkillLevel}
                            onChange={handleRatingChange('ratingSkillLevel')}
                            precision={1}
                            icon={<StarIcon fontSize="medium" sx={{ color: '#f59e0b' }} />}
                            emptyIcon={<StarIcon fontSize="medium" sx={{ color: '#cbd5e1' }} />}
                          />
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '11px' }}>High</Typography>
                          <Tooltip title={formData.ratingComments.ratingSkillLevel ? `Feedback: ${formData.ratingComments.ratingSkillLevel}` : 'Add optional feedback'}>
                            <IconButton
                              size="small"
                              onClick={() => setActiveCommentParam({ key: 'ratingSkillLevel', label: 'Skill level of the project team *' })}
                              sx={{ color: formData.ratingComments.ratingSkillLevel ? '#2563eb' : '#cbd5e1', '&:hover': { color: '#2563eb' } }}
                            >
                              <ChatBubbleOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        {errors.ratingSkillLevel && <Typography variant="caption" color="error">{errors.ratingSkillLevel}</Typography>}
                      </Grid>

                      {/* Rating 4: Responsiveness of team members in delivery * */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#334155', fontSize: '13px' }}>
                          Responsiveness of team members in delivery *
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1, fontSize: '11px' }}>
                          Rating
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '11px' }}>Less</Typography>
                          <Rating
                            value={formData.ratingResponsiveness}
                            onChange={handleRatingChange('ratingResponsiveness')}
                            precision={1}
                            icon={<StarIcon fontSize="medium" sx={{ color: '#f59e0b' }} />}
                            emptyIcon={<StarIcon fontSize="medium" sx={{ color: '#cbd5e1' }} />}
                          />
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '11px' }}>High</Typography>
                          <Tooltip title={formData.ratingComments.ratingResponsiveness ? `Feedback: ${formData.ratingComments.ratingResponsiveness}` : 'Add optional feedback'}>
                            <IconButton
                              size="small"
                              onClick={() => setActiveCommentParam({ key: 'ratingResponsiveness', label: 'Responsiveness of team members in delivery *' })}
                              sx={{ color: formData.ratingComments.ratingResponsiveness ? '#2563eb' : '#cbd5e1', '&:hover': { color: '#2563eb' } }}
                            >
                              <ChatBubbleOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        {errors.ratingResponsiveness && <Typography variant="caption" color="error">{errors.ratingResponsiveness}</Typography>}
                      </Grid>

                      {/* Rating 5: Communication management by team (MOM / Presentation) */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#334155', fontSize: '13px' }}>
                          Communication management by team (MOM / Presentation)
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1, fontSize: '11px' }}>
                          Rating
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '11px' }}>Less</Typography>
                          <Rating
                            value={formData.ratingCommunication}
                            onChange={handleRatingChange('ratingCommunication')}
                            precision={1}
                            icon={<StarIcon fontSize="medium" sx={{ color: '#f59e0b' }} />}
                            emptyIcon={<StarIcon fontSize="medium" sx={{ color: '#cbd5e1' }} />}
                          />
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '11px' }}>High</Typography>
                          <Tooltip title={formData.ratingComments.ratingCommunication ? `Feedback: ${formData.ratingComments.ratingCommunication}` : 'Add optional feedback'}>
                            <IconButton
                              size="small"
                              onClick={() => setActiveCommentParam({ key: 'ratingCommunication', label: 'Communication management by team (MOM / Presentation)' })}
                              sx={{ color: formData.ratingComments.ratingCommunication ? '#2563eb' : '#cbd5e1', '&:hover': { color: '#2563eb' } }}
                            >
                              <ChatBubbleOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Grid>

                      {/* Rating 6: Overall Satisfaction Rating */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#334155', fontSize: '13px' }}>
                          Overall Satisfaction Rating
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1, fontSize: '11px' }}>
                          Rating
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '11px' }}>Less</Typography>
                          <Rating
                            value={formData.ratingOverall}
                            onChange={handleRatingChange('ratingOverall')}
                            precision={1}
                            icon={<StarIcon fontSize="medium" sx={{ color: '#f59e0b' }} />}
                            emptyIcon={<StarIcon fontSize="medium" sx={{ color: '#cbd5e1' }} />}
                          />
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '11px' }}>High</Typography>
                          <Tooltip title={formData.ratingComments.ratingOverall ? `Feedback: ${formData.ratingComments.ratingOverall}` : 'Add optional feedback'}>
                            <IconButton
                              size="small"
                              onClick={() => setActiveCommentParam({ key: 'ratingOverall', label: 'Overall Satisfaction Rating' })}
                              sx={{ color: formData.ratingComments.ratingOverall ? '#2563eb' : '#cbd5e1', '&:hover': { color: '#2563eb' } }}
                            >
                              <ChatBubbleOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Grid>

                      {/* Text 1: Impact on business through project * */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25, color: '#334155', fontSize: '13px' }}>
                          Impact on business through project *
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1, fontSize: '11.5px' }}>
                          Please specify the benefits, if required add sheets
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          placeholder="Comments or Learning"
                          value={formData.impactOnBusiness}
                          onChange={handleChange('impactOnBusiness')}
                          error={!!errors.impactOnBusiness}
                          helperText={errors.impactOnBusiness}
                          sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                        />
                      </Grid>

                      {/* Text 2: Other Comments (Optional) */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25, color: '#334155', fontSize: '13px' }}>
                          Other Comments (Optional)
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1, fontSize: '11.5px' }}>
                          Provide other comments, if there are
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          placeholder="Comments or Learning"
                          value={formData.otherComments}
                          onChange={handleChange('otherComments')}
                          sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* STEP 5: Sign-Off */}
                {activeStep === 5 && (
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5, fontSize: '2rem' }}>
                      Sign-Off
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', mb: 3.5, fontSize: '1.2rem' }}>
                      Provide final sign-off details and approvals
                    </Typography>

                    <Grid container spacing={3.5}>
                      {/* Customer / Business Sign Off Column */}
                      <Grid item xs={12} md={6}>
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: '14px', backgroundColor: '#ffffff', borderColor: '#e2e8f0', height: '100%' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 2, fontSize: '15px' }}>
                            Customer Sign Off
                          </Typography>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                              Name
                            </Typography>
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="Customer Name"
                              value={formData.customerName}
                              onChange={handleChange('customerName')}
                              sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                            />
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                              Designation
                            </Typography>
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="Customer Designation"
                              value={formData.customerDesignation}
                              onChange={handleChange('customerDesignation')}
                              sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                            />
                          </Box>

                          <DigitalSignaturePad
                            label="Digital Signature"
                            onSaveSignature={(sig) => setFormData((prev) => ({ ...prev, customerSignature: sig }))}
                          />
                        </Paper>
                      </Grid>

                      {/* IT Closure Sign Off Column */}
                      <Grid item xs={12} md={6}>
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: '14px', backgroundColor: '#ffffff', borderColor: '#e2e8f0', height: '100%' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 2, fontSize: '15px' }}>
                            IT Closure Sign Off
                          </Typography>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                              Name
                            </Typography>
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="IT Closure Name"
                              value={formData.itClosureName}
                              onChange={handleChange('itClosureName')}
                              sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                            />
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                              Designation
                            </Typography>
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="IT Closure Designation"
                              value={formData.itClosureDesignation}
                              onChange={handleChange('itClosureDesignation')}
                              sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                            />
                          </Box>

                          <DigitalSignaturePad
                            label="Digital Signature"
                            onSaveSignature={(sig) => setFormData((prev) => ({ ...prev, itClosureSignature: sig }))}
                          />
                        </Paper>
                      </Grid>

                      {/* Date of Sign-off */}
                      <Grid item xs={12} sm={6}>
                        <MuiPremiumDatePicker
                          label="Date of Sign-off"
                          required
                          value={formData.signOffDate}
                          onChange={(val) => setFormData((prev) => ({ ...prev, signOffDate: val }))}
                        />
                      </Grid>

                      {/* Approvers Selection Box */}
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                            Sign-Off Approvers ({formData.signOffApprovers.length})
                          </Typography>
                          <Button
                            size="small"
                            onClick={() => setIsModalOpen(true)}
                            startIcon={<PersonAddIcon style={{ fontSize: 16 }} />}
                            sx={{ fontSize: '12px', fontWeight: 600, color: '#2563eb', textTransform: 'none' }}
                          >
                            + Browse 100+ Approvers
                          </Button>
                        </Box>
                        <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', borderColor: '#e2e8f0' }}>
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
                              {formData.signOffApprovers.map((member, idx) => (
                                <ListItem
                                  key={member.id}
                                  divider={idx !== formData.signOffApprovers.length - 1}
                                  sx={{ py: 1.5, px: 2.5, '&:hover': { backgroundColor: '#f8fafc' } }}
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
                                        {member.role || member.email}
                                      </Typography>
                                    }
                                  />
                                  <ListItemSecondaryAction>
                                    <IconButton edge="end" size="small" onClick={() => handleRemoveApprover(member.id)} sx={{ color: '#94a3b8', '&:hover': { color: '#dc2626' } }}>
                                      <DeleteOutlineIcon className="css-120dh41-MuiSvgIcon-root" sx={{ fontSize: '18px !important' }} />
                                    </IconButton>
                                  </ListItemSecondaryAction>
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        </Paper>
                      </Grid>

                      {/* Sign-off Remarks */}
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                          Final Sign-Off Remarks
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          placeholder="Provide any concluding sign-off observations..."
                          value={formData.signOffRemarks}
                          onChange={handleChange('signOffRemarks')}
                          sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                        />
                      </Grid>

                      {/* Attach Final Sign-off Documents */}
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#334155', fontSize: '13px' }}>
                          Attach Final Sign-off Documents
                        </Typography>
                        <Paper
                          variant="outlined"
                          component="label"
                          sx={{
                            p: 3,
                            border: '2px dashed #93c5fd',
                            borderRadius: '12px',
                            backgroundColor: '#f8fafc',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: '#eff6ff', borderColor: '#2563eb' },
                          }}
                        >
                          <input type="file" multiple hidden onChange={handleFileUpload} />
                          <CloudUploadIcon sx={{ fontSize: 36, color: '#2563eb', mb: 1 }} />
                          <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500, fontSize: '13px' }}>
                            Drag closure sign-off files here or <span style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'underline' }}>Browse</span>
                          </Typography>
                        </Paper>

                        {/* File List */}
                        {formData.signOffAttachments.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Grid container spacing={1}>
                              {formData.signOffAttachments.map((file) => (
                                <Grid item xs={12} sm={6} key={file.id}>
                                  <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '8px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
                                      <InsertDriveFileIcon sx={{ color: '#2563eb' }} />
                                      <Typography variant="body2" noWrap sx={{ fontWeight: 600, fontSize: '13px' }}>{file.name}</Typography>
                                    </Box>
                                  </Paper>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            </Fade>

            {/* Bottom Action Footer */}
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

              {/* Step Counter */}
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b', fontSize: '14px' }}>
                <span style={{ color: '#2563eb', fontWeight: 700 }}>STEP {activeStep}</span> / STEP 5
              </Typography>

              {/* NEXT / SUBMIT Button */}
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={activeStep === 5 ? <SendIcon fontSize="small" /> : <ArrowForwardIcon fontSize="small" />}
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
                {activeStep === 5 ? 'SUBMIT' : 'NEXT'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar Toast Alert */}
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

      {/* Approver Selection Directory Modal */}
      <ApproverSelectionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        existingApprovers={formData.signOffApprovers}
        onAddApprovers={handleModalAddApprovers}
      />

      {/* Field Lookup Modal Popup */}
      <FieldLookupModal
        open={!!lookupModalConfig}
        onClose={() => setLookupModalConfig(null)}
        fieldName={lookupModalConfig?.fieldName}
        title={lookupModalConfig?.title}
        currentValue={lookupModalConfig ? formData[lookupModalConfig.fieldName] : ''}
        onSelect={(val) => {
          if (lookupModalConfig) {
            setFormData((prev) => ({ ...prev, [lookupModalConfig.fieldName]: val }));
            if (errors[lookupModalConfig.fieldName]) {
              setErrors((prev) => ({ ...prev, [lookupModalConfig.fieldName]: null }));
            }
          }
        }}
      />

      {/* Optional Rating Feedback Comment Popup */}
      <RatingCommentModal
        open={!!activeCommentParam}
        onClose={() => setActiveCommentParam(null)}
        parameterName={activeCommentParam?.label}
        initialComment={activeCommentParam ? formData.ratingComments[activeCommentParam.key] : ''}
        onSaveComment={(text) => {
          if (activeCommentParam) {
            handleSaveRatingComment(activeCommentParam.key, text);
          }
        }}
      />
    </Box>
  );
};

export default ITProjectClosurePage;
