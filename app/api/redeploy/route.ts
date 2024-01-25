/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createBlob,
  createCommit,
  createTree,
  getMainTree,
  pushCommit,
} from '@/app/services/github'
import {
  ProjectEnvVariableInput,
  addEnvironmentVariables,
  getProjectDeployments,
  redeployProject,
} from '@/app/services/vercel'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME!
  const BODY = await req.formData()
  const file = BODY.get('file')
  const fileExtension = BODY.get('fileExtension')
  if (fileExtension) BODY.delete('fileExtension')
  const headshotFileName = `headshot.${fileExtension}`

  const environmentVariables: ProjectEnvVariableInput[] = []

  if (file) {
    environmentVariables.push({
      key: 'NEXT_PUBLIC_HEADSHOT',
      value: `/${headshotFileName}`,
      target: ['production', 'preview', 'development'],
      type: 'encrypted',
    })
    BODY.delete('NEXT_PUBLIC_HEADSHOT')
  }

  for (const [key, value] of BODY.entries()) {
    if (typeof value === 'string' && value !== process.env[key]) {
      environmentVariables.push({
        key,
        value,
        target: ['production', 'preview', 'development'],
        type: 'encrypted',
      })
    }
  }

  // add env variables
  const addEnvs = await addEnvironmentVariables(projectName, environmentVariables)

  const envRes = await addEnvs.json()

  // get latest deployment id
  const deployments = await getProjectDeployments(projectName)

  const deploymentRes = await deployments.json()

  const deploymentId = deploymentRes.deployments[0].uid

  // check file
  if (file && typeof file === 'object') {
    const blob = new Blob(file)
    const buffer = Buffer.from(await blob.arrayBuffer())
    const headshotBase64 = buffer.toString('base64')

    // 5. create blob of headshot
    let blobShaRes

    try {
      blobShaRes = await createBlob(projectName, headshotBase64)
    } catch (err: any) {
      console.log(5, 'catch', err.response.data)
      return NextResponse.json({ status: 400, ...err.response.data })
    }

    // 6. get main tree sha
    const main = async (): Promise<any> => {
      try {
        return await getMainTree(projectName)
      } catch (err: any) {
        console.log(6, 'catch', err.response.data)
        if (err.status === 404) {
          return await main()
        } else return err
      }
    }

    let mainTreeShaRes

    try {
      mainTreeShaRes = await main()
    } catch (err: any) {
      return NextResponse.json({ status: 400, ...err.response.data })
    }

    // 7. create tree with headshot file
    let newTreeShaRes

    try {
      newTreeShaRes = await createTree(
        projectName,
        mainTreeShaRes.data.commit.sha,
        headshotFileName,
        blobShaRes.data.sha
      )
    } catch (err: any) {
      console.log(7, 'catch', err.response.data)
      return NextResponse.json({ status: 400, ...err.response.data })
    }

    // 8. create commit to new repo
    let newCommitShaRes

    try {
      newCommitShaRes = await createCommit(
        projectName,
        mainTreeShaRes.data.commit.sha,
        newTreeShaRes.data.sha
      )
    } catch (err: any) {
      console.log(8, 'catch', err.response.data)
      return NextResponse.json({ status: 400, ...err.response.data })
    }

    // 9. push commit to deploy vercel project
    try {
      const push = await pushCommit(projectName, newCommitShaRes.data.sha)
      if (push.status === 200) NextResponse.json({ status: 200, message: 'success' })
    } catch (err: any) {
      console.log(9, 'catch', err.response.data)
      return NextResponse.json({ status: 400, ...err.response.data })
    }
  } else {
    // redeploy project
    const redeploy = await redeployProject(deploymentId, projectName)
    const redeployRes = await redeploy.json()
    return NextResponse.json({ redeployRes, envRes })
  }
}
