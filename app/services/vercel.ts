interface ProjectEnvVariable {
  key: string;
  target: string;
  type: string;
  value?: string;
}

export interface ProjectEnvVariableInput extends ProjectEnvVariable {
  value: string;
}

const headers = {
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_VERCEL_TOKEN}`,
};

const getProjectDeployments = async (app: string) =>
  fetch(`https://api.vercel.com/v2/deployments?app=${app}`, {
    headers,
    method: "get",
  });

const getDeploymentAliases = async (deploymentId: string) =>
  fetch(`https://api.vercel.com/v2/deployments/${deploymentId}/aliases`, {
    headers,
    method: "get",
  });

const redeployProject = async (deploymentId: string, name: string) =>
  fetch("https://api.vercel.com/v13/deployments", {
    body: JSON.stringify({
      name,
      deploymentId,
    }),
    headers,
    method: "post",
  });

const cancelDeployment = async (deploymentId: string) =>
  fetch(`https://api.vercel.com/v12/deployments/${deploymentId}/cancel`, {
    headers,
    method: "patch",
  });

const addEnvironmentVariables = async (
  projectName: string,
  variables: ProjectEnvVariableInput[]
) =>
  fetch(`https://api.vercel.com/v10/projects/${projectName}/env?upsert=true`, {
    body: JSON.stringify(variables),
    headers,
    method: "post",
  });

const getDeployment = async (deploymentId: string) =>
  fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
    headers,
    method: "get",
  });

const getDeploymentEvents = async (deploymentId: string) =>
  fetch(
    `https://api.vercel.com/v2/deployments/${deploymentId}/events?builds=1&direction=forward&follow=1`,
    {
      headers,
      method: "get",
    }
  );

export {
  getProjectDeployments,
  getDeploymentAliases,
  redeployProject,
  cancelDeployment,
  addEnvironmentVariables,
  getDeployment,
  getDeploymentEvents,
};