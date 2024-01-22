'use client'
import React from 'react'
import { IconButton } from '@mui/material'
import { useSession } from 'next-auth/react'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import LogoutIcon from '@mui/icons-material/Logout'
import PendingIcon from '@mui/icons-material/Pending'

const config = {
  unauthenticated: {
    icon: <AdminPanelSettingsIcon />,
    href: '/api/auth/signin?callbackUrl=/',
    opacity: 0.5,
  },
  authenticated: {
    icon: <LogoutIcon />,
    href: '/api/auth/signout?callbackUrl=/',
    opacity: 1,
  },
  loading: {
    icon: <PendingIcon />,
    href: '/',
    opacity: 0.5,
  },
}

const AdminBtn: React.FC = () => {
  const session = useSession()
  const hideAdmin = JSON.parse(process.env.NEXT_PUBLIC_HIDE_ADMIN || '')

  if (hideAdmin && session.status !== 'authenticated') return <></>

  return (
    <IconButton
      href={config[session.status].href}
      sx={{
        position: 'absolute',
        right: session.status === 'authenticated' ? 80 : 0,
        opacity: config[session.status].opacity,
      }}
    >
      {config[session.status].icon}
    </IconButton>
  )
}

export default AdminBtn
