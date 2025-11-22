import React from 'react';
import { CardActions, IconButton, Typography } from '@mui/material';
import { pink, red, blue } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline';
import ChatBubble from '@mui/icons-material/ChatBubble';

interface PostActionsProps {
    isLiked: boolean;
    likeCount: number;
    commentCount: number;
    onLike: () => void;
    onToggleComments: () => void;
    isExpanded: boolean;
}

const PostActions: React.FC<PostActionsProps> = ({
    isLiked,
    likeCount,
    commentCount,
    onLike,
    onToggleComments,
    isExpanded
}) => {
    return (
        <CardActions disableSpacing sx={{ borderTop: (theme) => `1px dotted ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}` }}>
            <IconButton aria-label="add to favorites" onClick={onLike}>
                {isLiked ? <FavoriteIcon sx={{ color: red[500] }} /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                {likeCount || 0}
            </Typography>

            <IconButton aria-label="comment" onClick={onToggleComments}>
                {!isExpanded ? <ChatBubbleOutline sx={{ color: 'inherit' }} /> : <ChatBubble sx={{ color: blue[500] }} />}

            </IconButton>

            <Typography variant="body2" color="text.secondary">
                {commentCount || 0}
            </Typography>
        </CardActions>
    );
};

export default PostActions;