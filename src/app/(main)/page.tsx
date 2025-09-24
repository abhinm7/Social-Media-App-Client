'use client'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import PostCard from '@/components/features/post/PostCard'
import { RootState } from '@/redux/rootReducer'
import { fetchPosts } from '@/redux/features/postSlice'
import { Box } from '@mui/material'

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, status } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [dispatch, status]);

  return (
    <div>

      {status === 'succeeded' && (
        <Box>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </Box>
      )}
    </div>
  )
}

export default Page
