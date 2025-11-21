'use client'

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Redux Imports
import { AppDispatch } from '@/redux/store';
import { createPost } from '@/redux/features/postSlice';
import { uploadMedia } from '@/redux/features/mediaSlice';

// Material-UI Imports
import { Container, Typography, Box, Card, TextField, Button, CircularProgress, IconButton, Avatar } from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import { RootState } from '@/redux/rootReducer';

export default function CreatePostPage() {
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { createStatus } = useSelector((state: RootState) => state.posts);
  const { status: mediaStatus } = useSelector((state: RootState) => state.media);
  const isLoading = createStatus === 'loading' || mediaStatus === 'loading';
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login or signup");
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

  const authorName = user?.username || "User";
  const authorInitial = authorName[0]?.toUpperCase() || '?';

  return (
    <Container maxWidth="sm" sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary', mb: 2, fontFamily: 'var(--font-bitcount)' }}>
        {`Post it,${user?.username} !`}
      </Typography>
      <Card sx={{
        p: 3,
        backgroundColor: 'background.paper',
        border: '2px dotted rgba(255, 192, 203, 0.5)',
      }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', minHeight: '60vh' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexGrow: 1 }}>
            <Avatar sx={{ mt: 1 }}>{authorInitial}</Avatar>
            <TextField
              placeholder={`Share a thought, a story, or a bright idea...`}
              multiline
              rows={2}
              variant='outlined'
              value={content}
              fullWidth
              onChange={(e) => setContent(e.target.value)}
            />
          </Box>

          {preview && (
            <Box sx={{ position: 'relative', mt: 4, mb: 2, width: 'fit-content', mx: 'auto' }}>
              <Image
                src={preview}
                alt="preview"
                width={280}
                height={280}
                unoptimized
                style={{ maxHeight: '200px', width: 'auto', borderRadius: '8px' }}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton color="primary" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                <PhotoCamera />
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                Add Image
              </Typography>
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
              />
            </Box>

            <Button
              variant="contained"
              type="submit"
              disabled={isLoading || (!content.trim() && !mediaFile)}
              sx={{ borderRadius: 5, textTransform: 'none', px: 3, py: 1 }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Post'}
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}