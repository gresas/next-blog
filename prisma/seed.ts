import { PrismaClient } from '../app/generated/prisma/client.js'

const prisma = new PrismaClient()

async function main() {
  // Criar autores
  const autores = await prisma.autor.createMany({
    data: [
      { nome: 'Mariana Silva', cidade: 'São Paulo', idade: 34, profissao: 'Jornalista' },
      { nome: 'Carlos Mendes', cidade: 'Rio de Janeiro', idade: 45, profissao: 'Editor' },
      { nome: 'Ana Costa', cidade: 'Belo Horizonte', idade: 29, profissao: 'Repórter' },
      { nome: 'João Rocha', cidade: 'Porto Alegre', idade: 38, profissao: 'Colunista' },
      { nome: 'Luciana Brito', cidade: 'Curitiba', idade: 41, profissao: 'Analista de Dados' },
    ]
  })

  const autoresCadastrados = await prisma.autor.findMany()

  const noticias = [
    {
      titulo: 'Eleições 2025: Cenário político começa a se desenhar',
      autor: 'Mariana Silva',
      deck: 'Especialistas analisam os primeiros movimentos dos pré-candidatos.',
      linhaSuporte: 'Política',
      corpo: 'Os bastidores políticos estão cada vez mais agitados à medida que as eleições se aproximam...',
    },
    {
      titulo: 'Inteligência Artificial revoluciona a medicina brasileira',
      autor: 'Carlos Mendes',
      deck: 'Novas tecnologias ajudam na detecção precoce de doenças.',
      linhaSuporte: 'Tecnologia',
      corpo: 'Com o avanço dos algoritmos de machine learning, médicos conseguem prever padrões com mais precisão...',
    },
    {
      titulo: 'Clima: Brasil enfrentará inverno mais seco dos últimos anos',
      autor: 'Ana Costa',
      deck: 'Meteorologistas alertam para impactos em plantações.',
      linhaSuporte: 'Meio Ambiente',
      corpo: 'O fenômeno climático La Niña contribui para a redução das chuvas em diversas regiões...',
    },
    {
      titulo: 'Mercado de trabalho aquece no setor de TI',
      autor: 'João Rocha',
      deck: 'Startups lideram a contratação de profissionais de tecnologia.',
      linhaSuporte: 'Economia',
      corpo: 'Empresas de tecnologia vêm liderando a retomada econômica com ofertas de trabalho remoto...',
    },
    {
      titulo: 'Carnaval 2025 será descentralizado em capitais brasileiras',
      autor: 'Luciana Brito',
      deck: 'Prefeituras apostam em blocos menores e eventos locais.',
      linhaSuporte: 'Cultura',
      corpo: 'A proposta visa evitar superlotações e ampliar a participação em bairros periféricos...',
    },
    {
      titulo: 'Vacinação contra gripe alcança 85% da população-alvo',
      autor: 'Mariana Silva',
      deck: 'Campanha do Ministério da Saúde supera expectativas.',
      linhaSuporte: 'Saúde',
      corpo: 'A cobertura vacinal atingiu índices históricos, reduzindo internações em todo o país...',
    },
    {
      titulo: 'Novas regras para empréstimos estudantis entram em vigor',
      autor: 'Carlos Mendes',
      deck: 'Governo altera taxas e amplia prazo de pagamento.',
      linhaSuporte: 'Educação',
      corpo: 'O programa FIES passará a ter novas diretrizes para facilitar o acesso ao ensino superior...',
    },
    {
      titulo: 'Fluminense vence clássico com gol nos acréscimos',
      autor: 'Ana Costa',
      deck: 'Partida eletrizante no Maracanã emociona torcedores.',
      linhaSuporte: 'Esportes',
      corpo: 'O gol decisivo saiu aos 48 do segundo tempo, garantindo vitória suada para o tricolor...',
    },
    {
      titulo: 'Exposição de arte digital atrai milhares em SP',
      autor: 'João Rocha',
      deck: 'Mostra reúne obras de artistas de 12 países.',
      linhaSuporte: 'Arte & Cultura',
      corpo: 'A mostra “Pixels em Movimento” celebra o encontro entre tecnologia e expressão artística...',
    },
    {
      titulo: 'Nova política de transporte busca integrar bicicletas e ônibus',
      autor: 'Luciana Brito',
      deck: 'Capitais adotam ciclovias e bicicletários próximos a terminais.',
      linhaSuporte: 'Cidades',
      corpo: 'Com a proposta de mobilidade sustentável, a integração já começa a surtir efeito na rotina urbana...',
    },
  ]

  // Criar notícias associando com autores reais
  for (const noticia of noticias) {
    const autor = autoresCadastrados.find(a => a.nome === noticia.autor)
    if (!autor) continue

    await prisma.noticia.create({
      data: {
        titulo: noticia.titulo,
        autor: noticia.autor,
        deck: noticia.deck,
        linhaSuporte: noticia.linhaSuporte,
        corpo: noticia.corpo,
        firstPublishAt: new Date(),
        createdById: autor.id,
      },
    })
  }

  console.log('Seed concluído com sucesso!')

}


main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
