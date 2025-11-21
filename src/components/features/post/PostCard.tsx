import React, { useState } from 'react'
import { Post, Comment } from "@/types";
import { Avatar, Card, CardContent, CardHeader, CardMedia, Typography, CardActions, IconButton, Collapse, TextField, Button, Box, List, ListItem, ListItemAvatar, ListItemText, CircularProgress } from '@mui/material';
import { pink, grey } from '@mui/material/colors';
import { formatDistanceToNow } from 'date-fns';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import { useAppDispatch } from '@/redux/store'; 
import { toggleLikePost, addCommentPost, fetchComments } from '@/redux/features/interactionSlice';

const PostCard = ({ post }: { post: Post }) => {
    
    const dispatch = useAppDispatch();
    const [expanded, setExpanded] = useState(false);
    const [commentText, setCommentText] = useState("");

    const autherName = post.user?.username || 'unknown user';
    const autherInitial = autherName[0]?.toUpperCase() || '?';

    const handleLike = () => {
        dispatch(toggleLikePost(post._id));
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
        // If opening and no comments loaded, fetch page 1
        if (!expanded && (!post.loadedComments || post.loadedComments.length === 0) && post.commentCount > 0) {
            dispatch(fetchComments({ postId: post._id, page: 1 }));
        }
    };

    const handleLoadMoreComments = () => {
        const nextPage = (post.commentsPage || 0) + 1;
        dispatch(fetchComments({ postId: post._id, page: nextPage }));
    };

    const handleCommentSubmit = async () => {
        if (!commentText.trim()) return;
        await dispatch(addCommentPost({ postId: post._id, content: commentText }));
        setCommentText("");
    };

    return (
        <Card sx={{ boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)', maxWidth: '100%', mb: 3, borderRadius: 4 }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: pink[500] }} aria-label='user avatar'>
                        {autherInitial}
                    </Avatar>
                }
                title={<Typography fontWeight="bold">{autherName}</Typography>}
                subheader={formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            />
            
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

            <CardContent>
                <Typography variant="body1" color="text.primary">
                    {post.content}
                </Typography>
            </CardContent>

            <CardActions disableSpacing sx={{ borderTop: '1px solid #f0f0f0' }}>
                <IconButton aria-label="add to favorites" onClick={handleLike}>
                    {post.isLiked ? <FavoriteIcon sx={{ color: pink[500] }} /> : <FavoriteBorderIcon />}
                </IconButton>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                    {post.likeCount || 0}
                </Typography>

                <IconButton aria-label="comment" onClick={handleExpandClick}>
                    <CommentIcon color={expanded ? "primary" : "inherit"} />
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                    {post.commentCount || 0}
                </Typography>
            </CardActions>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent sx={{ bgcolor: '#fafafa', pt: 2 }}>
                    
                    {/* Comment Input */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 3 }}>
                         <TextField 
                            fullWidth 
                            multiline
                            maxRows={3}
                            size="small" 
                            placeholder="Add a comment..." 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            sx={{ bgcolor: 'white' }}
                        />
                        <IconButton onClick={handleCommentSubmit} disabled={!commentText.trim()} color="primary">
                            <SendIcon />
                        </IconButton>
                    </Box>

                    {/* Comments List */}
                    <List disablePadding>
                        {post.loadedComments?.map((comment: Comment) => (
                            <ListItem alignItems="flex-start" key={comment._id} sx={{ px: 0 }}>
                                <ListItemAvatar>
                                    <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: grey[400] }}>
                                        {comment.user.username[0].toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle2" component="span" fontWeight="bold">
                                            {comment.user.username}
                                        </Typography>
                                    }
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.primary" display="block">
                                                {comment.content}
                                            </Typography>
                                            <Typography component="span" variant="caption" color="text.secondary">
                                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>

                    {/* Load More Button */}
                    {post.commentCount > (post.loadedComments?.length || 0) && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button 
                                size="small" 
                                onClick={handleLoadMoreComments}
                                disabled={post.areCommentsLoading}
                                sx={{ textTransform: 'none' }}
                            >
                                {post.areCommentsLoading ? <CircularProgress size={20} /> : "View more comments"}
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Collapse>
        </Card>
    )
}

export default PostCard