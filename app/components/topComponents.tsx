import { Stack, Button, Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { LandingPageContext } from '../context/landingPage'
import { useSession } from 'next-auth/react'

export const TopComponents: React.FC = () => {
  const router = useRouter()
  const session = useSession()
  const { editable } = useContext(LandingPageContext)

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
            mt: editable?.[0] ? { md: 0, sm: 15 } : { md: 0, sm: 5 },
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
