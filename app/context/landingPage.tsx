"use client";
import { LandingCms, LandingProps } from "../components/landingPage";
import { SxProps } from "@mui/material";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useMemo,
  useState,
} from "react";
import { DEFAULT_PROPS } from "../components/landingPage/constants";

type LandingPageContextProps = {
  hideButtons: [boolean, Dispatch<SetStateAction<boolean>>];
  newSocial: [string, Dispatch<SetStateAction<string>>];
  hideNewSocial: [boolean, Dispatch<SetStateAction<boolean>>];
  newBackground: [string, Dispatch<SetStateAction<string>>];
  hideNewBackground: [boolean, Dispatch<SetStateAction<boolean>>];
  confirmActionStatement: [boolean, Dispatch<SetStateAction<boolean>>];
  editActionStatement: [boolean, Dispatch<SetStateAction<boolean>>];
  editDestination: [boolean, Dispatch<SetStateAction<boolean>>];
  ACCENT_COLOR: string;
  SECONDARY_ACCENT_COLOR: string;
  ACTION_STATEMENT?: string;
  ACTION_DESTINATION?: string;
  BACKGROUND_IMAGE: string;
  BACKGROUND_COLOR: string;
  HEADSHOT_SRC?: string;
  TITLE?: string;
  NAME?: string;
  SUBTITLE?: string;
  SOCIAL_URLS?: string[];
  LINK_NEW_TAB?: boolean;
  TopComponents: ReactNode;
  ADD_BTN_SX: SxProps;
  cms?: LandingCms;
  editable: LandingProps["editable"];
};

export const LandingPageContext = createContext({} as LandingPageContextProps);

export const LandingPageContextProvider: React.FC<{
  children: ReactNode;
  landingProps: LandingProps;
}> = ({
  children,
  landingProps: {
    accentColor = DEFAULT_PROPS.ACCENT_COLOR,
    secondaryAccentColor = DEFAULT_PROPS.SECONDARY_ACCENT_COLOR,
    actionStatement,
    actionDestination,
    backgroundImage = DEFAULT_PROPS.BG_IMAGE,
    backgroundColor = DEFAULT_PROPS.BG_COLOR,
    headshotSrc,
    title,
    name,
    subtitle,
    socialUrls,
    linkNewTab,
    topComponents,
    editable,
    cms,
  },
}) => {
  const hideButtons = useState(false);
  const newSocial = useState("");
  const hideNewSocial = useState(true);
  const newBackground = useState("");
  const hideNewBackground = useState(true);
  const confirmActionStatement = useState(false);
  const editActionStatement = useState(false);
  const editDestination = useState(false);

  const ACCENT_COLOR = cms?.accentColor.getter() || accentColor;
  const SECONDARY_ACCENT_COLOR =
    cms?.secondaryAccentColor.getter() || secondaryAccentColor;
  const ACTION_STATEMENT = cms ? cms.actionStatement.getter() : actionStatement;
  const ACTION_DESTINATION = cms
    ? cms.actionDestination.getter()
    : actionDestination;
  const BACKGROUND_IMAGE = cms?.backgroundImage.getter() || backgroundImage;
  const BACKGROUND_COLOR = cms?.backgroundColor.getter() || backgroundColor;
  const HEADSHOT_SRC = cms ? cms.headshotSrc.getter() : headshotSrc;
  const TITLE = cms ? cms.title.getter() : title;
  const NAME = cms ? cms.name.getter() : name;
  const SUBTITLE = cms ? cms.subtitle.getter() : subtitle;
  const SOCIAL_URLS = cms ? cms.socialUrls.getter() : socialUrls;
  const LINK_NEW_TAB = cms ? cms.linkNewTab.getter() : linkNewTab;

  const TopComponents = useMemo(() => {
    if (!hideButtons[0]) return topComponents;
  }, [hideButtons, topComponents]);

  const ADD_BTN_SX = useMemo(() => {
    return {
      stroke: ACCENT_COLOR,
      fill: ACCENT_COLOR,
      ":hover": {
        transform: "scale(1.08)",
        stroke: SECONDARY_ACCENT_COLOR,
        fill: SECONDARY_ACCENT_COLOR,
      },
    };
  }, [ACCENT_COLOR, SECONDARY_ACCENT_COLOR]);

  const contextValue: LandingPageContextProps = useMemo(() => {
    return {
      hideButtons,
      newSocial,
      hideNewSocial,
      newBackground,
      hideNewBackground,
      confirmActionStatement,
      editActionStatement,
      editDestination,
      ACCENT_COLOR,
      SECONDARY_ACCENT_COLOR,
      ACTION_STATEMENT,
      ACTION_DESTINATION,
      BACKGROUND_IMAGE,
      BACKGROUND_COLOR,
      HEADSHOT_SRC,
      TITLE,
      NAME,
      SUBTITLE,
      SOCIAL_URLS,
      LINK_NEW_TAB,
      TopComponents,
      ADD_BTN_SX,
      cms,
      editable,
    };
  }, [
    hideButtons,
    newSocial,
    hideNewSocial,
    newBackground,
    hideNewBackground,
    confirmActionStatement,
    editActionStatement,
    editDestination,
    ACCENT_COLOR,
    SECONDARY_ACCENT_COLOR,
    ACTION_STATEMENT,
    ACTION_DESTINATION,
    BACKGROUND_IMAGE,
    BACKGROUND_COLOR,
    HEADSHOT_SRC,
    TITLE,
    NAME,
    SUBTITLE,
    SOCIAL_URLS,
    LINK_NEW_TAB,
    TopComponents,
    cms,
    editable,
    ADD_BTN_SX,
  ]);

  return (
    <LandingPageContext.Provider value={contextValue}>
      {children}
    </LandingPageContext.Provider>
  );
};
