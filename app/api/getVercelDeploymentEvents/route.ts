/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest } from 'next/server'
import { getDeploymentEvents } from '@/app/services/vercel'

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get('uid')

  const deploymentEvents = await getDeploymentEvents(String(uid))

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of deploymentEvents.body as any) {
        try {
          controller.enqueue(chunk)
        } catch (e) {
          controller.error(e)
        }
      }
      controller.close()
    },
  })

  return new Response(stream)
}
