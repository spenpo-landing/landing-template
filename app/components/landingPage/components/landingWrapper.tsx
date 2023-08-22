import { Box } from "@mui/material";
import React, { ReactNode, useContext } from "react";
import { LandingPageContext } from "../../../context/landingPage";
import PageWrapper from "../../pageWrapper";

export const LandingWrapper: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { BACKGROUND_COLOR, BACKGROUND_IMAGE, TopComponents } =
    useContext(LandingPageContext);

  return (
    <PageWrapper
      backgroundColor={BACKGROUND_COLOR}
      sx={{
        backgroundImage: `url('${BACKGROUND_IMAGE}')`,
      }}
    >
      {TopComponents}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          columnGap: 10,
          padding: "4rem 0",
        }}
      >
        {children}
      </Box>
    </PageWrapper>
  );
};
