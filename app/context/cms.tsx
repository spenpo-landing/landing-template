'use client'
import { useSession } from 'next-auth/react'
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useMemo,
  useState,
} from 'react'
import type { SpenpoLandingCms, SpenpoLandingCmsGetSet } from 'spenpo-landing'

type CmsContextProps = {
  setPassword: Dispatch<SetStateAction<string | undefined>>
  hideAdmin: [boolean, Dispatch<SetStateAction<boolean>>]
  landingCms: SpenpoLandingCms
  environmentVariables: { [key: string]: string | undefined }
}

export const CmsContext = createContext({} as CmsContextProps)

export const CmsContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const session = useSession()

  const clientName = useState<string | undefined>(process.env.NEXT_PUBLIC_NAME)
  const title = useState<string | undefined>(process.env.NEXT_PUBLIC_TITLE)
  const subtitle = useState<string | undefined>(process.env.NEXT_PUBLIC_SUBTITLE)
  const [socialUrls, setSocialUrls] = useState<string | undefined>(
    process.env.NEXT_PUBLIC_SOCIALS
  )
  const actionDestination = useState(process.env.NEXT_PUBLIC_ACTION)
  const actionStatement = useState<string | undefined>(
    process.env.NEXT_PUBLIC_ACTION_STATEMENT
  )
  const headshotSrc = useState<string | undefined>(
    process.env.NEXT_PUBLIC_HEADSHOT || '/default.svg'
  )
  const backgroundColor = useState<string | undefined>(
    process.env.NEXT_PUBLIC_BG_COLOR
  )
  const backgroundImage = useState<string | undefined>(
    process.env.NEXT_PUBLIC_BG_IMAGE
  )
  const accentColor = useState<string | undefined>(
    process.env.NEXT_PUBLIC_ACCENT_COLOR
  )
  const secondaryAccentColor = useState<string | undefined>(
    process.env.NEXT_PUBLIC_SECONDARY_ACCENT_COLOR
  )
  const [password, setPassword] = useState<string>()
  const [hideAdmin, setHideAdmin] = useState<boolean>(
    process.env.NEXT_PUBLIC_HIDE_ADMIN === 'true'
  )

  const file = useState<File>()

  const socialsGetSet: SpenpoLandingCms['socialUrls'] = useMemo(() => {
    return {
      getter: () => {
        if (socialUrls) return JSON.parse(socialUrls)
      },
      setter: (socials?: string[]) => {
        setSocialUrls(JSON.stringify(socials))
      },
    }
  }, [socialUrls])

  function getSet<T>([state, setState]: [
    T,
    Dispatch<SetStateAction<T>>
  ]): SpenpoLandingCmsGetSet<T> {
    return {
      getter: () => state,
      setter: setState,
    }
  }

  const environmentVariables = {
    NEXT_PUBLIC_TITLE: title[0],
    NEXT_PUBLIC_NAME: clientName[0],
    NEXT_PUBLIC_SUBTITLE: subtitle[0],
    NEXT_PUBLIC_SOCIALS: socialUrls,
    NEXT_PUBLIC_ACTION_STATEMENT: actionStatement[0],
    NEXT_PUBLIC_ACTION: actionDestination[0],
    NEXT_PUBLIC_BG_COLOR: backgroundColor[0],
    NEXT_PUBLIC_BG_IMAGE: backgroundImage[0],
    NEXT_PUBLIC_ACCENT_COLOR: accentColor[0],
    NEXT_PUBLIC_SECONDARY_ACCENT_COLOR: secondaryAccentColor[0],
    NEXT_PUBLIC_HIDE_ADMIN: `${hideAdmin}`,
    NEXT_AUTH_USERNAME: session.data?.user?.email,
    NEXT_AUTH_PASSWORD: password,
    NEXT_PUBLIC_HEADSHOT: headshotSrc[0],
  }

  const contextValue: CmsContextProps = useMemo(() => {
    const landingCms: SpenpoLandingCms = {
      name: getSet(clientName),
      socialUrls: socialsGetSet,
      title: getSet(title),
      subtitle: getSet(subtitle),
      actionDestination: getSet(actionDestination),
      actionStatement: getSet(actionStatement),
      headshotSrc: getSet(headshotSrc),
      headshotFile: getSet(file),
      backgroundColor: getSet(backgroundColor),
      backgroundImage: getSet(backgroundImage),
      accentColor: getSet(accentColor),
      secondaryAccentColor: getSet(secondaryAccentColor),
    }
    return {
      setPassword,
      hideAdmin: [hideAdmin, setHideAdmin],
      landingCms,
      environmentVariables,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    headshotSrc,
    clientName,
    title,
    subtitle,
    actionDestination,
    actionStatement,
    accentColor,
    secondaryAccentColor,
    backgroundColor,
    backgroundImage,
    socialUrls,
    file,
    hideAdmin,
    password,
  ])

  return <CmsContext.Provider value={contextValue}>{children}</CmsContext.Provider>
}
