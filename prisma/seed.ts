import { PrismaClient, Role, StatusNoticia } from '../app/generated/prisma/client.js'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Criar editorias
  const editoriasData = [
    { nome: 'Política', description: 'Notícias sobre política nacional e internacional', slug: 'politica' },
    { nome: 'Tecnologia', description: 'Avanços e notícias do mundo da tecnologia', slug: 'tecnologia' },
    { nome: 'Meio Ambiente', description: 'Notícias ambientais e clima', slug: 'meio-ambiente' },
    { nome: 'Economia', description: 'Mercado e economia', slug: 'economia' },
    { nome: 'Cultura', description: 'Eventos culturais e artes', slug: 'cultura' },
  ]

  const editorias = []
  for (const e of editoriasData) {
    const ed = await prisma.editoria.create({ data: e })
    editorias.push(ed)
  }

  // Criar tags
  const tagsData = ['Política', 'Saúde', 'Tecnologia', 'Economia', 'Cultura', 'Esportes', 'Meio Ambiente']
  const tags = []
  for (const nome of tagsData) {
    const tag = await prisma.tag.create({ data: { nome } })
    tags.push(tag)
  }

  // Criar usuários com perfil
  const usuariosData = [
    { nome: 'Mariana Silva', email: 'mariana@exemplo.com', senha: 'senha123', role: Role.EDITOR, bio: 'Jornalista com 10 anos de experiência' },
    { nome: 'Carlos Mendes', email: 'carlos@exemplo.com', senha: 'senha123', role: Role.EDITOR, bio: 'Editor-chefe focado em tecnologia' },
    { nome: 'Ana Costa', email: 'ana@exemplo.com', senha: 'senha123', role: Role.EDITOR, bio: 'Repórter ambiental apaixonada' },
    { nome: 'João Rocha', email: 'joao@exemplo.com', senha: 'senha123', role: Role.EDITOR, bio: 'Colunista de economia' },
    { nome: 'Luciana Brito', email: 'luciana@exemplo.com', senha: 'senha123', role: Role.EDITOR, bio: 'Analista cultural' },
  ]

  const usuarios = []
  for (const u of usuariosData) {
    const senhaHash = await bcrypt.hash(u.senha, 10)
    const usuario = await prisma.usuario.create({
      data: {
        nome: u.nome,
        email: u.email,
        senhaHash,
        role: u.role,
        perfil: {
          create: { bio: u.bio }
        }
      },
      include: { perfil: true }
    })
    usuarios.push(usuario)
  }

  // Criar notícias com ligação a usuário, editoria e tags
  const noticiasData = [
    {
      titulo: 'Eleições 2025: Cenário político começa a se desenhar',
      autor: 'Mariana Silva',
      deck: 'Especialistas analisam os primeiros movimentos dos pré-candidatos.',
      linhaSuporte: 'Política',
      corpo: 'Os bastidores políticos estão cada vez mais agitados à medida que as eleições se aproximam...',
      status: StatusNoticia.PUBLICADO,
      publicado: true,
      editoriaNome: 'Política',
      tagNomes: ['Política']
    },
    {
      titulo: 'Inteligência Artificial revoluciona a medicina brasileira',
      autor: 'Carlos Mendes',
      deck: 'Novas tecnologias ajudam na detecção precoce de doenças.',
      linhaSuporte: 'Tecnologia',
      corpo: 'Com o avanço dos algoritmos de machine learning, médicos conseguem prever padrões com mais precisão...',
      status: StatusNoticia.PUBLICADO,
      publicado: true,
      editoriaNome: 'Tecnologia',
      tagNomes: ['Tecnologia', 'Saúde']
    },
    {
      titulo: 'Clima: Brasil enfrentará inverno mais seco dos últimos anos',
      autor: 'Ana Costa',
      deck: 'Meteorologistas alertam para impactos em plantações.',
      linhaSuporte: 'Meio Ambiente',
      corpo: 'O fenômeno climático La Niña contribui para a redução das chuvas em diversas regiões...',
      status: StatusNoticia.REVISADO,
      publicado: false,
      editoriaNome: 'Meio Ambiente',
      tagNomes: ['Meio Ambiente']
    },
  ]

  for (const noticia of noticiasData) {
    const usuario = usuarios.find(u => u.nome === noticia.autor)
    const editoria = editorias.find(e => e.nome === noticia.editoriaNome)
    const noticiaTags = tags.filter(t => noticia.tagNomes.includes(t.nome))

    if (!usuario) continue

    await prisma.noticia.create({
      data: {
        titulo: noticia.titulo,
        autor: noticia.autor,
        deck: noticia.deck,
        linhaSuporte: noticia.linhaSuporte,
        corpo: noticia.corpo,
        status: noticia.status,
        publicado: noticia.publicado,
        createdById: usuario.id,
        editoriaId: editoria?.id,
        tags: {
          connect: noticiaTags.map(t => ({ id: t.id }))
        }
      }
    })
  }

  // Criar comentários
  const noticiasCriadas = await prisma.noticia.findMany()
  const usuarioComentario = usuarios[0]
  if (noticiasCriadas.length > 0 && usuarioComentario) {
    await prisma.comentarios.create({
      data: {
        title: 'Muito bom!',
        content: 'Excelente matéria, muito informativa.',
        noticiaId: noticiasCriadas[0].id,
        usuarioId: usuarioComentario.id
      }
    })
  }

  // Criar contatos
  const contatosData = [
    { nome: 'Visitante 1', email: 'visitante1@email.com', mensagem: 'Gostei muito do site!' },
    { nome: 'Visitante 2', email: 'visitante2@email.com', mensagem: 'Tenho uma dúvida sobre uma notícia.' }
  ]
  for (const c of contatosData) {
    await prisma.contato.create({ data: c })
  }

  console.log('Seed concluído com sucesso!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
