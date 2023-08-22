import {
  addEnvironmentVariables,
  getProjectDeployments,
  redeployProject,
} from "@/app/services/vercel";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME!;
  const BODY = await req.json();

  // add env variables
  const addEnvs = await addEnvironmentVariables(projectName, BODY);

  const envRes = await addEnvs.json();

  // get latest deployment id
  const deployments = await getProjectDeployments(projectName);

  const deploymentRes = await deployments.json();

  const deploymentId = deploymentRes.deployments[0].uid;

  // redeploy project
  const redeploy = await redeployProject(deploymentId, projectName);

  const redeployRes = await redeploy.json();

  return NextResponse.json({ redeployRes, envRes });
}
