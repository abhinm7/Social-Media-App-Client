'use client';

import { Box, Paper, Typography } from "@mui/material";
import { motion } from 'framer-motion';

export default function AuthLayout({ children, subtitle }: { children: React.ReactNode, subtitle: string }) {
    const sentence = { hidden: { opacity: 1 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const letter = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } };

    return (
        <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper
                elevation={3}
                sx={{
                    maxWidth: '380px',
                    minHeight: '420px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 3,
                    borderRadius: 5,
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Typography component="h1" variant="h3" sx={{ mb: 0.5, fontWeight: 'bold', color: 'primary.main', display: 'flex', fontFamily: 'var(--font-bitcount)' }}>
                    <motion.span variants={sentence} initial="hidden" animate="visible">
                        {'BLOOM'.split('').map((char, index) => (
                            <motion.span key={char + '-' + index} variants={letter}>{char}</motion.span>
                        ))}
                    </motion.span>
                </Typography>
                <Typography component="h2" variant="caption" sx={{ mb: 2, color: 'text.secondary' }}>
                    {subtitle}
                </Typography>
                {children}
            </Paper>
        </Box>
    );
}