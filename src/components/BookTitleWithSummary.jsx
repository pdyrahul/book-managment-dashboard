import { useState } from 'react';
import {
    Typography, Popper, Paper, CircularProgress, IconButton,
    Fade, Box, Tooltip, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { InfoIcon, X } from 'lucide-react';
import fetchBookSummary from '../feature/gemini';
import { useQuery } from 'react-query';

export default function BookTitleWithSummary({ title }) {
    const [language, setLanguage] = useState('Hindi');
    const [popupAnchor, setPopupAnchor] = useState(null);
    const open = Boolean(popupAnchor);
    const id = open ? 'summary-popper' : null;
    const { data: summary, isLoading, error } = useQuery(
        ['summary', title, language],
        () => fetchBookSummary(title, language),
        {
            enabled: open,
            staleTime: 5 * 60 * 1000,
        }
    );

    const handleClick = (event) => {
        if (popupAnchor) {
            setPopupAnchor(null);
        } else {
            setPopupAnchor(event.currentTarget);
        }
    };

    const handleLanguageChange = (_, newLang) => {
        if (newLang) {
            setLanguage(newLang);
        }
    };

    const handleClose = () => {
        setPopupAnchor(null);
    };



    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 1 }}>{title}</Typography>

            <Tooltip title="Click to generate AI summary" arrow>
                <IconButton aria-describedby={id} size="small" onClick={handleClick}>
                    <InfoIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Popper id={id} open={open} anchorEl={popupAnchor} placement="right-start" transition disablePortal style={{ zIndex: 1300 }}>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper sx={{ p: 2, maxWidth: 320, maxHeight: 360, overflowY: 'auto',  boxShadow: 4, borderRadius: 2, position: 'relative', background: '#f5f5fa' }}>
                            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                <IconButton size="small" onClick={handleClose}><X size={18} /></IconButton>
                            </Box>

                            <Box display="flex" justifyContent="center" mb={1} >
                                <ToggleButtonGroup value={language} exclusive onChange={handleLanguageChange} size="small">
                                    <ToggleButton value="Hindi">HIN</ToggleButton>
                                    <ToggleButton value="English">ENG</ToggleButton>
                                </ToggleButtonGroup>
                            </Box>

                            {isLoading && (
                                <Box display="flex" justifyContent="center" alignItems="center" minHeight={60}>
                                    <CircularProgress size={24} sx={{ mr: 1 }} /> Generating summary...
                                </Box>
                            )}

                            {error && <Typography color="error">Failed to load summary</Typography>}

                            {!isLoading && !error && summary && (
                                <Typography variant="body2" sx={{ whiteSpace: 'normal', mt: 2, lineHeight:1.7 }}>{summary}</Typography>
                            )}
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </div>
    );
}
