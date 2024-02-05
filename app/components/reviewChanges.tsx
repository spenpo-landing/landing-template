'use client'
import {
  Button,
  Stack,
  Typography,
  Chip,
  CircularProgress,
  Box,
  Divider,
  FormLabel,
  Checkbox,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { ReactNode, useContext, useState } from 'react'
import { CmsContext } from '../context/cms'
import { EnvContext } from '../context/env'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import EastIcon from '@mui/icons-material/East'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { ChangePassword } from './changePassword'
import Link from 'next/link'

const ColorExample: React.FC<{ color: string; opacity?: number }> = ({
  color,
  opacity = 1,
}) => {
  return (
    <Box
      height={20}
      width={80}
      bgcolor={color}
      sx={{ opacity }}
      border="solid 1px #555"
      borderRadius={1}
    />
  )
}

const ColorCompare: React.FC<{
  condition: boolean
  oldColor: string
  newColor: string
  label: string
}> = ({ condition, oldColor, newColor, label }) => {
  return (
    condition && (
      <Stack direction="row" columnGap={3} color="#000" alignItems="center">
        {label}:
        <ColorExample color={oldColor} />
        <EastIcon sx={{ fill: '#000', fontSize: 40 }} />
        <ColorExample color={newColor} />
      </Stack>
    )
  )
}

const BgImage: React.FC<{ src: string; opacity?: number }> = ({
  src,
  opacity = 1,
}) => {
  return (
    <Box
      height={{ xs: 50, sm: 100, md: 200 }}
      width={{ xs: 50, sm: 100, md: 200 }}
      m="2px"
      sx={{
        backgroundImage: `url(${src})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        opacity,
      }}
      borderRadius={2}
      border="solid 1px #555"
    />
  )
}

const ImageCompare: React.FC<{
  condition: boolean
  oldSrc: string
  newSrc: string
  label: string
}> = ({ condition, oldSrc, newSrc, label }) => {
  return (
    condition && (
      <>
        <Typography color="#000">{label}:</Typography>
        <Stack
          direction="row"
          columnGap={{ xs: 2, sm: 5, md: 10 }}
          alignItems="center"
        >
          <BgImage src={oldSrc} opacity={0.6} />
          <EastIcon sx={{ fill: '#000', fontSize: 40 }} />
          <BgImage src={newSrc} />
        </Stack>
      </>
    )
  )
}

const TextCompare: React.FC<{
  condition: boolean
  oldText?: string
  newText: string
  label: string
}> = ({ condition, oldText, newText, label }) => {
  return (
    condition && (
      <Stack direction="row" columnGap={3} alignItems="center" color="#000">
        <Typography>{label}:</Typography>
        <Typography
          suppressHydrationWarning
          component="span"
          sx={{
            textDecoration: 'line-through',
          }}
        >
          {oldText}
        </Typography>
        <Typography suppressHydrationWarning component="span">
          {newText}
        </Typography>
      </Stack>
    )
  )
}

export const ReviewChanges: React.FC<{ children?: ReactNode }> = ({
  children: updateBtn,
}) => {
  const {
    environmentVariables,
    landingCms,
    hideAdmin: [hideAdmin, setHideAdmin],
  } = useContext(CmsContext)
  const env = useContext(EnvContext)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [noRedirect, setNoRedirect] = useState('')
  const [error, setError] = useState('')

  const file = landingCms?.headshotFile.getter()

  return (
    <>
      <Button
        onClick={() => router.push('/')}
        variant="contained"
        startIcon={<ChevronLeftIcon />}
        sx={{ mr: 'auto' }}
      >
        Back
      </Button>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={3} flex={1}>
        <Stack rowGap={1} flex={{ xs: 0, md: 1 }} alignItems="center">
          <Typography variant="h5">Content Changes</Typography>
          {Object.entries(environmentVariables).map(([key, value]) => {
            if (key.startsWith('NEXT_PUBLIC_')) {
              if (key.endsWith('_HEADSHOT'))
                return (
                  <ImageCompare
                    key={key}
                    label={env[key].label}
                    condition={!!file}
                    oldSrc={`/${env.NEXT_PUBLIC_HEADSHOT.value}`}
                    newSrc={landingCms.headshotSrc.getter() || ''}
                  />
                )
              if (key.endsWith('_SOCIALS'))
                return (
                  env[key].value !== value && (
                    <Stack
                      key={key}
                      direction="row"
                      columnGap={3}
                      alignItems="center"
                      color="#000"
                      flexWrap="wrap"
                      rowGap={1}
                    >
                      <Typography>{env[key].label}:</Typography>
                      {(JSON.parse(env[key].value!) as string[]).map((social) => {
                        const isRemoved =
                          value && !(JSON.parse(value) as string[]).includes(social)
                        const fill = '#ff0000'
                        return (
                          <Chip
                            key={social}
                            icon={<RemoveIcon sx={{ fill }} />}
                            sx={{
                              display: isRemoved ? 'flex' : 'none',
                              border: isRemoved ? `solid ${fill} 2px` : '',
                            }}
                            label={social}
                          />
                        )
                      })}
                      {value &&
                        (JSON.parse(value) as string[]).map((social) => {
                          const isNew = !(
                            JSON.parse(env[key].value!) as string[]
                          ).includes(social)
                          const fill = '#00dd00'
                          return (
                            <Chip
                              key={social}
                              icon={<AddIcon sx={{ fill }} />}
                              sx={{
                                display: isNew ? 'flex' : 'none',
                                border: isNew ? `solid ${fill} 2px` : '',
                              }}
                              label={social}
                            />
                          )
                        })}
                    </Stack>
                  )
                )
              if (key.endsWith('_COLOR'))
                return (
                  <ColorCompare
                    key={key}
                    oldColor={env[key].value!}
                    newColor={value || ''}
                    condition={env[key].value !== value}
                    label={env[key].label}
                  />
                )
              if (key.endsWith('_IMAGE'))
                return (
                  <ImageCompare
                    key={key}
                    label={env[key].label}
                    condition={
                      landingCms.backgroundImage.getter() !==
                      env.NEXT_PUBLIC_BG_IMAGE.value
                    }
                    oldSrc={env.NEXT_PUBLIC_BG_IMAGE.value!}
                    newSrc={landingCms.backgroundImage.getter()!}
                  />
                )
              if (key.endsWith('_ADMIN')) return <></>
              return (
                <TextCompare
                  key={key}
                  label={env[key].label}
                  oldText={env[key].value}
                  newText={value || ''}
                  condition={env[key].value !== value}
                />
              )
            }
          })}
        </Stack>
        <Divider flexItem sx={{ display: { md: 'none', sm: 'block' } }} />
        <Divider
          flexItem
          sx={{ display: { md: 'block', sm: 'none' } }}
          orientation="vertical"
        />
        <Stack flex={{ xs: 0, md: 1 }} alignItems="center" gap={3}>
          <Typography variant="h5">Additional Options</Typography>
          {updateBtn}
          <Stack alignItems="center">
            <Stack direction="row" gap={3} alignItems="center">
              <Stack direction="row" gap={1}>
                <AdminPanelSettingsIcon fontSize="small" />
                <FormLabel>Hide admin button</FormLabel>
              </Stack>
              <Checkbox
                checked={hideAdmin}
                onChange={(e) => setHideAdmin(e.target.checked)}
              />
            </Stack>
            {hideAdmin && (
              <Typography variant="caption">
                admin button will no longer appear in the top right corner of your
                landing page to unauthenticated visitors. you may still manually
                navigate to the relative URL /api/auth/signin to sign in as an admin.
              </Typography>
            )}
          </Stack>
          <ChangePassword />
          <Stack direction="row" columnGap={3}>
            <Button
              disabled={loading || !!noRedirect}
              sx={{ width: 100 }}
              variant="contained"
              onClick={async () => {
                setLoading(true)
                const body = new FormData()
                Object.entries(environmentVariables).forEach(([key, value]) => {
                  if (value) body.append(key, value)
                })
                if (file) {
                  body.append('file', file)
                  body.append('fileExtension', file.name.split('.').at(-1) || '')
                }
                const redeployReq = await fetch('/api/redeploy', {
                  method: 'post',
                  body,
                })
                const redeploy = await redeployReq.json()
                if (redeploy.status === 400) setError(JSON.stringify(redeploy))
                else if (redeploy.redirect) router.push(redeploy.redirect)
                else setNoRedirect(redeploy.message)
                setLoading(false)
              }}
            >
              {loading ? <CircularProgress /> : 'deploy'}
            </Button>
            <Button sx={{ width: 100 }} variant="contained" href="/">
              cancel
            </Button>
          </Stack>
          {error && (
            <Typography variant="caption" color="red">
              {error}
            </Typography>
          )}
          {noRedirect && (
            <Typography>
              {noRedirect} <Link href="/deployments/latest">Click here</Link> to
              track it&apos;s progress.
            </Typography>
          )}
        </Stack>
      </Stack>
    </>
  )
}
