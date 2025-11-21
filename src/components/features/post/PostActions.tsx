import React from 'react';
import { CardActions, IconButton, Typography } from '@mui/material';
import { pink, red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';

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
        <CardActions disableSpacing sx={{ borderTop: '1px solid #f0f0f0' }}>
            <IconButton aria-label="add to favorites" onClick={onLike}>
                {isLiked ? <FavoriteIcon sx={{ color: red[500] }} /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                {likeCount || 0}
            </Typography>

            <IconButton aria-label="comment" onClick={onToggleComments}>
                <CommentIcon sx={{ color: isExpanded ? red[500] : 'inherit' }} />
            </IconButton>

            <Typography variant="body2" color="text.secondary">
                {commentCount || 0}
            </Typography>
        </CardActions>
    );
};

export default PostActions;