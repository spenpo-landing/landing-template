import argon2 from 'argon2'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const currentPassword = process.env.NEXT_AUTH_PASSWORD!

  const BODY = await req.json()

  const verifyOld = await argon2.verify(currentPassword, BODY.oldPassword)

  if (verifyOld) {
    if (BODY.newPassword === BODY.confirmPassword) {
      const hash = await argon2.hash(BODY.newPassword)
      return NextResponse.json({ status: 200, hash })
    } else
      return NextResponse.json({
        status: 400,
        message: 'new passwords do not match',
      })
  } else
    return NextResponse.json({
      status: 400,
      message: 'password verification failed',
    })
}
