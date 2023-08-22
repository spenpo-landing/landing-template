"use client";
import { Deployment } from "@/app/components/deployment/deployment";
import PageWrapper from "@/app/components/pageWrapper";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import React from "react";

const Home: NextPage = () => {
  const { id, createdAt } = useParams();

  return (
    <PageWrapper sx={{ color: "#000" }}>
      <Deployment id={String(id)} createdAt={Number(createdAt)} />
    </PageWrapper>
  );
};

export default Home;
