import { configureStore } from '@reduxjs/toolkit'
import auth from './slices/authSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { setStore } from '../services/api'

export const store = configureStore({ reducer: { auth } })
setStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector