import React, { ReactNode } from 'react'
import { SxProps, Box } from '@mui/material'
import { DEFAULT_PROPS } from '../constants'

const PageWrapper: React.FC<{
  children: ReactNode
  backgroundColor?: string
  sx?: SxProps
}> = ({ children, backgroundColor = DEFAULT_PROPS.BG_COLOR, sx }) => {
  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export default PageWrapper
