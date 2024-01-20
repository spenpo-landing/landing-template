'use client'
import {
  Button,
  Stack,
  Typography,
  Chip,
  CircularProgress,
  Box,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { ReactNode, useContext, useState } from 'react'
import { DEFAULT_PROPS } from '../constants'
import { CmsContext } from '../context/cms'
import { EnvContext } from '../context/env'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import EastIcon from '@mui/icons-material/East'

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
      height={200}
      width={200}
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
        <Stack direction="row" columnGap={10} alignItems="center">
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

export const ReviewChanges: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const { environmentVariables, landingCms } = useContext(CmsContext)
  const env = useContext(EnvContext)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const file = landingCms?.headshotFile.getter()

  return (
    <>
      <Button
        sx={{ position: 'absolute', left: 40, top: 40 }}
        onClick={() => router.push('/')}
        variant="contained"
        startIcon={<ChevronLeftIcon />}
      >
        Back
      </Button>
      <Stack justifyContent="flex-start" mx={25} my={15} rowGap={1}>
        {children}
        {environmentVariables.map(({ key, value }) => {
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
                      const isRemoved = !(JSON.parse(value) as string[]).includes(
                        social
                      )
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
                    {(JSON.parse(value) as string[]).map((social) => {
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
                  newColor={value}
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
                    (env.NEXT_PUBLIC_BG_IMAGE.value || DEFAULT_PROPS.BG_IMAGE)
                  }
                  oldSrc={env.NEXT_PUBLIC_BG_IMAGE.value!}
                  newSrc={landingCms.backgroundImage.getter()!}
                />
              )
            return (
              <TextCompare
                key={key}
                label={env[key].label}
                oldText={env[key].value}
                newText={value}
                condition={env[key].value !== value}
              />
            )
          }
        })}
      </Stack>
      <Stack direction="row" columnGap={3}>
        <Button
          sx={{ width: 100 }}
          variant="contained"
          onClick={async () => {
            setLoading(!loading)
            //   const redeployReq = await fetch('/api/redeploy', {
            //     method: 'post',
            //     body: JSON.stringify(environmentVariables),
            //   })
            //   if (file) {
            //     const signedUrlReq = await fetch(
            //       `/api/get-signed-s3-url?fileext=${file?.name
            //         .split('.')
            //         .at(-1)}&filetype=${file?.type}`,
            //       {
            //         method: 'get',
            //       }
            //     )
            //     const signedUrl = await signedUrlReq.json()
            //     await fetch(signedUrl.url, {
            //       method: 'put',
            //       headers: { 'Content-Type': file?.type },
            //       body: file,
            //     })
            //   }
            //   await redeployReq
            //     .json()
            //     .then((res) =>
            //       router.push(
            //         `/deployments/${res.redeployRes.id}?createdAt=${res.redeployRes.createdAt}`
            //       )
            //     )
          }}
        >
          {loading ? (
            <CircularProgress style={{ height: 24.5, width: 24.5, color: '#fff' }} />
          ) : (
            'deploy'
          )}
        </Button>
        <Button sx={{ width: 100 }} variant="contained" href="/">
          cancel
        </Button>
      </Stack>
    </>
  )
}
