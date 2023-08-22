"use client";
import { CmsGetSet, LandingCms } from "../components/landingPage";
import { DEFAULT_PROPS } from "../components/landingPage/constants";
import { EnvVariable, useLandEnvVars } from "../hooks/useEnvVariables";
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
  environmentVariables: EnvVariable[];
};

export const CmsContext = createContext({} as CmsContextProps);

export const CmsContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const session = useSession();

  const clientName = useState(process.env.NEXT_PUBLIC_NAME || "not found");
  const title = useState(process.env.NEXT_PUBLIC_TITLE || "not found");
  const subtitle = useState<string>(
    process.env.NEXT_PUBLIC_SUBTITLE || "not found"
  );
  const [socialUrls, setSocialUrls] = useState<string>(
    process.env.NEXT_PUBLIC_SOCIALS || "[]"
  );
  const actionDestination = useState(process.env.NEXT_PUBLIC_ACTION);
  const actionStatement = useState<string | undefined>(
    process.env.NEXT_PUBLIC_ACTION_STATEMENT || "not found"
  );
  const headshotContent = useState<string>();
  const headshotFileName = useState(process.env.NEXT_PUBLIC_HEADSHOT || "");
  const headshotSrc = useState(`/${process.env.NEXT_PUBLIC_HEADSHOT}`);
  const backgroundColor = useState<string | undefined>(
    process.env.NEXT_PUBLIC_BG_COLOR || DEFAULT_PROPS.BG_COLOR
  );
  const backgroundImage = useState<string | undefined>(
    process.env.NEXT_PUBLIC_BG_IMAGE || DEFAULT_PROPS.BG_IMAGE
  );
  const accentColor = useState<string | undefined>(
    process.env.NEXT_PUBLIC_ACCENT_COLOR || DEFAULT_PROPS.ACCENT_COLOR
  );
  const secondaryAccentColor = useState<string | undefined>(
    process.env.NEXT_PUBLIC_SECONDARY_ACCENT_COLOR ||
      DEFAULT_PROPS.SECONDARY_ACCENT_COLOR
  );
  const [linkNewTab, setLinkNewTab] = useState(
    process.env.NEXT_PUBLIC_LINK_NEW_TAB || "false"
  );
  const [password, setPassword] = useState<string>();

  const linkNewTabGetSet: LandingCms["linkNewTab"] = useMemo(() => {
    return {
      getter: () => JSON.parse(linkNewTab),
      setter: (newTab: boolean) => {
        setLinkNewTab(JSON.stringify(newTab));
      },
    };
  }, [linkNewTab]);

  const socialsGetSet: LandingCms["socialUrls"] = useMemo(() => {
    return {
      getter: () => JSON.parse(socialUrls),
      setter: (socials?: string[]) => {
        setSocialUrls(JSON.stringify(socials));
      },
    };
  }, [socialUrls]);

  function getSet<T>([state, setState]: [
    T,
    Dispatch<SetStateAction<T>>
  ]): CmsGetSet<T> {
    return {
      getter: () => state,
      setter: setState,
    };
  }

  const environmentVariables = useLandEnvVars({
    NEXT_PUBLIC_TITLE: title[0],
    NEXT_PUBLIC_NAME: clientName[0],
    NEXT_PUBLIC_SUBTITLE: subtitle[0],
    NEXT_PUBLIC_SOCIALS: socialUrls,
    NEXT_PUBLIC_ACTION_STATEMENT: actionStatement[0],
    NEXT_PUBLIC_HEADSHOT: headshotFileName[0],
    NEXT_PUBLIC_ACTION: actionDestination[0],
    NEXT_PUBLIC_BG_COLOR: backgroundColor[0],
    NEXT_PUBLIC_BG_IMAGE: backgroundImage[0],
    NEXT_PUBLIC_ACCENT_COLOR: accentColor[0],
    NEXT_PUBLIC_SECONDARY_ACCENT_COLOR: secondaryAccentColor[0],
    NEXT_PUBLIC_HIDE_ADMIN: "false",
    NEXT_PUBLIC_LINK_NEW_TAB: linkNewTab,
    NEXT_AUTH_USERNAME: session.data?.user?.email,
    NEXT_AUTH_PASSWORD: password,
  });

  const contextValue: CmsContextProps = useMemo(() => {
    console.log(clientName[0]);

    return {
      setPassword,
      landingCms: {
        name: getSet(clientName),
        socialUrls: socialsGetSet,
        title: getSet(title),
        subtitle: getSet(subtitle),
        actionDestination: getSet(actionDestination),
        actionStatement: getSet(actionStatement),
        headshotContent: getSet(headshotContent),
        headshotFileName: getSet(headshotFileName),
        headshotSrc: getSet(headshotSrc),
        backgroundColor: getSet(backgroundColor),
        backgroundImage: getSet(backgroundImage),
        accentColor: getSet(accentColor),
        secondaryAccentColor: getSet(secondaryAccentColor),
        linkNewTab: linkNewTabGetSet,
      },
      environmentVariables,
    };
  }, [
    headshotSrc,
    headshotContent,
    headshotFileName,
    clientName,
    title,
    subtitle,
    actionDestination,
    actionStatement,
    accentColor,
    secondaryAccentColor,
    backgroundColor,
    backgroundImage,
    linkNewTabGetSet,
    socialsGetSet,
    environmentVariables,
  ]);

  return (
    <CmsContext.Provider value={contextValue}>{children}</CmsContext.Provider>
  );
};
