'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logoutUser } from '../redux/features/authSlice';
import { AppDispatch } from '../redux/store';
import { RootState } from '@/redux/rootReducer';

export function LogoutButton() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { status } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} disabled={status === 'loading'}>
      {status === 'loading' ? 'Logging out...' : 'Logout'}
    </button>
  );
}