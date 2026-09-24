import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Paper, Tab, Tabs } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

const COLORS = ['#2563eb', '#f59e0b', '#0284c7', '#0f172a'];

export const DigitalSignaturePad = ({ label = 'Digital Signature', onSaveSignature }) => {
  const [mode, setMode] = useState('draw'); // 'draw' | 'upload'
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#0f172a');
  const [hasSignature, setHasSignature] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (mode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width || 400;
      canvas.height = 140;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = selectedColor;
    }
  }, [mode]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
    setIsSaved(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.strokeStyle = selectedColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasSignature(false);
    setIsSaved(false);
  };

  const handleSave = () => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (canvas && hasSignature) {
        const dataUrl = canvas.toDataURL('image/png');
        setIsSaved(true);
        if (onSaveSignature) onSaveSignature(dataUrl);
      }
    } else if (uploadedImage) {
      setIsSaved(true);
      if (onSaveSignature) onSaveSignature(uploadedImage);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target.result);
      setHasSignature(true);
      setIsSaved(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#334155', fontSize: '13px' }}>
        {label}
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: '12px',
          borderColor: isSaved ? '#16a34a' : '#e2e8f0',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Toggle Bar: Draw vs Upload */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            py: 1,
            px: 2,
            borderBottom: '1px solid #f1f5f9',
            backgroundColor: '#fafafa',
          }}
        >
          <Button
            size="small"
            onClick={() => setMode('draw')}
            startIcon={<EditIcon style={{ fontSize: 16 }} />}
            sx={{
              fontWeight: mode === 'draw' ? 700 : 500,
              fontSize: '12.5px',
              color: mode === 'draw' ? '#2563eb' : '#64748b',
              textTransform: 'none',
              borderRadius: '6px',
              px: 2,
              backgroundColor: mode === 'draw' ? '#eff6ff' : 'transparent',
            }}
          >
            Draw
          </Button>

          <Button
            size="small"
            component="label"
            onClick={() => setMode('upload')}
            startIcon={<CloudUploadIcon style={{ fontSize: 16 }} />}
            sx={{
              fontWeight: mode === 'upload' ? 700 : 500,
              fontSize: '12.5px',
              color: mode === 'upload' ? '#2563eb' : '#64748b',
              textTransform: 'none',
              borderRadius: '6px',
              px: 2,
              backgroundColor: mode === 'upload' ? '#eff6ff' : 'transparent',
            }}
          >
            Upload
          </Button>
        </Box>

        {/* Content Area */}
        <Box sx={{ p: 1.5, position: 'relative', minHeight: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {mode === 'draw' ? (
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{
                width: '100%',
                height: 130,
                cursor: 'crosshair',
                touchAction: 'none',
              }}
            />
          ) : (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              {uploadedImage ? (
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <img src={uploadedImage} alt="Uploaded Signature" style={{ maxHeight: 110, maxWidth: '100%', objectFit: 'contain' }} />
                  <IconButton
                    size="small"
                    onClick={() => {
                      setUploadedImage(null);
                      setHasSignature(false);
                      setIsSaved(false);
                    }}
                    sx={{ position: 'absolute', top: -10, right: -10, bgcolor: '#ffffff', boxShadow: 1, '&:hover': { color: '#dc2626' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Button variant="outlined" component="label" size="small" sx={{ borderColor: '#cbd5e1', color: '#64748b', textTransform: 'none', fontSize: '12px' }}>
                  Browse Signature Image
                  <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                </Button>
              )}
            </Box>
          )}
        </Box>

        {/* Footer Bar: Color Palette & Controls */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1,
            px: 2,
            borderTop: '1px solid #f1f5f9',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Color palette (only for draw mode) */}
          {mode === 'draw' ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {COLORS.map((color) => (
                <Box
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    if (canvasRef.current) {
                      canvasRef.current.getContext('2d').strokeStyle = color;
                    }
                  }}
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    backgroundColor: color,
                    cursor: 'pointer',
                    transform: selectedColor === color ? 'scale(1.25)' : 'scale(1)',
                    boxShadow: selectedColor === color ? '0 0 0 2px #ffffff, 0 0 0 3px ' + color : 'none',
                    transition: 'all 0.15s ease',
                  }}
                />
              ))}
            </Box>
          ) : (
            <Box />
          )}

          {/* Action Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isSaved && (
              <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CheckIcon style={{ fontSize: 14 }} /> Saved
              </Typography>
            )}
            <Typography
              variant="caption"
              onClick={handleSave}
              sx={{
                fontWeight: 600,
                color: hasSignature ? '#2563eb' : '#94a3b8',
                cursor: hasSignature ? 'pointer' : 'default',
                fontSize: '12px',
                '&:hover': { textDecoration: hasSignature ? 'underline' : 'none' },
              }}
            >
              Save
            </Typography>
            <Typography
              variant="caption"
              onClick={handleClear}
              sx={{
                fontWeight: 600,
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '12px',
                '&:hover': { textDecoration: 'underline', color: '#dc2626' },
              }}
            >
              Clear
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
