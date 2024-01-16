'use client'
import { useEffect, useState } from 'react'

export type VercelReadyState =
  | 'QUEUED'
  | 'BUILDING'
  | 'ERROR'
  | 'INITIALIZING'
  | 'READY'
  | 'CANCELED'

type Deployment = {
  alias: string[]
  createdAt: number
  ready: number
  readyState: VercelReadyState
  inspectorUrl: string
  buildingAt: number
}

type UseDeploymentProps = {
  deploymentEvents: string
  metadata?: Deployment
}

const getDeployment = async (uid: string) =>
  fetch(`/api/getVercelDeployment?uid=${uid}`)

const getDeploymentEvents = async (uid: string) =>
  fetch(`/api/getVercelDeploymentEvents?uid=${uid}`)

export const useDeployment = (id: string): UseDeploymentProps => {
  const [deploymentEvents, setDeploymentEvents] = useState('')
  const [metadata, setMetadata] = useState<Deployment>()
  const [error, setError] = useState()

  useEffect(() => {
    if (
      !['READY', 'CANCELED', 'ERROR'].includes(metadata?.readyState || '') &&
      !error
    ) {
      const poll = async () =>
        getDeployment(id).then(async (res) => {
          const data = await res.json()
          if (data.error) setError(data.error)
          else setMetadata(data)
        })
      poll()
      const pollingId = window.setInterval(poll, 3000)

      return () => {
        clearInterval(pollingId)
      }
    }
  }, [metadata, id, error])

  useEffect(() => {
    getDeploymentEvents(id).then(async (response) => {
      if (!response.body) {
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (
        !done &&
        !['READY', 'CANCELED', 'ERROR'].includes(metadata?.readyState || '')
      ) {
        const { value, done: readerDone } = await reader.read()
        const decodedChunk = decoder.decode(value, { stream: true })
        done = readerDone
        setDeploymentEvents((prev) => prev + decodedChunk)
      }
    })
  }, [id, metadata?.readyState])

  return { deploymentEvents, metadata }
}
