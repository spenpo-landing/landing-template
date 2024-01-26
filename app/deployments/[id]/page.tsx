import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { Deployment } from '@/app/components/deployment/deployment'
import { getDeployment, getProjectDeployments } from '@/app/services/vercel'
import { Typography } from '@mui/material'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'
import { RefreshBtn } from './components/RefreshBtn'
import { revalidatePath } from 'next/cache'

export default async function DeploymentPage({
  params: { id, createdAt },
}: {
  params: { id: string; createdAt: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME!

  if (id === 'latest') {
    const deployments = await getProjectDeployments(projectName)
    const deploymentsRes = await deployments.json()
    const latestDeployment = deploymentsRes.deployments[0]
    if (latestDeployment.readyState === 'READY')
      return (
        <>
          <RefreshBtn
            refresh={async () => {
              'use server'
              revalidatePath('/deployments/latest')
            }}
          />
          <Typography textAlign="center">No ongoing deployments</Typography>
        </>
      )
    else {
      redirect(`/deployments/${latestDeployment.uid}`)
    }
  }

  const deploymentReq = await getDeployment(id)
  const deployment = await deploymentReq.json()

  if (deployment.name !== projectName) redirect('/')

  return <Deployment id={String(id)} createdAt={Number(createdAt)} />
}
