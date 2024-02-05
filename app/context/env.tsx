'use client'
import React, { ReactNode, createContext, useMemo } from 'react'

type EnvContextProps = Record<string, { value: string | undefined; label: string }>

export const EnvContext = createContext({} as EnvContextProps)

export const EnvContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const contextValue: EnvContextProps = useMemo(() => {
    return {
      NEXT_PUBLIC_HEADSHOT: {
        value: process.env.NEXT_PUBLIC_HEADSHOT,
        label: 'Headshot',
      },
      NEXT_PUBLIC_TITLE: {
        value: process.env.NEXT_PUBLIC_TITLE,
        label: 'Title',
      },
      NEXT_PUBLIC_NAME: { value: process.env.NEXT_PUBLIC_NAME, label: 'Name' },
      NEXT_PUBLIC_SUBTITLE: {
        value: process.env.NEXT_PUBLIC_SUBTITLE,
        label: 'Subtitle',
      },
      NEXT_PUBLIC_SOCIALS: {
        value: process.env.NEXT_PUBLIC_SOCIALS,
        label: 'Social Links',
      },
      NEXT_PUBLIC_ACTION_STATEMENT: {
        value: process.env.NEXT_PUBLIC_ACTION_STATEMENT,
        label: 'Action Statement',
      },
      NEXT_PUBLIC_ACTION: {
        value: process.env.NEXT_PUBLIC_ACTION,
        label: 'Action Destination',
      },
      NEXT_PUBLIC_BG_COLOR: {
        value: process.env.NEXT_PUBLIC_BG_COLOR,
        label: 'Background Color',
      },
      NEXT_PUBLIC_BG_IMAGE: {
        value: process.env.NEXT_PUBLIC_BG_IMAGE,
        label: 'Background Image',
      },
      NEXT_PUBLIC_ACCENT_COLOR: {
        value: process.env.NEXT_PUBLIC_ACCENT_COLOR,
        label: 'Accent Color',
      },
      NEXT_PUBLIC_SECONDARY_ACCENT_COLOR: {
        value: process.env.NEXT_PUBLIC_SECONDARY_ACCENT_COLOR,
        label: 'Secondary Accent Color',
      },
    }
  }, [])

  return <EnvContext.Provider value={contextValue}>{children}</EnvContext.Provider>
}
