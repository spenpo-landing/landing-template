import { type NextRequest } from "next/server";
import { getDeploymentEvents } from "@/app/services/vercel";

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");

  const deploymentEvents = await getDeploymentEvents(String(uid));

  return new Response(deploymentEvents.body);
}
