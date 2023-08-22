"use client";
import Landing from "./components/landingPage";
import { NextPage } from "next";
import AdminBtn from "./components/adminBtn";
import { useContext, useState } from "react";
import { useSession } from "next-auth/react";
import { CmsContext } from "./context/cms";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const Home: NextPage = () => {
  const editable = useState(false);
  const session = useSession();
  const router = useRouter();
  const { landingCms } = useContext(CmsContext);

  return (
    <>
      <AdminBtn />
      <Landing
        cms={landingCms}
        editable={session.status === "authenticated" ? editable : undefined}
        topComponents={
          session.status === "authenticated" ? (
            <Button
              onClick={() => router.push("/admin")}
              variant="contained"
              sx={{ ml: "auto", mr: 3 }}
              endIcon={<ChevronRightIcon />}
            >
              review changes
            </Button>
          ) : undefined
        }
      />
    </>
  );
};

export default Home;
