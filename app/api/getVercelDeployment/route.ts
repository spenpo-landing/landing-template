import { NextResponse, type NextRequest } from "next/server";
import { getDeployment } from "@/app/services/vercel";

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");

  const deploymentReq = await getDeployment(String(uid));

  const deployment = await deploymentReq.json();

  return NextResponse.json(deployment);
}
