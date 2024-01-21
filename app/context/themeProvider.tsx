'use client'

import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material'
import { useMemo } from 'react'

type Props = {
  children?: React.ReactNode
}

export const ThemeProvider = ({ children }: Props) => {
  const theme = useMemo(
    () =>
      createTheme({
        components: {
          MuiCircularProgress: {
            styleOverrides: {
              root: {
                height: '24.5px !important',
                width: '24.5px !important',
                color: '#fff',
              },
            },
          },
        },
      }),
    []
  )
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}
