import { useState, useRef } from 'react';
import { Typography, Popper, Paper, CircularProgress, IconButton, Fade, Box, Tooltip, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { InfoIcon, X } from 'lucide-react';
import fetchBookSummary from '../feature/gemini';

export default function BookTitleWithSummary({ title }) {
    const [language, setLanguage] = useState('Hindi');
    const [anchorEl, setAnchorEl] = useState(null);
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const cacheRef = useRef({});

    const fetchSummary = (lang) => {
        const cacheKey = `${title}-${lang}`;
        console.log("Cache",cacheKey)
        if (!cacheRef.current[cacheKey]) {
            setLoading(true);
            setError('');
            fetchBookSummary(title, lang)
                .then(text => {
                    cacheRef.current[cacheKey] = text;
                    setSummary(text);
                    setLoading(false);
                })
                .catch(() => {
                    setError('Failed to load summary.');
                    setLoading(false);
                });
        } else {
            setSummary(cacheRef.current[cacheKey]);
        }
    };

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
        if (!anchorEl) {
            fetchSummary(language);
        }
    };

    const handleLanguageChange = (_, newLang) => {
        if (newLang) {
            setLanguage(newLang);
            fetchSummary(newLang);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
        setError('');
        setLoading(false);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'summary-popper' : undefined;

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
                {title}
            </Typography>
            <Tooltip title="Click to generate AI summary" arrow>
                <IconButton aria-describedby={id} size="small" onClick={handleClick}>
                    <InfoIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Popper
                id={id}
                open={open}
                anchorEl={anchorEl}
                placement="right-start"
                transition
                disablePortal
                style={{ zIndex: 1300 }}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper
                            sx={{
                                p: 2,
                                maxWidth: 320,
                                maxHeight: 360,
                                overflowY: 'auto',
                                boxShadow: 4,
                                borderRadius: 2,
                                position: 'relative',
                                background: '#f5f5fa',
                            }}
                        >
                            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                <IconButton size="small" onClick={handleClose}>
                                    <X size={18} />
                                </IconButton>
                            </Box>

                            {/* Language Toggle */}
                            <Box display="flex" justifyContent="center" mb={1}>
                                <ToggleButtonGroup
                                    value={language}
                                    exclusive
                                    onChange={handleLanguageChange}
                                    size="small"
                                >
                                    <ToggleButton value="Hindi">हिंदी</ToggleButton>
                                    <ToggleButton value="English">Eng</ToggleButton>
                                </ToggleButtonGroup>
                            </Box>

                            {loading && (
                                <Box display="flex" justifyContent="center" alignItems="center" minHeight={60}>
                                    <CircularProgress size={24} sx={{ mr: 1 }} /> Generating summary...
                                </Box>
                            )}
                            {error && <Typography color="error">{error}</Typography>}
                            {!loading && !error && summary && (
                                <Typography variant="body2" sx={{ whiteSpace: 'normal', mt: 2 }}>
                                    {summary}
                                </Typography>
                            )}
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </div>
    );
}
