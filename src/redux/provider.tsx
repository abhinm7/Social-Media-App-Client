'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { injectStore } from '@/lib/api';

injectStore(store);

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>
}