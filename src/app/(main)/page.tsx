'use client'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import PostCard from '@/components/features/post/PostCard'
import { RootState } from '@/redux/rootReducer'
import { fetchPosts } from '@/redux/features/postSlice'
import { Box, CircularProgress, Container, Typography } from '@mui/material'

import CreatePostButton from '@/components/CreatePostButton'
import CreatePost from '@/components/features/post/CreatePost'

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, status } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [dispatch, status]);

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 3,
          color: 'text.primary',
          fontFamily: 'var(--font-bitcount)',
          textAlign: 'center'
        }}
      >Explore !
      </Typography>

      <CreatePost />

      {status === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {status === 'succeeded' && (
        <Box>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}

        </Box>
      )}

      {status === 'failed' && (
        <Typography color="error" sx={{ textAlign: 'center', my: 4 }}>
          Failed to load posts. Please try again later.
        </Typography>
      )}

      <CreatePostButton />
    </Container>
  )
}

export default Page
