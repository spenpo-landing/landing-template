'use client'

import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material'
import { useMemo } from 'react'

type Props = {
  children?: React.ReactNode
}

export const ThemeProvider = ({ children }: Props) => {
  const theme = useMemo(() => createTheme({}), [])
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
