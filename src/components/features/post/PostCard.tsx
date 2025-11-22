import React, { useState } from 'react';
import { Post } from "@/types";

import { Avatar, Card, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector } from '@/redux/store';
import { toggleLikePost, fetchComments } from '@/redux/features/interactionSlice';

// Import Sub-components
import PostActions from './PostActions';
import PostComments from './PostComments';

const PostCard = ({ post }: { post: Post }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const [expanded, setExpanded] = useState(false);

    const authorName = post.user?.username || 'unknown user';
    const authorInitial = authorName[0]?.toUpperCase() || '?';

    const handleLike = () => {
        if (!isAuthenticated) {
            toast.error("Please login to like this post");
            router.push("/login");
            return;
        }
        dispatch(toggleLikePost(post._id));
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
        if (!expanded && (!post.loadedComments || post.loadedComments.length === 0) && post.commentCount > 0) {
            dispatch(fetchComments({ postId: post._id, page: 1 }));
        }
    };

    return (
        <Card sx={{ 
            boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)', 
            maxWidth: '100%', 
            mb: 3, 
            borderRadius: 4,
            border: (theme) => `1px dotted ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`
        }}>
            {/* Header Section */}
                <CardHeader
                    avatar={
                         <Avatar sx={{ bgcolor: 'primary.main' }} aria-label='user avatar'>
                        {authorInitial}
                    </Avatar>
                    }
                    title={<Typography fontWeight="bold">{authorName}</Typography>}
                    subheader={formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                />
            
            {/* Media Section */}
            {post.media && post.media.length > 0 && (
                <CardMedia
                    component="img"
                    image={post.media[0].url}
                    alt="Post media"
                    sx={{ 
                        objectFit: 'cover', 
                        maxHeight: '500px', 
                        backgroundColor: '#000' 
                    }}
                />
            )}

            {/* Content Section */}
            <CardContent>
                <Typography variant="body1" color="text.primary">
                    {post.content}
                </Typography>
            </CardContent>

            {/* Actions Section */}
            <PostActions 
                isLiked={post.isLiked} 
                likeCount={post.likeCount} 
                commentCount={post.commentCount} 
                onLike={handleLike} 
                onToggleComments={handleExpandClick}
                isExpanded={expanded}
            />

            {/* Comments Section */}
            <PostComments post={post} expanded={expanded} />
        </Card>
    );
};

export default PostCard;