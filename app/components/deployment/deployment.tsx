'use client'
import React, { ReactNode, useEffect, useMemo, useRef } from 'react'
import { CircularProgress, Stack, SxProps, Typography } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import { VercelReadyState, useDeployment } from './useDeployment'
import { DeploymentDate } from './deploymentDate'
import { useStopwatch } from 'react-timer-hook'

const METADATA_SX = {
  border: 'solid #555 2px',
  borderRadius: 2,
  flex: 1,
  p: 3,
}

const NeWTabLink: React.FC<{ url: string; sx?: SxProps }> = ({ url, sx }) => {
  let destination = url
  if (url.slice(0, 4) !== 'http') destination = `https://${url}`
  const onClick = useRef(() => {})
  useEffect(() => {
    onClick.current = () => {
      window.open(destination, '_blank', 'noopener,noreferrer')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Typography
      component="span"
      sx={{
        ...sx,
        textDecoration: 'underline',
        ':hover': {
          cursor: 'pointer',
        },
      }}
      onClick={() => onClick.current()}
    >
      {url}
    </Typography>
  )
}

const SmallHeader: React.FC<{ children: ReactNode }> = ({ children }) => (
  <Typography component="span" sx={{ fontSize: 12, color: '#555' }}>
    {children}
  </Typography>
)

const readyStateColors: Record<VercelReadyState, string> = {
  READY: '#00ff00',
  QUEUED: '#555555',
  ERROR: '#ff0000',
  CANCELED: '#ff5500',
  INITIALIZING: '#0099ff',
  BUILDING: '#5555ff',
}

type DeploymentEvent = {
  type: string
  created: number
  payload: {
    deploymentId: string
    info: {
      type: string
      name: string
      entrypoint: string
    }
    text: string
    id: string
    date: number
    serial: string
  }
}

export const Deployment: React.FC<{ id: string; createdAt: number }> = ({
  id,
  createdAt,
}) => {
  const { deploymentEvents: deploymentEventsStr, metadata } = useDeployment(id)

  const deploymentEvents = useMemo(
    () =>
      deploymentEventsStr.split(`}}\n`).reduce((p: DeploymentEvent[], c) => {
        let str

        try {
          str = JSON.parse(`${c}}}`)
        } catch {
          return p
        }

        const ids = p.map((event) => event.payload.id)
        if (!ids.includes(str.payload?.id)) p.push(str)
        return p
      }, []),
    [deploymentEventsStr]
  )

  const offsetTimestamp = useMemo(() => {
    const now = Number(new Date())
    let diff = now
    if (metadata?.buildingAt) {
      diff -= metadata.buildingAt
    } else {
      diff -= createdAt
    }
    return new Date(now + diff)
  }, [createdAt, metadata?.buildingAt])

  const { minutes, seconds, reset } = useStopwatch({
    autoStart: true,
    offsetTimestamp,
  })

  useEffect(() => {
    reset(offsetTimestamp)
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [offsetTimestamp])

  return (
    <>
      <Stack gap={3} direction={{ xs: 'column', md: 'row' }}>
        <Stack sx={METADATA_SX}>
          <SmallHeader>Status</SmallHeader>
          <Typography component="span">
            {metadata?.readyState && (
              <CircleIcon
                sx={{ fill: readyStateColors[metadata.readyState], height: 12 }}
              />
            )}
            {metadata?.readyState}
          </Typography>
        </Stack>
        <Stack sx={METADATA_SX}>
          <SmallHeader>Duration</SmallHeader>
          {metadata &&
          ['READY', 'CANCELED', 'ERROR'].includes(metadata.readyState) ? (
            <Typography>{`${Math.floor(
              (metadata?.ready - metadata?.buildingAt) / 1000 / 60
            )}m ${(
              (((metadata?.ready - metadata?.buildingAt) / 1000 / 60) % 1) *
              60
            ).toFixed()}s`}</Typography>
          ) : (
            <Typography>
              <CircularProgress
                style={{
                  height: '12px !important',
                  width: '12px !important',
                  color: '#000',
                }}
              />
              <Typography
                suppressHydrationWarning
                component="span"
                ml={1}
              >{`${minutes}m ${seconds}s`}</Typography>
            </Typography>
          )}
        </Stack>
        <Stack sx={METADATA_SX}>
          <SmallHeader>Domains</SmallHeader>
          {metadata?.alias.map((alias) => (
            <Typography key={alias}>
              <NeWTabLink url={alias} />
            </Typography>
          ))}
        </Stack>
      </Stack>
      <Stack
        bgcolor="#000"
        color="#fff"
        borderRadius={1}
        px={2}
        pt={4}
        pb={1}
        flex={1}
      >
        {metadata?.ready && (
          <Typography
            fontFamily="var(--font-mono)"
            mb={1}
            sx={{ color: readyStateColors[metadata.readyState] }}
          >{`${metadata.readyState === 'READY' ? '' : '...'} ${
            metadata.readyState
          }`}</Typography>
        )}
        {deploymentEvents?.map(
          (event) =>
            event.created && (
              <Stack direction="row" columnGap={5} key={event.payload.id}>
                <DeploymentDate date={event.created} />
                <Typography
                  flex={1}
                  sx={{ whiteSpace: 'pre-wrap' }}
                  fontFamily="var(--font-mono)"
                >
                  {event.payload.text}
                </Typography>
              </Stack>
            )
        )}
        {metadata?.readyState === 'READY' && metadata?.alias[0] && (
          <Typography
            fontFamily="var(--font-mono)"
            mt={1}
            sx={{
              color: readyStateColors[metadata.readyState],
            }}
          >
            Deployed successfully to:{' '}
            <NeWTabLink
              url={metadata.alias[0]}
              sx={{
                fontFamily: 'var(--font-mono)',
              }}
            />
          </Typography>
        )}
      </Stack>
    </>
  )
}
