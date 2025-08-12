'use client'
import React from 'react'
import {
  Card,
  CardContent,
  Typography
} from '@mui/material'
import { useRouter } from 'next/navigation'
import Link from 'next/link'


type Noticia = {
  id: string
  titulo: string
  deck: string
  updatedAt: string
  createdAt: string
  linhaSuporte: string
  firstPublishAt: string
  autor: string
  createdBy?: {
    nome: string
  }
}

function formatarData(data: string) {
  const d = new Date(data)
  return d.toLocaleDateString('pt-BR')
}

export default function NoticiaCard({ noticia }: { noticia: Noticia }) {
  const router = useRouter()

  const isAtualizado = noticia.updatedAt !== noticia.firstPublishAt
  const dataLabel = isAtualizado ? 'Atualizado em' : 'Publicado em'
  const dataValue = isAtualizado ? noticia.updatedAt : noticia.firstPublishAt

  return (
    <Link href={`/noticia/${noticia.id}`} passHref style={{ textDecoration: 'none' }}>
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardContent>
        <Typography variant="subtitle2" color="secondary">{noticia.linhaSuporte}</Typography>
            <Typography variant="h5">{noticia.titulo}</Typography>
            <Typography variant="subtitle1" gutterBottom>{noticia.deck}</Typography>
            <Typography variant="body2" color="text.secondary">Por {noticia.autor}</Typography>

            {noticia.updatedAt === noticia.createdAt ? (
            <Typography variant="caption" color="text.secondary">
                Publicado em {formatarData(noticia.createdAt)}
            </Typography>
            ) : (
            <Typography variant="caption" color="text.secondary">
                Atualizado em {formatarData(noticia.updatedAt)}
            </Typography>
            )}
      </CardContent>

      {/* <CardActions>
        <Button size="small" onClick={() => router.push(`/noticia/${noticia.id}`)}>
          Ler mais
        </Button>
      </CardActions> */}
    </Card>
    </Link>
  )
}
