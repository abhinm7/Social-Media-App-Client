import React, { useState } from 'react';
import { 
    Box, TextField, IconButton, List, ListItem, 
    ListItemAvatar, Avatar, ListItemText, Typography, 
    Button, CircularProgress, Collapse, CardContent 
} from '@mui/material';
import { grey } from '@mui/material/colors';
import SendIcon from '@mui/icons-material/Send';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Post, Comment } from "@/types";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { addCommentPost, fetchComments } from '@/redux/features/interactionSlice';

interface PostCommentsProps {
    post: Post;
    expanded: boolean;
}

const PostComments: React.FC<PostCommentsProps> = ({ post, expanded }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const [commentText, setCommentText] = useState("");

    const handleCommentSubmit = async () => {
        if (!isAuthenticated) {
            toast.error("Please login to comment");
            router.push("/login");
            return;
        }

        if (!commentText.trim()) return;
        
        await dispatch(addCommentPost({ postId: post._id, content: commentText }));
        setCommentText("");
    };

    const handleLoadMoreComments = () => {
        const nextPage = (post.commentsPage || 0) + 1;
        dispatch(fetchComments({ postId: post._id, page: nextPage }));
    };

    return (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent sx={{ bgcolor: '#fafafa', pt: 2 }}>
                {/* Input Section */}
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

                {/* List Section */}
                <List disablePadding>
                    {post.loadedComments?.map((comment: Comment) => (
                        <ListItem alignItems="flex-start" key={comment._id} sx={{ px: 0 }}>
                            <ListItemAvatar>
                                <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: grey[400] }}>
                                    {comment.user?.username?.[0]?.toUpperCase() || '?'}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle2" component="span" fontWeight="bold">
                                        {comment.user?.username || 'Unknown'}
                                    </Typography>
                                }
                                secondary={
                                    <>
                                        <Typography component="span" variant="body2" color="text.primary" display="block">
                                            {comment.content}
                                        </Typography>
                                        <Typography component="span" variant="caption" color="text.secondary">
                                            {comment.createdAt 
                                                ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) 
                                                : 'Just now'}
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>

                {/* Load More Action */}
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
    );
};

export default PostComments;