/* eslint-disable @typescript-eslint/no-explicit-any */
import { runWorkflow } from '@/app/services/github'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const BODY = await req.json()

  try {
    await runWorkflow(BODY.projectName, BODY.workflow)
  } catch (err: any) {
    return NextResponse.json({ status: 400, ...err })
  }

  return NextResponse.json({ status: 200, message: 'success' })
}
