import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { useDispatch, useSelector, useStore } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

export const store = configureStore({
    reducer: rootReducer
})

// Export the types 
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;

// Export the HOOKS 
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;