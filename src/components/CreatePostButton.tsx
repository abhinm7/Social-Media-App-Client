'use client';

import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';

export default function CreatePostButton() {
    return (
        <Link href="/create-post" passHref>
            <Fab 
                color="primary" 
                aria-label="add"
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                }}
            >
                <AddIcon />
            </Fab>
        </Link>
    );
}