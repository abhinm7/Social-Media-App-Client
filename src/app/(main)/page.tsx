'use client'
import { logoutUser } from '@/redux/features/authSlice'
import React from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'

const page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const handleLogin = async() => {
    await dispatch(logoutUser());
  }
  return (
    <div>
      hello
      <button onClick={handleLogin}>Logout</button>
    </div>
  )
}

export default page
