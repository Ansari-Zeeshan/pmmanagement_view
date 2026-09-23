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
  Radio,
  RadioGroup,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { MuiPremiumDatePicker } from '../../components/common/MuiPremiumDatePicker';
import { FieldLookupModal } from '../../components/common/FieldLookupModal';

const steps = [
  { id: 1, label: 'Project Information' },
  { id: 2, label: 'Project Scope' },
  { id: 3, label: 'Financial Information' },
  { id: 4, label: 'Cost Details' },
  { id: 5, label: 'Approvers' },
];

export const NewITProjectRequestPage = () => {
  const [activeStep, setActiveStep] = useState(1);
  const navigate = useNavigate();

  // Lookup modal state
  const [lookupModalConfig, setLookupModalConfig] = useState({
    open: false,
    fieldName: 'projectOwner',
    title: 'Search Project Owner',
  });

  // Form State
  const [formData, setFormData] = useState<any>({
    // Step 1: Project Info (Mandatory: requestId, projectName, program, clientName, projectOwner, assignedTo)
    requestId: '#REQ-2026-0918',
    projectName: '',
    program: '',
    category: '',
    priority: '',
    clientName: '',
    projectOwner: '',
    assignedTo: '',
    projectDescription: '',

    // Step 2: Project Scope (Mandatory: highLevelScope, businessJustification, expectedTimeline, businessBenefits, businessPriority, businessImpact, startDate, completionDate)
    highLevelScope: '',
    businessJustification: '',
    expectedTimeline: '',
    comments: '',
    businessBenefits: '',
    businessPriority: '',
    businessImpact: '',
    startDate: '',
    completionDate: '',
    expectedManDays: '',

    // Step 3: Financial Information (Mandatory: estimatedCost, changedApprovedBudget, actualCost)
    estimatedCost: '',
    changedApprovedBudget: '',
    actualCost: '',

    // Step 4: Cost Details
    softwareCost: '250,000 AED',
    hardwareCost: '100,000 AED',
    resourceCost: '120,000 AED',
    contingencyReserve: '30,000 AED',

    // Step 5: Approvers
    departmentLead: 'Ajmal Khan (Head of Digital Operations)',
    financeReviewer: 'Sarah Smith (VP Finance)',
    executiveSponsor: 'Claire Bure (Chief Technology Officer)',
    reviewNotes: '',
  });

  // Validation State
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  // Step 4: Cost Details State
  const [capexBudgeted, setCapexBudgeted] = useState('Yes');
  const [itemDescription, setItemDescription] = useState('');
  const [costType, setCostType] = useState('CapEx');
  const [activeYears, setActiveYears] = useState<number[]>([1, 2, 3, 4, 5]);
  const [yearInputs, setYearInputs] = useState<Record<number, string>>({ 1: '', 2: '', 3: '', 4: '', 5: '' });
  const [costItems, setCostItems] = useState<any[]>([]);
  const [isTableExpanded, setIsTableExpanded] = useState(true);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // Helper to parse strings like "10,000", "$10,000", "10000 AED" into numbers
  const parseAmount = (val) => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    const cleaned = String(val).replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  // Add extra year handler
  const handleAddExtraYear = () => {
    const nextYear = activeYears.length + 1;
    setActiveYears((prev) => [...prev, nextYear]);
    setYearInputs((prev) => ({ ...prev, [nextYear]: '' }));
    setSnackbarMsg(`Year ${nextYear} added to cost details.`);
    setSnackbarOpen(true);
  };

  // Open Reset Confirmation Dialog
  const handleOpenResetDialog = () => {
    setResetDialogOpen(true);
  };

  // Confirm Reset Action (called when user clicks "Yes, Reset" in warning modal)
  const confirmResetCostDetails = () => {
    setItemDescription('');
    setCostType('CapEx');
    setYearInputs({ 1: '', 2: '', 3: '', 4: '', 5: '' });
    setActiveYears([1, 2, 3, 4, 5]);
    setCostItems([]);
    setResetDialogOpen(false);
    setSnackbarMsg('All cost details data has been reset.');
    setSnackbarOpen(true);
  };

  // Add Item handler
  const handleAddCostItem = () => {
    if (!itemDescription.trim()) {
      setSnackbarMsg('Please enter an Items Description.');
      setSnackbarOpen(true);
      return;
    }

    const formattedYearCosts = {};
    activeYears.forEach((y) => {
      formattedYearCosts[y] = parseAmount(yearInputs[y]);
    });

    const newItem = {
      id: Date.now(),
      itemDescription: itemDescription.trim(),
      costType: costType || 'CapEx',
      yearCosts: formattedYearCosts,
    };

    setCostItems((prev) => [...prev, newItem]);
    setItemDescription('');
    setYearInputs(
      activeYears.reduce((acc, y) => ({ ...acc, [y]: '' }), {})
    );
    setSnackbarMsg('Cost item added successfully to table.');
    setSnackbarOpen(true);
  };

  // Delete Item handler
  const handleDeleteCostItem = (id) => {
    setCostItems((prev) => prev.filter((item) => item.id !== id));
    setSnackbarMsg('Cost item removed.');
    setSnackbarOpen(true);
  };

  // Compute column totals & grand total from costItems table
  const getYearTotal = (yearNum) => {
    return costItems.reduce((sum, item) => sum + (parseAmount(item.yearCosts[yearNum]) || 0), 0);
  };

  const getGrandTotal = () => {
    return activeYears.reduce((sum, y) => sum + getYearTotal(y), 0);
  };

  // Filter active table year columns dynamically (Year 1..3 by default, Year 4+ only if data is entered)
  const visibleTableYears = activeYears.filter((y) => {
    if (y <= 3) return true;
    const hasDataInItems = costItems.some((item) => parseAmount(item.yearCosts[y]) > 0);
    const hasDataInInput = parseAmount(yearInputs[y]) > 0;
    return hasDataInItems || hasDataInInput;
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Step Validation logic
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.requestId.trim()) newErrors.requestId = 'Request ID is required';
      if (!formData.projectName.trim()) newErrors.projectName = 'Project Name is required';
      if (!formData.program) newErrors.program = 'Program is required';
      if (!formData.clientName.trim()) newErrors.clientName = 'Client Name is required';
      if (!formData.projectOwner.trim()) newErrors.projectOwner = 'Project Owner is required';
      if (!formData.assignedTo.trim()) newErrors.assignedTo = 'Assigned To is required';
    } else if (step === 2) {
      if (!formData.highLevelScope.trim()) newErrors.highLevelScope = 'High Level Scope is required';
      if (!formData.businessJustification.trim()) newErrors.businessJustification = 'Business Justification is required';
      if (!formData.expectedTimeline.trim()) newErrors.expectedTimeline = 'Expected Timeline is required';
      if (!formData.businessBenefits) newErrors.businessBenefits = 'Business Benefits is required';
      if (!formData.businessPriority) newErrors.businessPriority = 'Business Priority is required';
      if (!formData.businessImpact) newErrors.businessImpact = 'Business Impact is required';
      if (!formData.startDate) newErrors.startDate = 'Start Date is required';
      if (!formData.completionDate) newErrors.completionDate = 'Completion Date is required';
    } else if (step === 3) {
      if (!formData.estimatedCost.trim()) newErrors.estimatedCost = 'Estimated Cost is required';
      if (!formData.changedApprovedBudget.trim()) newErrors.changedApprovedBudget = 'Changed Approved Budget is required';
      if (!formData.actualCost.trim()) newErrors.actualCost = 'Actual Cost is required';
    } else if (step === 4) {
      if (costItems.length === 0) {
        newErrors.costItems = 'Please add at least one Cost Details item.';
      }
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

    if (activeStep < 5) {
      setActiveStep((prev) => prev + 1);
    } else {
      setSnackbarMsg('New IT Project Request submitted successfully!');
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

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 3.5 }, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Grid container spacing={3.5} alignItems="stretch">
        {/* Left Side Premium Vertical Stepper Sidebar */}
        <Grid item xs={12} md={3.2}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
              height: '100%',
              minHeight: 520,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 3, color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Workflow Progression
            </Typography>

            {/* Connected Vertical Timeline Series Container */}
            <Box sx={{ position: 'relative', py: 0.5 }}>
              {steps.map((s, index) => {
                const isActive = activeStep === s.id;
                const isCompleted = activeStep > s.id;
                const isLast = index === steps.length - 1;

                return (
                  <Box key={s.id} sx={{ position: 'relative', mb: isLast ? 0 : 2.5 }}>
                    {/* Connecting Line Segment to Next Step */}
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

                      {/* Step Title Label - Crisp White in Active State */}
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

        {/* Right Side Premium Form Area */}
        <Grid item xs={12} md={8.8}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4.5 },
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              minHeight: 620,
            }}
          >
            <Box>
              {/* STEP 1: Project Information */}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5, fontSize: '2rem' }}>
                    Project Info
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', mb: 3.5, fontSize: '1.2rem' }}>
                    Provide the <span style={{ color: '#2563eb', fontWeight: 600 }}>Project Info</span> details
                  </Typography>

                  <Grid container spacing={2.5}>
                    {/* Request ID * */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Request ID <span style={{ color: '#dc2626' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Request Id *"
                        value={formData.requestId}
                        onChange={handleChange('requestId')}
                        error={Boolean(errors.requestId)}
                        helperText={errors.requestId}
                        sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '13px', borderRadius: '8px' } }}
                      />
                    </Grid>

                    {/* Project Name * */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Project Name <span style={{ color: '#dc2626' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Project Name *"
                        value={formData.projectName}
                        onChange={handleChange('projectName')}
                        error={Boolean(errors.projectName)}
                        helperText={errors.projectName}
                        sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '13px', borderRadius: '8px' } }}
                      />
                    </Grid>

                    {/* Program * */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Program <span style={{ color: '#dc2626' }}>*</span>
                      </Typography>
                      <FormControl fullWidth size="small" error={Boolean(errors.program)}>
                        <Select
                          displayEmpty
                          value={formData.program}
                          onChange={handleChange('program')}
                          sx={{ height: 40, fontSize: '13px', borderRadius: '8px' }}
                        >
                          <MenuItem value="" disabled sx={{ fontSize: '13px' }}>
                            <span style={{ color: '#94a3b8' }}>Program *</span>
                          </MenuItem>
                          <MenuItem value="EMAAR Digital Infrastructure" sx={{ fontSize: '13px' }}>EMAAR Digital Infrastructure</MenuItem>
                          <MenuItem value="Retail & Hospitality Modernization" sx={{ fontSize: '13px' }}>Retail & Hospitality Modernization</MenuItem>
                          <MenuItem value="Smart Building IoT & Automation" sx={{ fontSize: '13px' }}>Smart Building IoT & Automation</MenuItem>
                          <MenuItem value="Enterprise ERP & Cloud Migration" sx={{ fontSize: '13px' }}>Enterprise ERP & Cloud Migration</MenuItem>
                        </Select>
                        {errors.program && <FormHelperText sx={{ fontSize: '13px', fontWeight: 500 }}>{errors.program}</FormHelperText>}
                      </FormControl>
                    </Grid>

                    {/* Category */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Category
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          displayEmpty
                          value={formData.category}
                          onChange={handleChange('category')}
                          sx={{ height: 40, fontSize: '13px', borderRadius: '8px' }}
                        >
                          <MenuItem value="" disabled sx={{ fontSize: '13px' }}>
                            <span style={{ color: '#94a3b8' }}>Select</span>
                          </MenuItem>
                          <MenuItem value="Software Development" sx={{ fontSize: '13px' }}>Software Development</MenuItem>
                          <MenuItem value="Cloud & Infrastructure" sx={{ fontSize: '13px' }}>Cloud & Infrastructure</MenuItem>
                          <MenuItem value="Data Analytics & AI" sx={{ fontSize: '13px' }}>Data Analytics & AI</MenuItem>
                          <MenuItem value="Security & Compliance" sx={{ fontSize: '13px' }}>Security & Compliance</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Priority */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Priority
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          displayEmpty
                          value={formData.priority}
                          onChange={handleChange('priority')}
                          sx={{ height: 40, fontSize: '13px', borderRadius: '8px' }}
                        >
                          <MenuItem value="" disabled sx={{ fontSize: '13px' }}>
                            <span style={{ color: '#94a3b8' }}>Select The Priority</span>
                          </MenuItem>
                          <MenuItem value="Critical" sx={{ fontSize: '13px' }}>Critical</MenuItem>
                          <MenuItem value="High" sx={{ fontSize: '13px' }}>High</MenuItem>
                          <MenuItem value="Medium" sx={{ fontSize: '13px' }}>Medium</MenuItem>
                          <MenuItem value="Low" sx={{ fontSize: '13px' }}>Low</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Client Name * */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Client Name <span style={{ color: '#dc2626' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Client Name *"
                        value={formData.clientName}
                        onChange={handleChange('clientName')}
                        error={Boolean(errors.clientName)}
                        helperText={errors.clientName}
                        sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '13px', borderRadius: '8px' } }}
                      />
                    </Grid>

                    {/* Project Owner * */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Project Owner <span style={{ color: '#dc2626' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Search Project Owner"
                        value={formData.projectOwner}
                        onChange={handleChange('projectOwner')}
                        error={Boolean(errors.projectOwner)}
                        helperText={errors.projectOwner}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Tooltip title="Search Project Owner">
                                <IconButton
                                  size="small"
                                  onClick={() => setLookupModalConfig({ open: true, fieldName: 'projectOwner', title: 'Search Project Owner' })}
                                  sx={{ color: '#64748b', '&:hover': { color: '#2563eb' } }}
                                >
                                  <SearchIcon className="css-oclf15-MuiSvgIcon-root" sx={{ fontSize: '16px !important' }} />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '13px', borderRadius: '8px' } }}
                      />
                    </Grid>

                    {/* Assigned To * */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Assigned To <span style={{ color: '#dc2626' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Search Assigned To"
                        value={formData.assignedTo}
                        onChange={handleChange('assignedTo')}
                        error={Boolean(errors.assignedTo)}
                        helperText={errors.assignedTo}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Tooltip title="Search Assigned To">
                                <IconButton
                                  size="small"
                                  onClick={() => setLookupModalConfig({ open: true, fieldName: 'assignedTo', title: 'Search Assigned To' })}
                                  sx={{ color: '#64748b', '&:hover': { color: '#2563eb' } }}
                                >
                                  <SearchIcon className="css-oclf15-MuiSvgIcon-root" sx={{ fontSize: '16px !important' }} />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '13px', borderRadius: '8px' } }}
                      />
                    </Grid>

                    {/* Project Description */}
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Project Description
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3.5}
                        placeholder="Project Description"
                        value={formData.projectDescription}
                        onChange={handleChange('projectDescription')}
                        sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px' } }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* STEP 2: Project Scope */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5, fontSize: '2rem' }}>
                    Project Scope
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', mb: 3.5, fontSize: '1.2rem' }}>
                    Provide the <span style={{ color: '#2563eb', fontWeight: 600 }}>project scope</span> details
                  </Typography>

                  <Grid container spacing={2.5}>
                    {/* High Level Scope * */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        High Level Scope <span style={{ color: '#dc2626' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3.5}
                        placeholder="Description"
                        value={formData.highLevelScope}
                        onChange={handleChange('highLevelScope')}
                        error={Boolean(errors.highLevelScope)}
                        helperText={errors.highLevelScope}
                        sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px' } }}
                      />
                    </Grid>

                    {/* Business Justification * */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Business Justification <span style={{ color: '#dc2626' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3.5}
                        placeholder="Description"
                        value={formData.businessJustification}
                        onChange={handleChange('businessJustification')}
                        error={Boolean(errors.businessJustification)}
                        helperText={errors.businessJustification}
                        sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px' } }}
                      />
                    </Grid>

                    {/* Expected execution Timeline and Phases * */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Expected execution Timeline and Phases <span style={{ color: '#dc2626' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3.5}
                        placeholder="Description"
                        value={formData.expectedTimeline}
                        onChange={handleChange('expectedTimeline')}
                        error={Boolean(errors.expectedTimeline)}
                        helperText={errors.expectedTimeline}
                        sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px' } }}
                      />
                    </Grid>

                    {/* Comments */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Comments
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3.5}
                        placeholder="Description"
                        value={formData.comments}
                        onChange={handleChange('comments')}
                        sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px' } }}
                      />
                    </Grid>

                    {/* Business Benefits * */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Business Benefits <span style={{ color: '#dc2626' }}>*</span>
                      </Typography>
                      <FormControl fullWidth size="small" error={Boolean(errors.businessBenefits)}>
                        <Select
                          displayEmpty
                          value={formData.businessBenefits}
                          onChange={handleChange('businessBenefits')}
                          sx={{ height: 40, fontSize: '13px', borderRadius: '8px' }}
                        >
                          <MenuItem value="" disabled sx={{ fontSize: '13px' }}>
                            <span style={{ color: '#94a3b8' }}>Select</span>
                          </MenuItem>
                          <MenuItem value="Revenue Growth" sx={{ fontSize: '13px' }}>Revenue Growth</MenuItem>
                          <MenuItem value="Operational Efficiency" sx={{ fontSize: '13px' }}>Operational Efficiency</MenuItem>
                          <MenuItem value="Customer Experience" sx={{ fontSize: '13px' }}>Customer Experience</MenuItem>
                          <MenuItem value="Regulatory Compliance" sx={{ fontSize: '13px' }}>Regulatory Compliance</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Business Priority * */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Business Priority <span style={{ color: '#dc2626' }}>*</span>
                      </Typography>
                      <FormControl fullWidth size="small" error={Boolean(errors.businessPriority)}>
                        <Select
                          displayEmpty
                          value={formData.businessPriority}
                          onChange={handleChange('businessPriority')}
                          sx={{ height: 40, fontSize: '13px', borderRadius: '8px' }}
                        >
                          <MenuItem value="" disabled sx={{ fontSize: '13px' }}>
                            <span style={{ color: '#94a3b8' }}>Select</span>
                          </MenuItem>
                          <MenuItem value="High Priority" sx={{ fontSize: '13px' }}>High Priority</MenuItem>
                          <MenuItem value="Medium Priority" sx={{ fontSize: '13px' }}>Medium Priority</MenuItem>
                          <MenuItem value="Low Priority" sx={{ fontSize: '13px' }}>Low Priority</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Business Impact * */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Business Impact <span style={{ color: '#dc2626' }}>*</span>
                      </Typography>
                      <FormControl fullWidth size="small" error={Boolean(errors.businessImpact)}>
                        <Select
                          displayEmpty
                          value={formData.businessImpact}
                          onChange={handleChange('businessImpact')}
                          sx={{ height: 40, fontSize: '13px', borderRadius: '8px' }}
                        >
                          <MenuItem value="" disabled sx={{ fontSize: '13px' }}>
                            <span style={{ color: '#94a3b8' }}>Select The Priority</span>
                          </MenuItem>
                          <MenuItem value="Enterprise Wide" sx={{ fontSize: '13px' }}>Enterprise Wide</MenuItem>
                          <MenuItem value="Departmental" sx={{ fontSize: '13px' }}>Departmental</MenuItem>
                          <MenuItem value="Unit Specific" sx={{ fontSize: '13px' }}>Unit Specific</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Planned Project Start Date * (Material UI Premium Calendar Picker) */}
                    <Grid item xs={12} sm={6}>
                      <MuiPremiumDatePicker
                        label="Planned Project Start Date"
                        required
                        value={formData.startDate}
                        onChange={(val) => {
                          setFormData((prev) => ({ ...prev, startDate: val }));
                          if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: null }));
                        }}
                        error={Boolean(errors.startDate)}
                        helperText={errors.startDate}
                        placeholder="mm/dd/yyyy"
                      />
                    </Grid>

                    {/* Expected Project Completion Date * (Material UI Premium Calendar Picker) */}
                    <Grid item xs={12} sm={6}>
                      <MuiPremiumDatePicker
                        label="Expected Project Completion Date"
                        required
                        value={formData.completionDate}
                        onChange={(val) => {
                          setFormData((prev) => ({ ...prev, completionDate: val }));
                          if (errors.completionDate) setErrors((prev) => ({ ...prev, completionDate: null }));
                        }}
                        error={Boolean(errors.completionDate)}
                        helperText={errors.completionDate}
                        placeholder="mm/dd/yyyy"
                      />
                    </Grid>

                    {/* Expected Man Days (Material UI Premium Calendar Picker) */}
                    <Grid item xs={12} sm={6}>
                      <MuiPremiumDatePicker
                        label="Expected Man Days"
                        value={formData.expectedManDays}
                        onChange={(val) => {
                          setFormData((prev) => ({ ...prev, expectedManDays: val }));
                        }}
                        placeholder="mm/dd/yyyy"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* STEP 3: Financial Information */}
              {activeStep === 3 && (
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5, fontSize: '2rem' }}>
                    Financial Information
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', mb: 3.5, fontSize: '1.2rem' }}>
                    Provide the <span style={{ color: '#2563eb', fontWeight: 600 }}>financial information</span>
                  </Typography>

                  <Grid container spacing={2.5}>
                    {/* Estimated Cost * */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Estimated Cost <span style={{ color: '#dc2626' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Enter Amount"
                        value={formData.estimatedCost}
                        onChange={handleChange('estimatedCost')}
                        error={Boolean(errors.estimatedCost)}
                        helperText={errors.estimatedCost}
                        sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                      />
                    </Grid>

                    {/* Changed Approved Budget * */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Changed Approved Budget <span style={{ color: '#dc2626' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Enter Amount"
                        value={formData.changedApprovedBudget}
                        onChange={handleChange('changedApprovedBudget')}
                        error={Boolean(errors.changedApprovedBudget)}
                        helperText={errors.changedApprovedBudget}
                        sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                      />
                    </Grid>

                    {/* Actual Cost * */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Actual Cost <span style={{ color: '#dc2626' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Enter Amount"
                        value={formData.actualCost}
                        onChange={handleChange('actualCost')}
                        error={Boolean(errors.actualCost)}
                        helperText={errors.actualCost}
                        sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* STEP 4: Cost Details */}
              {activeStep === 4 && (
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5, fontSize: '2rem' }}>
                    Cost Details
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', mb: 3.5, fontSize: '1.2rem' }}>
                    Provide the <span style={{ color: '#2563eb', fontWeight: 600 }}>cost details</span> information
                  </Typography>

                  {/* Capex Budgeted Radio */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                      Capex Budgeted <span style={{ color: '#dc2626' }}>*</span>
                    </Typography>
                    <RadioGroup
                      row
                      value={capexBudgeted}
                      onChange={(e) => setCapexBudgeted(e.target.value)}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio size="small" sx={{ color: '#2563eb', '&.Mui-checked': { color: '#2563eb' } }} />}
                        label={<Typography sx={{ fontSize: '13px', color: '#334155' }}>Yes</Typography>}
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio size="small" sx={{ color: '#2563eb', '&.Mui-checked': { color: '#2563eb' } }} />}
                        label={<Typography sx={{ fontSize: '13px', color: '#334155' }}>No</Typography>}
                      />
                    </RadioGroup>
                  </Box>

                  {/* Inputs Grid */}
                  <Grid container spacing={2.5}>
                    {/* Item Description */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Items Description <span style={{ color: '#dc2626' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Enter Amount"
                        value={itemDescription}
                        onChange={(e) => setItemDescription(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                      />
                    </Grid>

                    {/* Year Costs inputs dynamically */}
                    {activeYears.map((yearNum) => (
                      <Grid item xs={12} sm={6} key={yearNum}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                          Year {yearNum} (Cost AED) <span style={{ color: '#dc2626' }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Enter Amount"
                          value={yearInputs[yearNum] || ''}
                          onChange={(e) => setYearInputs((prev) => ({ ...prev, [yearNum]: e.target.value }))}
                          sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '13px', borderRadius: '8px', backgroundColor: '#ffffff' } }}
                        />
                      </Grid>
                    ))}
                  </Grid>

                  {/* Action Buttons: Add Extra Year, Reset, Add */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3, mb: 4, flexWrap: 'wrap', gap: 2 }}>
                    <Button
                      variant="text"
                      size="small"
                      onClick={handleAddExtraYear}
                      startIcon={<AddIcon fontSize="small" />}
                      sx={{
                        color: '#2563eb',
                        fontWeight: 600,
                        fontSize: '13px',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#eff6ff' },
                      }}
                    >
                      + Add Extra Year
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {/* RESET Button */}
                      <Button
                        variant="outlined"
                        onClick={handleOpenResetDialog}
                        startIcon={<CancelIcon fontSize="small" sx={{ color: '#2563eb' }} />}
                        sx={{
                          borderColor: '#2563eb',
                          color: '#2563eb',
                          fontWeight: 600,
                          fontSize: '13px',
                          px: 3.5,
                          height: 38,
                          borderRadius: '8px',
                          textTransform: 'none',
                          '&:hover': { borderColor: '#1d4ed8', backgroundColor: '#eff6ff' },
                        }}
                      >
                        Reset
                      </Button>

                      {/* ADD Button */}
                      <Button
                        variant="contained"
                        onClick={handleAddCostItem}
                        startIcon={<AddIcon fontSize="small" />}
                        sx={{
                          backgroundColor: '#2563eb',
                          '&:hover': { backgroundColor: '#1d4ed8' },
                          fontWeight: 600,
                          fontSize: '13px',
                          px: 4,
                          height: 38,
                          borderRadius: '8px',
                          textTransform: 'none',
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                        }}
                      >
                        Add
                      </Button>
                    </Box>
                  </Box>

                  {/* Estimated budgeted cost summary & timeline indicator */}
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontStyle: 'italic', fontWeight: 600, color: '#334155', fontSize: '14px', mb: 2 }}>
                      Estimated budgeted cost AED {getGrandTotal() || 12}
                    </Typography>

                    {/* Timeline connected series */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', px: 2 }}>
                      {/* Connecting line */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '6px',
                          left: '40px',
                          right: '40px',
                          height: '2px',
                          borderTop: '2px dashed #93c5fd',
                          zIndex: 1,
                        }}
                      />
                      {activeYears.map((y) => {
                        const yearCostVal = getYearTotal(y) || (Number(yearInputs[y]) || 0);
                        const hasValue = yearCostVal > 0;

                        const tooltipTitle = hasValue ? (
                          <Box sx={{ p: 0.5, textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: '#93c5fd', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Year {y} Cost
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '13px' }}>
                              {yearCostVal.toLocaleString()} AED
                            </Typography>
                          </Box>
                        ) : null;

                        return (
                          <Box key={y} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                            {hasValue ? (
                              <Tooltip
                                title={tooltipTitle}
                                arrow
                                placement="top"
                                slotProps={{
                                  popper: {
                                    sx: {
                                      '& .MuiTooltip-tooltip': {
                                        backgroundColor: '#0f172a',
                                        color: '#ffffff',
                                        borderRadius: '8px',
                                        p: 1.25,
                                        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.35), 0 8px 10px -6px rgba(15, 23, 42, 0.2)',
                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                      },
                                      '& .MuiTooltip-arrow': {
                                        color: '#0f172a',
                                      },
                                    },
                                  },
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    backgroundColor: '#2563eb',
                                    border: '2px solid #ffffff',
                                    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.3), 0 4px 10px rgba(37, 99, 235, 0.4)',
                                    cursor: 'pointer',
                                    mb: 1,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      transform: 'scale(1.3)',
                                      boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.4), 0 6px 16px rgba(37, 99, 235, 0.5)',
                                    },
                                  }}
                                />
                              </Tooltip>
                            ) : (
                              <Box
                                sx={{
                                  width: 14,
                                  height: 14,
                                  borderRadius: '50%',
                                  backgroundColor: '#cbd5e1',
                                  border: '2px solid #ffffff',
                                  boxShadow: '0 0 0 2px #e2e8f0',
                                  mb: 1,
                                }}
                              />
                            )}
                            <Typography variant="caption" sx={{ color: hasValue ? '#1e3a8a' : '#64748b', fontWeight: hasValue ? 700 : 500, fontSize: '12px' }}>
                              {y} Year Cost
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>

                  {/* Expandable / Collapsable Data Table Container */}
                  <Paper
                    variant="outlined"
                    sx={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      borderColor: '#bfdbfe',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.06)',
                    }}
                  >
                    {/* Table Header Bar with Expand / Collapse Toggle */}
                    <Box
                      onClick={() => setIsTableExpanded((prev) => !prev)}
                      sx={{
                        px: 2.5,
                        py: 1.5,
                        backgroundColor: '#eff6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isTableExpanded ? '1px solid #dbeafe' : 'none',
                        '&:hover': { backgroundColor: '#dbeafe' },
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e3a8a', fontSize: '14px' }}>
                        Cost Details Table ({costItems.length} Items)
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#2563eb', fontSize: '12px' }}>
                          {isTableExpanded ? 'Collapse' : 'Expand'}
                        </Typography>
                        <IconButton size="small" sx={{ color: '#2563eb' }}>
                          {isTableExpanded ? <ExpandLessIcon sx={{ fontSize: 22 }} /> : <ExpandMoreIcon sx={{ fontSize: 22 }} />}
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Collapsible Content */}
                    <Collapse in={isTableExpanded}>
                      <TableContainer sx={{ overflowX: 'auto', p: 1.5 }}>
                        <Table
                          size="small"
                          sx={{
                            borderCollapse: 'separate',
                            borderSpacing: '0 6px',
                          }}
                        >
                          <TableHead>
                            <TableRow sx={{ '& th': { borderBottom: 'none', pb: 1 } }}>
                              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '12px' }}>
                                Item Description
                              </TableCell>
                              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '12px' }}>
                                Cost Type
                              </TableCell>
                              {visibleTableYears.map((y) => (
                                <TableCell key={y} sx={{ fontWeight: 700, color: '#475569', fontSize: '12px' }}>
                                  Year {y} Cost
                                </TableCell>
                              ))}
                              <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', fontSize: '12px' }}>
                                Action
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {costItems.map((item) => (
                              <TableRow
                                key={item.id}
                                sx={{
                                  backgroundColor: '#ffffff',
                                  boxShadow: '0 1px 4px rgba(15, 23, 42, 0.05)',
                                  transition: 'all 0.15s ease-in-out',
                                  '&:hover': {
                                    backgroundColor: '#f8fafc',
                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)',
                                    transform: 'translateY(-1px)',
                                  },
                                  '& td': {
                                    borderTop: '1px solid #e2e8f0',
                                    borderBottom: '1px solid #e2e8f0',
                                    py: 1.25,
                                  },
                                  '& td:first-of-type': {
                                    borderLeft: '1px solid #e2e8f0',
                                    borderTopLeftRadius: '8px',
                                    borderBottomLeftRadius: '8px',
                                  },
                                  '& td:last-of-type': {
                                    borderRight: '1px solid #e2e8f0',
                                    borderTopRightRadius: '8px',
                                    borderBottomRightRadius: '8px',
                                  },
                                }}
                              >
                                <TableCell sx={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>
                                  {item.itemDescription}
                                </TableCell>
                                <TableCell sx={{ fontSize: '13px' }}>
                                  <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: '6px', fontWeight: 600, fontSize: '11px' }}>
                                    {item.costType}
                                  </span>
                                </TableCell>
                                {visibleTableYears.map((y) => (
                                  <TableCell key={y} sx={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                                    {parseAmount(item.yearCosts[y]) > 0 ? `${parseAmount(item.yearCosts[y]).toLocaleString()} AED` : '0 AED'}
                                  </TableCell>
                                ))}
                                <TableCell align="center">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteCostItem(item.id)}
                                    sx={{ color: '#94a3b8', '&:hover': { color: '#dc2626', backgroundColor: '#fef2f2' } }}
                                  >
                                    <DeleteOutlineIcon className="css-120dh41-MuiSvgIcon-root" sx={{ fontSize: '18px !important' }} />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}

                            {/* Total Row */}
                            {costItems.length > 0 && (
                              <TableRow
                                sx={{
                                  backgroundColor: '#f8fafc',
                                  '& td': {
                                    borderTop: '2px solid #cbd5e1',
                                    borderBottom: '2px solid #cbd5e1',
                                    py: 1.5,
                                  },
                                  '& td:first-of-type': {
                                    borderLeft: '2px solid #cbd5e1',
                                    borderTopLeftRadius: '8px',
                                    borderBottomLeftRadius: '8px',
                                  },
                                  '& td:last-of-type': {
                                    borderRight: '2px solid #cbd5e1',
                                    borderTopRightRadius: '8px',
                                    borderBottomRightRadius: '8px',
                                  },
                                }}
                              >
                                <TableCell sx={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>
                                  Total
                                </TableCell>
                                <TableCell />
                                {visibleTableYears.map((y) => (
                                  <TableCell key={y} sx={{ fontWeight: 800, fontSize: '13px', color: '#2563eb' }}>
                                    {getYearTotal(y) > 0 ? `${getYearTotal(y).toLocaleString()} AED` : '0 AED'}
                                  </TableCell>
                                ))}
                                <TableCell />
                              </TableRow>
                            )}

                            {costItems.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={visibleTableYears.length + 3} align="center" sx={{ py: 3, color: '#64748b', fontSize: '13px' }}>
                                  No cost items added yet. Fill in details above and click "+ Add".
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      {/* Footer Total */}
                      <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                          Toc: {getGrandTotal().toLocaleString()} AED
                        </Typography>
                      </Box>
                    </Collapse>
                  </Paper>
                </Box>
              )}

              {/* STEP 5: Approvers */}
              {activeStep === 5 && (
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5, fontSize: '2rem' }}>
                    Approvers
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', mb: 3.5, fontSize: '1.2rem' }}>
                    Review and confirm <span style={{ color: '#2563eb', fontWeight: 600 }}>approval stakeholders</span>
                  </Typography>

                  <Grid container spacing={2.5}>
                    {/* Department Lead */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Department Lead
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Department Lead"
                        value={formData.departmentLead}
                        onChange={handleChange('departmentLead')}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Tooltip title="Search Department Lead">
                                <IconButton
                                  size="small"
                                  onClick={() => setLookupModalConfig({ open: true, fieldName: 'departmentLead', title: 'Search Department Lead' })}
                                  sx={{ color: '#64748b', '&:hover': { color: '#2563eb' } }}
                                >
                                  <SearchIcon className="css-oclf15-MuiSvgIcon-root" sx={{ fontSize: '16px !important' }} />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '13px', borderRadius: '8px' } }}
                      />
                    </Grid>

                    {/* Finance Reviewer */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Finance Reviewer
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Finance Reviewer"
                        value={formData.financeReviewer}
                        onChange={handleChange('financeReviewer')}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Tooltip title="Search Finance Reviewer">
                                <IconButton
                                  size="small"
                                  onClick={() => setLookupModalConfig({ open: true, fieldName: 'financeReviewer', title: 'Search Finance Reviewer' })}
                                  sx={{ color: '#64748b', '&:hover': { color: '#2563eb' } }}
                                >
                                  <SearchIcon className="css-oclf15-MuiSvgIcon-root" sx={{ fontSize: '16px !important' }} />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '13px', borderRadius: '8px' } }}
                      />
                    </Grid>

                    {/* Executive Sponsor */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Executive Sponsor
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Executive Sponsor"
                        value={formData.executiveSponsor}
                        onChange={handleChange('executiveSponsor')}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Tooltip title="Search Executive Sponsor">
                                <IconButton
                                  size="small"
                                  onClick={() => setLookupModalConfig({ open: true, fieldName: 'executiveSponsor', title: 'Search Executive Sponsor' })}
                                  sx={{ color: '#64748b', '&:hover': { color: '#2563eb' } }}
                                >
                                  <SearchIcon className="css-oclf15-MuiSvgIcon-root" sx={{ fontSize: '16px !important' }} />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '13px', borderRadius: '8px' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
                        Additional Review Notes
                      </Typography>
                      <TextField fullWidth multiline rows={3.5} placeholder="Add any notes for approvers..." value={formData.reviewNotes} onChange={handleChange('reviewNotes')} sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px' } }} />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>

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
                {activeStep === 5 ? 'SUBMIT REQUEST' : 'NEXT'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Reset Confirmation Warning Dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 1,
            maxWidth: '420px',
            boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.2), 0 10px 10px -5px rgba(15, 23, 42, 0.1)',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              backgroundColor: '#fffbeb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d97706',
              border: '1px solid #fef3c7',
            }}
          >
            <WarningAmberIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>
              Reset Cost Details?
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12px' }}>
              Warning Action
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '13px', color: '#475569', mt: 0.5 }}>
            Are you sure you want to reset all cost details? All entered items and year breakdowns in the table will be permanently cleared.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, justifyContent: 'flex-end', gap: 1 }}>
          <Button
            onClick={() => setResetDialogOpen(false)}
            variant="outlined"
            sx={{
              borderColor: '#cbd5e1',
              color: '#475569',
              fontWeight: 600,
              fontSize: '13px',
              borderRadius: '8px',
              px: 2.5,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#f8fafc', borderColor: '#94a3b8' },
            }}
          >
            No, Cancel
          </Button>
          <Button
            onClick={confirmResetCostDetails}
            variant="contained"
            color="error"
            sx={{
              backgroundColor: '#dc2626',
              fontWeight: 700,
              fontSize: '13px',
              borderRadius: '8px',
              px: 3,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
              '&:hover': { backgroundColor: '#b91c1c' },
            }}
          >
            Yes, Reset
          </Button>
        </DialogActions>
      </Dialog>

      {/* Field Lookup Modal */}
      <FieldLookupModal
        open={lookupModalConfig.open}
        onClose={() => setLookupModalConfig((prev) => ({ ...prev, open: false }))}
        fieldName={lookupModalConfig.fieldName}
        title={lookupModalConfig.title}
        currentValue={formData[lookupModalConfig.fieldName] || ''}
        onSelect={(val) => setFormData((prev) => ({ ...prev, [lookupModalConfig.fieldName]: val }))}
      />

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
    </Box>
  );
};

export default NewITProjectRequestPage;
