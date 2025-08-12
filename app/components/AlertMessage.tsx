'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import { Alert, Collapse, IconButton, Grow, Slide } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

type Props = {
  message: string
  severity?: 'error' | 'info' | 'success' | 'warning'
  duration?: number // in ms
  animation?: 'slide' | 'grow' | 'none'
  onClose?: () => void
}

export default function AlertMessage({
  message,
  severity = 'info',
  duration = 3000,
  animation = 'grow',
  onClose,
}: Props) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (duration <= 0) return
    const timer = setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const AlertContent = (
    <Alert
      severity={severity}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => {
            setVisible(false)
            onClose?.()
          }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
      sx={{ mb: 2 }}
    >
      {message}
    </Alert>
  )

  if (animation === 'slide') {
    return (
      <Slide in={visible} direction="down" mountOnEnter unmountOnExit>
        {AlertContent}
      </Slide>
    )
  }

  if (animation === 'grow') {
    return (
      <Grow in={visible} mountOnEnter unmountOnExit>
        {AlertContent}
      </Grow>
    )
  }

  return (
    <Collapse in={visible} mountOnEnter unmountOnExit>
      {AlertContent}
    </Collapse>
  )
}
