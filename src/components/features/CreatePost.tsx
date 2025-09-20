import { RootState } from '@/redux/rootReducer'
import { AppDispatch } from '@/redux/store'
import { Close, PhotoCamera } from '@mui/icons-material'
import { Avatar, Box, Button, Card, CircularProgress, IconButton, TextField } from '@mui/material'
import React, { ChangeEvent, FormEvent, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { createStatus } = useSelector((state: RootState) => state.posts);
  const { status: mediaStatus } = useSelector((state: RootState) => state.media);
  const isLoading = createStatus === 'loading' || mediaStatus === 'loading';

  const handleRemoveMedia = (indexToRemove: Number) => {
    setMediaFiles(prev => prev.filter((_, index) => index != indexToRemove))
    setPreviews(prev => prev.filter((_, index) => index != indexToRemove))
    toast.success("removed")
  }
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setMediaFiles(fileArray);

      const previewsArray = fileArray.map(file => URL.createObjectURL(file));
      setPreviews(previewsArray);
    }
  }
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast.error("hello")

  }

  return (
    <Card sx={{ p: 2, mb: 3, backgroundColor: 'background.paper' }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>

          <Avatar sx={{ mt: 1 }}>{user?.username?.[0].toUpperCase()}</Avatar>

          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>

            <TextField
              placeholder={`What's on your mind, ${user?.username?.slice(0, 4)}`}
              multiline
              variant='outlined'
              value={content}
              fullWidth
              onChange={(e) => setContent(e.target.value)}
            />


            {previews.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {previews.map((src, index) => (

                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      width: 100,
                      height: 100,
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={src}
                      alt="preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveMedia(index)}
                      sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                      }}
                    >
                      <Close fontSize="small" sx={{ color: 'white' }} />
                    </IconButton>
                  </Box>
                ))}
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
            disabled={isLoading || (!content.trim() && mediaFiles.length === 0)}
            sx={{ borderRadius: 5, textTransform: 'none' }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Post'}
          </Button>
        </Box>
      </Box>
    </Card>
  )
}

export default CreatePost
