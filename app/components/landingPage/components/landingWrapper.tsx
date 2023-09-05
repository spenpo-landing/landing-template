import { Stack } from "@mui/material";
import React, { ReactNode, useContext } from "react";
import { LandingPageContext } from "../../../context/landingPage";
import PageWrapper from "../../pageWrapper";

export const LandingWrapper: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { BACKGROUND_COLOR, BACKGROUND_IMAGE, TopComponents, editable } =
    useContext(LandingPageContext);

  return (
    <PageWrapper
      backgroundColor={BACKGROUND_COLOR}
      sx={{
        backgroundImage: `url('${BACKGROUND_IMAGE}')`,
        pt: editable?.[0]
          ? { xl: 0, lg: 0, md: 0, sm: 15, xs: 30 }
          : { xl: 0, lg: 0, md: 0, sm: 10, xs: 10 },
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
      >
        {children}
      </Stack>
    </PageWrapper>
  );
};
