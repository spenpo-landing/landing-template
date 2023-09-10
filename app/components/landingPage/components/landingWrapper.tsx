import { Stack } from "@mui/material";
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
      <Stack
        justifyContent="center"
        alignItems="center"
        columnGap={10}
        rowGap={3}
        p={4}
        direction={{ md: "row" }}
        flex={{ md: 0, sm: 1, xs: 1 }}
      >
        {children}
      </Stack>
    </PageWrapper>
  );
};
