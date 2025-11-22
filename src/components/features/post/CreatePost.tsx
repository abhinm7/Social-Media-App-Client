'use client'

import { RootState } from '@/redux/rootReducer'
import { AppDispatch } from '@/redux/store'
import { Close, PhotoCamera } from '@mui/icons-material'
import { Avatar, Box, Button, Card, CircularProgress, IconButton, TextField } from '@mui/material'
import React, { ChangeEvent, FormEvent, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'

import { createPost } from '@/redux/features/postSlice'
import { uploadMedia } from '@/redux/features/mediaSlice'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const CreatePost = () => {
    const [content, setContent] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { createStatus } = useSelector((state: RootState) => state.posts);
    const { status: mediaStatus } = useSelector((state: RootState) => state.media);
    const isLoading = createStatus === 'loading' || mediaStatus === 'loading';

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    const handleRemoveMedia = () => {
        setMediaFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setMediaFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error("Login to Continue");
            router.push("/login");
            return;
        }
        if (!content.trim() && !mediaFile) {
            toast.error("You can't create an empty post !");
            return;
        }

        let mediaIDs: string[] = [];

        if (mediaFile) {
            const uploadResult = await dispatch(uploadMedia(mediaFile));
            console.log(uploadResult);

            if (uploadMedia.fulfilled.match(uploadResult)) {

                mediaIDs = [uploadResult.payload.mediaId]
                toast.success("Media upload success");
            } else {
                toast.error("Media upload failed. Please try again.");
                return;
            }
        }

        const createResult = await dispatch(createPost({ content, mediaIDs }));
        if (createPost.fulfilled.match(createResult)) {
            toast.success("Post created succesfully.");
            setContent('');
            handleRemoveMedia();
        } else {
            toast.error("Failed to create post.")
        }
    }

    return (
        <Card sx={{ boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)', p: 2, mb: 3, backgroundColor: 'background.paper' }}>
            <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>

                    <Avatar sx={{ mt: 1, bgcolor: 'primary.main' }}>{user?.username?.[0].toUpperCase()}</Avatar>

                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>

                        <TextField
                            placeholder={`What's up ${user?.username?.slice(0, 4)} ?`}
                            multiline
                            variant='outlined'
                            value={content}
                            fullWidth
                            onChange={(e) => setContent(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        border: '2px dotted rgba(255, 192, 203, 0.4)',
                                    },
                                    '&:hover fieldset': {
                                        border: '2px dotted rgba(255, 192, 203, 0.6)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        border: '2px dotted rgba(255, 192, 203, 0.8)',
                                    },
                                },
                            }}
                        />

                        {preview && (
                            <Box sx={{ position: 'relative', mt: 2, width: 'fit-content' }}>
                                <Image
                                    src={preview}
                                    alt="preview"
                                    width={300}
                                    height={300}
                                    unoptimized
                                    style={{
                                        maxHeight: '300px',
                                        width: 'auto',
                                        borderRadius: '8px'
                                    }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={handleRemoveMedia}
                                    sx={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.5)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}
                                >
                                    <Close fontSize="small" sx={{ color: 'white' }} />
                                </IconButton>
                            </Box>
                        )}

                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <IconButton color="primary" onClick={() => fileInputRef.current?.click()}>
                        <PhotoCamera />
                    </IconButton>
                    <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={isLoading || (!content.trim() && !mediaFile)}
                        sx={(theme) => ({ 
                            bgcolor: 'primary.main', 
                            borderRadius: 5, 
                            textTransform: 'none',
                            '&.Mui-disabled': {
                                bgcolor: theme.palette.mode === 'dark' 
                                    ? 'rgba(236, 127, 169, 0.1)'  
                                    : 'rgba(144, 202, 249, 0.2)', 
                                color: theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.3)' 
                                    : 'rgba(0, 0, 0, 0.3)'
                            }
                        })}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Post'}
                    </Button>
                </Box>
            </Box>
        </Card>
    )
}

export default CreatePost
