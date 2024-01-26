'use client'

import React, { useState } from 'react'
import { Button, CircularProgress } from '@mui/material'
import Refresh from '@mui/icons-material/Cached'

export const RefreshBtn: React.FC<{
  refresh: () => Promise<void>
}> = ({ refresh }) => {
  const [loading, setLoading] = useState(false)
  return (
    <Button
      disabled={loading}
      variant="contained"
      sx={{ ml: 'auto', p: 1, minWidth: 40 }}
      onClick={async () => {
        setLoading(true)
        await refresh()
        setLoading(false)
      }}
    >
      {loading ? <CircularProgress /> : <Refresh />}
    </Button>
  )
}
