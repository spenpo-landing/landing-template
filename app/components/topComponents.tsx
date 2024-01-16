'use client'
import { Stack, Button, Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useSession } from 'next-auth/react'

export const TopComponents: React.FC<{ editable: boolean }> = ({ editable }) => {
  const router = useRouter()
  const session = useSession()

  return (
    session.status === 'authenticated' && (
      <Stack
        flexDirection={{ sm: 'row' }}
        justifyContent="space-between"
        width="100%"
        rowGap={3}
      >
        <Box
          component="span"
          sx={{
            mr: { md: 5, sm: 5, xs: 'auto' },
            mt: editable ? { md: 0, sm: 15 } : { md: 0, sm: 5 },
            ml: { xs: 'auto' },
          }}
        >
          <Button
            onClick={() => router.push('/admin')}
            variant="contained"
            sx={{ ml: 'auto', mr: 3 }}
            endIcon={<ChevronRightIcon />}
          >
            review changes
          </Button>
        </Box>
      </Stack>
    )
  )
}
