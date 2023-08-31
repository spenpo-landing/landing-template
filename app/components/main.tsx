"use client";
import { Button } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { CmsContext } from "../context/cms";
import AdminBtn from "./adminBtn";
import Landing from "./landingPage";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export const LandingPage: React.FC = () => {
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
