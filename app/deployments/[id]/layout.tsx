import { Stack } from '@mui/material'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Stack p={{ xs: 2, md: 5 }} rowGap={3} flex={1} width="100%">
      {children}
    </Stack>
  )
}
