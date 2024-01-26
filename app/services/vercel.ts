interface ProjectEnvVariable {
  key: string
  target: string[]
  type: string
  value?: string
}

export interface ProjectEnvVariableInput extends ProjectEnvVariable {
  value: string
}

const headers = {
  Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
}

const getProjectDeployments = async (app: string) =>
  fetch(
    `https://api.vercel.com/v2/deployments?app=${app}&teamId=${process.env.VERCEL_TEAM}`,
    {
      headers,
      method: 'get',
    }
  )

const getDeploymentAliases = async (deploymentId: string) =>
  fetch(
    `https://api.vercel.com/v2/deployments/${deploymentId}/aliases?teamId=${process.env.VERCEL_TEAM}`,
    {
      headers,
      method: 'get',
    }
  )

const redeployProject = async (deploymentId: string, name: string) =>
  fetch(
    `https://api.vercel.com/v13/deployments?forceNew=1&teamId=${process.env.VERCEL_TEAM}`,
    {
      body: JSON.stringify({
        name,
        deploymentId,
        meta: { action: 'redeploy' },
        target: 'production',
      }),
      headers,
      method: 'post',
    }
  )

const cancelDeployment = async (deploymentId: string) =>
  fetch(`https://api.vercel.com/v12/deployments/${deploymentId}/cancel`, {
    headers,
    method: 'patch',
  })

const getEnvironmentVariables = async (projectName: string) =>
  fetch(
    `https://api.vercel.com/v9/projects/${projectName}/env?teamId=${process.env.VERCEL_TEAM}`,
    {
      headers,
      method: 'get',
    }
  )

const addEnvironmentVariables = async (
  projectName: string,
  variables: ProjectEnvVariableInput[]
) =>
  fetch(
    `https://api.vercel.com/v10/projects/${projectName}/env?upsert=true&teamId=${process.env.VERCEL_TEAM}`,
    {
      body: JSON.stringify(variables),
      headers,
      method: 'post',
    }
  )

const editEnvironmentVariable = async (
  projectName: string,
  variableId: string,
  value: string
) =>
  fetch(
    `https://api.vercel.com/v9/projects/${projectName}/env/${variableId}?teamId=${process.env.VERCEL_TEAM}`,
    {
      body: JSON.stringify({
        value,
        comment: `updated on ${new Date().toLocaleString()}`,
      }),
      headers,
      method: 'PATCH',
    }
  )

const getDeployment = async (deploymentId: string) =>
  fetch(
    `https://api.vercel.com/v13/deployments/${deploymentId}?teamId=${process.env.VERCEL_TEAM}`,
    {
      headers,
      method: 'get',
    }
  )

const getDeploymentEvents = async (deploymentId: string) =>
  fetch(
    `https://api.vercel.com/v2/deployments/${deploymentId}/events?builds=1&direction=forward&follow=1&teamId=${process.env.VERCEL_TEAM}`,
    {
      headers,
      method: 'get',
    }
  )

export {
  getProjectDeployments,
  getDeploymentAliases,
  redeployProject,
  cancelDeployment,
  getEnvironmentVariables,
  addEnvironmentVariables,
  editEnvironmentVariable,
  getDeployment,
  getDeploymentEvents,
}
