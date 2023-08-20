"use client";
import { LandingCms } from "../components/landingPage";
import { useLandEnvVars } from "../hooks/useEnvVariables";
import { useSession } from "next-auth/react";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useMemo,
  useState,
} from "react";

type CmsContextProps = {
  setPassword: Dispatch<SetStateAction<string | undefined>>;
  landingCms: LandingCms;
};

export const CmsContext = createContext({} as CmsContextProps);

export const CmsContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const session = useSession();

  const [clientName, setClientName] = useState(
    process.env.NEXT_PUBLIC_NAME || "not found"
  );
  const [title, setTitle] = useState(
    process.env.NEXT_PUBLIC_TITLE || "not found"
  );
  const [subtitle, setSubtitle] = useState<string>(
    process.env.NEXT_PUBLIC_SUBTITLE || "not found"
  );
  const [socialUrls, setSocialUrls] = useState<string>(
    process.env.NEXT_PUBLIC_SOCIALS || "[]"
  );
  const [actionDestination, setActionDestination] = useState(
    process.env.NEXT_PUBLIC_ACTION
  );
  const [actionStatement, setActionStatement] = useState<string | undefined>(
    process.env.NEXT_PUBLIC_ACTION_STATEMENT || "not found"
  );
  const [headshotContent, setHeadshotContent] = useState<string>();
  const [headshotFileName, setHeadshotFileName] = useState(
    process.env.NEXT_PUBLIC_HEADSHOT || ""
  );
  const [headshotSrc, setHeadshotSrc] = useState(
    `/${process.env.NEXT_PUBLIC_HEADSHOT}`
  );
  const [backgroundColor, setBackgroundColor] = useState(
    process.env.NEXT_PUBLIC_BG_COLOR
  );
  const [backgroundImage, setBackgroundImage] = useState(
    process.env.NEXT_PUBLIC_BG_IMAGE
  );
  const [accentColor, setAccentColor] = useState(
    process.env.NEXT_PUBLIC_ACCENT_COLOR
  );
  const [secondaryAccentColor, setSecondaryAccentColor] = useState(
    process.env.NEXT_PUBLIC_SECONDARY_ACCENT_COLOR
  );
  const [linkNewTab, setLinkNewTab] = useState(
    process.env.NEXT_PUBLIC_LINK_NEW_TAB || "false"
  );
  const [password, setPassword] = useState<string>();

  const nameGetSet: LandingCms["name"] = {
    useGetter: () => useMemo(() => clientName, [clientName]),
    setter: (name: string) => {
      setClientName(name);
    },
  };

  const linkNewTabGetSet: LandingCms["linkNewTab"] = {
    useGetter: () => useMemo(() => JSON.parse(linkNewTab), [linkNewTab]),
    setter: (newTab: boolean) => {
      setLinkNewTab(JSON.stringify(newTab));
    },
  };

  const socialsGetSet: LandingCms["socialUrls"] = {
    useGetter: () => useMemo(() => JSON.parse(socialUrls), [socialUrls]),
    setter: (socials?: string[]) => {
      setSocialUrls(JSON.stringify(socials));
    },
  };

  const titleGetSet: LandingCms["title"] = {
    useGetter: () => useMemo(() => title, [title]),
    setter: setTitle,
  };

  const subtitleGetSet: LandingCms["subtitle"] = {
    useGetter: () => useMemo(() => subtitle, [subtitle]),
    setter: setSubtitle,
  };

  const actionDestinationGetSet: LandingCms["actionDestination"] = {
    useGetter: () => useMemo(() => actionDestination, [actionDestination]),
    setter: setActionDestination,
  };

  const actionStatementGetSet: LandingCms["actionStatement"] = {
    useGetter: () => useMemo(() => actionStatement, [actionStatement]),
    setter: setActionStatement,
  };

  const headshotContentGetSet: LandingCms["headshotContent"] = {
    useGetter: () => useMemo(() => headshotContent, [headshotContent]),
    setter: setHeadshotContent,
  };

  const headshotFileNameGetSet: LandingCms["headshotFileName"] = {
    useGetter: () => useMemo(() => headshotFileName, [headshotFileName]),
    setter: setHeadshotFileName,
  };

  const headshotSrcGetSet: LandingCms["headshotSrc"] = {
    useGetter: () => useMemo(() => headshotSrc, [headshotSrc]),
    setter: setHeadshotSrc,
  };

  const backgroundColorGetSet: LandingCms["backgroundColor"] = {
    useGetter: () => useMemo(() => backgroundColor, [backgroundColor]),
    setter: setBackgroundColor,
  };

  const backgroundImageGetSet: LandingCms["backgroundImage"] = {
    useGetter: () => useMemo(() => backgroundImage, [backgroundImage]),
    setter: setBackgroundImage,
  };

  const accentColorGetSet: LandingCms["accentColor"] = {
    useGetter: () => useMemo(() => accentColor, [accentColor]),
    setter: setAccentColor,
  };

  const secondaryAccentColorGetSet: LandingCms["secondaryAccentColor"] = {
    useGetter: () =>
      useMemo(() => secondaryAccentColor, [secondaryAccentColor]),
    setter: setSecondaryAccentColor,
  };

  const environmentVariables = useLandEnvVars({
    NEXT_PUBLIC_TITLE: title,
    NEXT_PUBLIC_NAME: clientName,
    NEXT_PUBLIC_SUBTITLE: subtitle,
    NEXT_PUBLIC_SOCIALS: socialUrls,
    NEXT_PUBLIC_ACTION_STATEMENT: actionStatement,
    NEXT_PUBLIC_HEADSHOT: headshotFileName,
    NEXT_PUBLIC_ACTION: actionDestination,
    NEXT_PUBLIC_BG_COLOR: backgroundColor,
    NEXT_PUBLIC_BG_IMAGE: backgroundImage,
    NEXT_PUBLIC_ACCENT_COLOR: accentColor,
    NEXT_PUBLIC_SECONDARY_ACCENT_COLOR: secondaryAccentColor,
    NEXT_PUBLIC_HIDE_ADMIN: "false",
    NEXT_PUBLIC_LINK_NEW_TAB: linkNewTab,
    NEXT_AUTH_USERNAME: session.data?.user?.email,
    NEXT_AUTH_PASSWORD: password,
  });

  const contextValue: CmsContextProps = useMemo(() => {
    return {
      setPassword,
      landingCms: {
        name: nameGetSet,
        socialUrls: socialsGetSet,
        title: titleGetSet,
        subtitle: subtitleGetSet,
        actionDestination: actionDestinationGetSet,
        actionStatement: actionStatementGetSet,
        headshotContent: headshotContentGetSet,
        headshotFileName: headshotFileNameGetSet,
        headshotSrc: headshotSrcGetSet,
        backgroundColor: backgroundColorGetSet,
        backgroundImage: backgroundImageGetSet,
        accentColor: accentColorGetSet,
        secondaryAccentColor: secondaryAccentColorGetSet,
        linkNewTab: linkNewTabGetSet,
      },
    };
  }, [headshotContent, headshotFileName, environmentVariables]);

  return (
    <CmsContext.Provider value={contextValue}>{children}</CmsContext.Provider>
  );
};
