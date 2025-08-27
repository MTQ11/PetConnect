"use client"

import { useEffect } from "react"
import { checkAuthStatus, updateUserInfo } from '@/store/slices/authSlice'
import { useAppDispatch } from "@/store/hook";

export const AuthChecker = ({children}: {children: React.ReactNode}) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(checkAuthStatus());
        dispatch(updateUserInfo());
    }, [dispatch])

    return <>{children}</>
}