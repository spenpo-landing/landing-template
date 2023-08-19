"use client";
import Landing from "./components/landingPage";
import { NextPage } from "next";
import AdminBtn from "./components/adminBtn";
import { useContext, useState } from "react";
import { useSession } from "next-auth/react";
import { CmsContext } from "./context/cms";

const Home: NextPage = () => {
  const editable = useState(false);
  const session = useSession();
  const { landingCms } = useContext(CmsContext);

  return (
    <>
      <AdminBtn />
      <Landing
        cms={landingCms}
        editable={session.status === "authenticated" ? editable : undefined}
      />
    </>
  );
};

export default Home;
