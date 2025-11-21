export interface Comment {
    _id: string;
    post: string;
    user: {
        _id: string;
        username: string;
    };
    content: string;
    createdAt: string;
}

export interface Post {
    _id: string;
    content: string;
    media: { 
        _id: string;
        url: string;
    }[];
    user: {
        _id: string;
        username: string;
    };
    createdAt: string;
    
    likeCount: number;
    commentCount: number;
    isLiked: boolean; 
    
    // --- Client-side Interaction State ---
    loadedComments?: Comment[]; 
    commentsPage?: number;
    areCommentsLoading?: boolean;
}