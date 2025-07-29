'use client'
import { InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'


interface PasswordToggleAdornmentProps {
  visible: boolean
  onToggle: () => void
}

export default function PasswordToggleAdornment({
  visible,
  onToggle,
}: PasswordToggleAdornmentProps) {
  return (
    <InputAdornment position="end">
      <IconButton onClick={onToggle} edge="end">
        {visible ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  )
}
