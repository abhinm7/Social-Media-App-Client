import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import postReducer from './features/postSlice';
import mediaReducer from './features/mediaSlice';

const rootReducer = combineReducers({
   auth: authReducer,
  posts: postReducer,
  media: mediaReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;