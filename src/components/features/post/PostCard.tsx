import React from 'react'
import { Post } from "@/types";
import { Avatar, Card, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';
import { pink, red } from '@mui/material/colors';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post }: { post: Post }) => {
    const autherName = post.user?.username || 'unknown user';
    const autherInitial = autherName[0]?.toUpperCase() || '?';
    return (
        <Card sx={{ maxWidth: '100%', mb: 3, backgroundColor: 'background.paper' }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: pink[300] }} aria-label='user avatar'>
                        {autherInitial}
                    </Avatar>
                }
                title={autherName}
                subheader={formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            />
            {post.media && post.media.length > 0 && (
                <CardMedia
                    component="img"
                    height="400"
                    image={post.media[0].url}
                    alt="Post media"
                    sx={{ objectFit: 'cover' }}
                />
            )}
            <CardContent>
                <Typography variant="body1" color="text.primary">
                    {post.content}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default PostCard
