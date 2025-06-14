import { PrismaClient } from '../app/generated/prisma/client.js'

const prisma = new PrismaClient()

async function main() {
  const noticias = [
    {
      titulo: "Inteligência Artificial transforma redações jornalísticas",
      autor: "Guilherme Rondon",
      deck: "Ferramentas de IA estão mudando o dia a dia de repórteres e editores",
      linhaSuporte: "Especial",
      corpo: "Nos últimos dois anos, grandes veículos de imprensa começaram a incorporar soluções de inteligência artificial em seus fluxos de produção. Desde sugestões automáticas de títulos até a geração de textos completos, os algoritmos agora participam ativamente da criação de conteúdo jornalístico."
    },
    {
      titulo: "Rio de Janeiro registra o dia mais quente do ano",
      autor: "Carla Menezes",
      deck: "Temperatura chegou a 43ºC na zona oeste da capital",
      linhaSuporte: "Clima",
      corpo: "A cidade do Rio de Janeiro teve nesta terça-feira o dia mais quente de 2025 até agora, com termômetros marcando 43,2ºC em Bangu. A sensação térmica ultrapassou 50ºC em diversas regiões, segundo o Alerta Rio."
    },
    {
      titulo: "Startup brasileira cria tecnologia para purificar água com luz solar",
      autor: "Rodrigo Lemos",
      deck: "Iniciativa promete impacto positivo em comunidades sem saneamento básico",
      linhaSuporte: "Inovação",
      corpo: "A startup AquaLuz, de São Paulo, desenvolveu um sistema portátil capaz de purificar água utilizando apenas luz solar. O projeto já está sendo testado em regiões do sertão nordestino e deve ser expandido para outros países da América Latina."
    },
    {
      titulo: "Brasil vence Argentina e avança para a final da Copa América",
      autor: "Luiz Fernando Vieira",
      deck: "Com dois gols de Vini Jr, seleção garante vaga na decisão",
      linhaSuporte: "Esportes",
      corpo: "Em uma partida intensa no Maracanã, o Brasil superou a Argentina por 2 a 1 e garantiu vaga na final da Copa América. Os gols brasileiros foram marcados por Vinícius Júnior, enquanto Messi descontou em cobrança de falta."
    },
    {
      titulo: "Novo parque linear é inaugurado em Niterói com ciclovia e área de lazer",
      autor: "Beatriz Campos",
      deck: "Espaço revitalizado deve beneficiar mais de 50 mil moradores",
      linhaSuporte: "Cidades",
      corpo: "A Prefeitura de Niterói inaugurou nesta sexta-feira o novo parque linear do Barreto, com 2,5 km de ciclovia, quadras esportivas e áreas verdes. O projeto é parte do plano de reurbanização da Zona Norte da cidade."
    }
  ]

  for (const noticia of noticias) {
    await prisma.noticia.create({ data: noticia })
  }

  console.log("Base populada com notícias de exemplo 🚀")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
