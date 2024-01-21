'use client'
import React, { useState } from 'react'
import { Button, CircularProgress, Stack, Typography } from '@mui/material'
import Link from 'next/link'

export const UpdateBtn: React.FC<{ latestVersion: string }> = ({
  latestVersion,
}) => {
  const [loading, setLoading] = useState(false)
  const [failure, setFailure] = useState(false)
  const [success, setSuccess] = useState(false)

  const update = async () => {
    setLoading(true)
    const run = await fetch('/api/runWorkflow', {
      method: 'post',
      body: JSON.stringify({
        projectName: process.env.NEXT_PUBLIC_PROJECT_NAME || '',
        workflow: 'update.yml',
      }),
    })
    const res = await run.json()
    if (res.status === 200) setSuccess(true)
    if (res.status === 400) setFailure(true)
    setLoading(false)
  }

  if (failure) return <Typography>ERROR: Please try again</Typography>
  if (success)
    return (
      <Typography>
        Update initiated. Please allow a few minutes for the changes to take effect.
        You can track the progress at{' '}
        <Link href="https://www.spenpo.com/products/landing-page/my-sites">
          spenpo.com/products/landing-page/my-sites
        </Link>
      </Typography>
    )

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} gap={3} alignItems="center">
      <Typography>Version {latestVersion} is now available:</Typography>
      <Button onClick={update} variant="contained" sx={{ width: 250 }}>
        {loading ? <CircularProgress /> : 'Click here to update'}
      </Button>
    </Stack>
  )
}
