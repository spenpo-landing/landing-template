import { Stack, Typography } from '@mui/material'
import React from 'react'
import Package from '../../package.json'
import { ReviewChanges } from '../components/reviewChanges'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { getProjectVersion } from '../services/github'
import { UpdateBtn } from '../components/updateBtn'

export default async function Admin() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  const latestVersionRes = await getProjectVersion('landing-template')
  const packagejson = latestVersionRes.data as unknown as { content: string }
  const base64ToString = Buffer.from(packagejson.content, 'base64').toString()
  const latestVersion = JSON.parse(base64ToString).version

  // const currentVersionRes = await getProjectVersion(
  //   process.env.NEXT_PUBLIC_PROJECT_NAME || ''
  // )
  // const currentpackage = currentVersionRes.data as unknown as { content: string }
  // const currentToString = Buffer.from(currentpackage.content, 'base64').toString()
  // const currentVersion = JSON.parse(currentToString).version

  const outOfDate = Package.version !== latestVersion

  return (
    <Stack p={{ xs: 2, sm: 5 }} minHeight="100vh" gap={3}>
      <ReviewChanges>
        {outOfDate && <UpdateBtn latestVersion={latestVersion} />}
      </ReviewChanges>
      <Typography variant="caption" sx={{ alignSelf: 'center' }}>
        version {Package.version}
      </Typography>
    </Stack>
  )
}
