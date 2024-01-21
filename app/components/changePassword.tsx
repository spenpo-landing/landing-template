import React, { useContext, useState } from 'react'
import { Stack, TextField } from '@mui/material'
import { CmsContext } from '../context/cms'

export const ChangePassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { setPassword } = useContext(CmsContext)

  return (
    <Stack gap={1}>
      <TextField
        onChange={(e) => setOldPassword(e.target.value)}
        size="small"
        label="Old Password"
        type="password"
      />
      <TextField
        onChange={(e) => setNewPassword(e.target.value)}
        error={newPassword !== confirmPassword}
        size="small"
        label="New Password"
        type="password"
      />
      <TextField
        onChange={async (e) => {
          setConfirmPassword(e.target.value)
          if (newPassword === e.target.value) {
            const change = await fetch('/api/changePassword', {
              method: 'post',
              body: JSON.stringify({
                oldPassword,
                newPassword,
                confirmPassword: e.target.value,
              }),
            })
            const changeRes = await change.json()
            if (changeRes.status === 200) setPassword(changeRes.hash)
          }
        }}
        error={newPassword !== confirmPassword}
        size="small"
        label="Confirm New Password"
        type="password"
      />
    </Stack>
  )
}
