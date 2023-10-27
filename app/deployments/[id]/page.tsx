import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Deployment } from "@/app/components/deployment/deployment";
import PageWrapper from "@/app/components/pageWrapper";
import { getDeployment } from "@/app/services/vercel";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function DeploymentPage({
  params: { id, createdAt },
}: {
  params: { id: string; createdAt: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const deploymentReq = await getDeployment(id);
  const deployment = await deploymentReq.json();

  if (deployment.name !== process.env.NEXT_PUBLIC_PROJECT_NAME) redirect("/");

  return (
    <PageWrapper sx={{ color: "#000" }}>
      <Deployment id={String(id)} createdAt={Number(createdAt)} />
    </PageWrapper>
  );
}
