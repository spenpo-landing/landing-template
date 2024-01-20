'use client'
import React from 'react'
import { Button, Stack, Typography } from '@mui/material'
import { runWorkflow } from '../services/github'

export const UpdateBtn: React.FC = () => {
  const update = async () => {
    await runWorkflow(process.env.NEXT_PUBLIC_PROJECT_NAME || '', 'update.yml')
  }

  return (
    <Stack direction="row" gap={3} alignItems="baseline">
      <Typography>New version available</Typography>
      <Button onClick={update} variant="contained">
        Click here to update
      </Button>
    </Stack>
  )
}
