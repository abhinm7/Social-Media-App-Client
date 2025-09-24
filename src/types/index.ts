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
}