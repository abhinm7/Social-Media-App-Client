'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import PostCard from '@/components/features/post/PostCard'
import { RootState } from '@/redux/rootReducer'
import { fetchPosts, resetPosts } from '@/redux/features/postSlice'
import { Box, CircularProgress, Container, Typography } from '@mui/material'

import CreatePostButton from '@/components/CreatePostButton'
import CreatePost from '@/components/features/post/CreatePost'

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, status, page, hasMore } = useSelector((state: RootState) => state.posts);


  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {

      if (status === 'loading') return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchPosts({ page }));
        }
      });

      if (node) observer.current.observe(node);
    },
    [status, hasMore, page, dispatch]
  );


  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(resetPosts());
      dispatch(fetchPosts({ page: 1 }));
      hasFetched.current = true;
    }
  }, [dispatch]);

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

      <Box>
        {posts.map((post, index) => {
          if (index === posts.length - 1) {
            return (
              <div ref={lastPostRef} key={post._id}>
                <PostCard post={post} />
              </div>
            );
          } else {
            return <PostCard key={post._id} post={post} />;
          }
        })}
      </Box>

      {!hasMore && posts.length > 0 && (
        <Typography sx={{ textAlign: 'center', my: 4, color: 'gray' }}>
          No more posts
        </Typography>
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
