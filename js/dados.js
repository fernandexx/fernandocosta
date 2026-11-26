// =========================================================
// CONTEÚDO DO SITE — edite só este arquivo para mudar textos,
// projetos, ordem e links do Vimeo. O layout se monta sozinho.
//
// Vídeos: cole o link inteiro do Vimeo ou do YouTube (pode ser "não listado").
//   Ex.: videoPrincipal: 'https://vimeo.com/123456789'   ou   'https://youtu.be/AbCdEfGhIjk'
//   Vídeos para redes: sociais: ['link 1', 'link 2', ...]  (deixe '' para um espaço vazio)
//   Ou um arquivo MP4 direto no site: 'assets/videos/nome.mp4'  (veja assets/videos/LEIA-ME.txt)
// Textos com [colchetes] são provisórios: troque pelo texto real.
// Thumb em alta: adicione  thumb: 'assets/thumbs/amazon.jpg',  dentro do projeto.
// Fotos de uma galeria: liste em  fotos: [...]  na ordem em que devem aparecer (a primeira vira a capa).
// Enquadramento: foco: '50% 20%' diz onde fica o rosto (horizontal, vertical) para os cortes não cortarem a cabeça.
// =========================================================

// Clientes que aparecem girando no círculo (seção filmagem / fotografia / ...)
const CLIENTES = ['HERBALIFE', 'KLABIN', 'ADIDAS', 'NEWSPACE', 'AMAZON', 'NATURA', 'LEROY MERLIN', 'KABUM!', 'DESCOMPLICA', 'VALE', 'CARBONEXT', 'ARTPLAN', 'SETE01', 'ROCK IN RIO', 'BASE'];

// Abertura: 'video' (só o showreel, sem nome), 'sutil', 'meio-tom', 'magnetico' ou 'estrelas'
const ABERTURA_PADRAO = 'video';
// true mostra os botões de teste embaixo do nome; false esconde (use false no site no ar)
const MOSTRAR_SELETOR = false;

// Vídeo de compilação que roda em tela cheia atrás do nome, na abertura (link do Vimeo ou YouTube)
const SHOWREEL = '';

// Montagem da capa de Vídeo (showreel ao vivo): cortes rápidos em loop.
// link = vídeo do Vimeo · inicio = segundo onde o corte começa · dur = duração do corte (s)
// vertical: true para vídeos 9:16 (preenchem a tela) · foco: altura do enquadramento (0 = topo, 100 = base)
const MONTAGEM_VIDEO = [
  // takes de 3 a 3,5 s · verticais aparecem inteiros no centro · sem Cristiano Ronaldo
  { link: 'https://vimeo.com/1243476834', inicio: 11, dur: 4 },                    // deserto — atriz caminhando
  { link: 'assets/videos/heineken-gif.mp4', inicio: 0, dur: 3.6 },                 // Heineken — GIF em stop motion (arquivo do site, roda 2 vezes)
  { link: 'https://vimeo.com/1250444657', inicio: 1.6, dur: 3 },   // NewSpace — Fernando entrando no escritório (filme principal)
  { link: 'https://vimeo.com/1243478834', inicio: 4, dur: 3, vertical: true, foco: 50 },   // Herbalife FOOH — Elevador Lacerda com os copos gigantes
  { link: 'https://vimeo.com/1245215006', inicio: 5, dur: 3, vertical: true, foco: 22 },     // Klabin — atriz cacheada falando para a câmera
  { link: 'https://vimeo.com/1098558698', inicio: 4.5, dur: 3, vertical: true, foco: 30 },   // Adidas — Bianca sorrindo, close
  { link: 'https://vimeo.com/1243476834', inicio: 19.5, dur: 3.5 },                  // deserto — produto caindo e levantando poeira
  { link: 'https://vimeo.com/1250416711', inicio: 10.3, dur: 3, zoom: 1.4, zx: 100, zy: 30 }, // Natura — Maju sorrindo para a câmera (zoom tira a legenda e a TV)
  { link: 'https://vimeo.com/1250429878', inicio: 2.6, dur: 2.8, zoom: 1.2, zy: 40 },  // Amazon — Mavih acordando no sofá
  { link: 'https://vimeo.com/1245218880', inicio: 1.5, dur: 3 },                   // NewSpace — Fernando em close, olhando para a câmera
  { link: 'https://vimeo.com/952456882', inicio: 7.2, dur: 2.5, zoom: 1.35, zy: 42 },   // Descomplica — moça de óculos vermelhos
  { link: 'https://vimeo.com/1250442398', inicio: 16.5, dur: 3, zoom: 1.3, zy: 35 },   // Leroy Merlin — casal em close no banheiro
  { link: 'https://vimeo.com/1250415913', inicio: 2.1, dur: 2.5, vertical: true, foco: 38 },   // KaBuM — Lucca de gorro azul, close
  { link: 'https://vimeo.com/1245215005', inicio: 5, dur: 3, vertical: true, foco: 30 },     // Klabin — atriz atrás das caixas de frutas (sem etiquetas)
  { link: 'https://vimeo.com/1250444220', inicio: 11, dur: 3, zoom: 1.35, zy: 35 },   // NewSpace — atendente de fone sorrindo (ouvidoria)
  { link: 'https://vimeo.com/952456882', inicio: 3.8, dur: 3, zoom: 1.35, zy: 42 },  // Descomplica — moça de fone sorrindo (zoom tira legenda e logo)
  { link: 'https://vimeo.com/1250444221', inicio: 9.2, dur: 3, zoom: 1.3, zy: 35 },   // NewSpace — Fernando em close (crédito)
  { link: 'https://vimeo.com/1250429843', inicio: 17, dur: 3, zoom: 1.35, zy: 25 },   // Amazon — Fran com a panela
  { link: 'https://vimeo.com/1250428296', inicio: 4, dur: 3, zoom: 1.15 },   // Natura — Math em preto e branco no sofá
  { link: 'https://vimeo.com/1250429843', inicio: 12.5, dur: 3, zoom: 1.35, zy: 25 }, // Amazon — Fran com a panela, olhando para a câmera
  { link: 'https://vimeo.com/1243478297', inicio: 6, dur: 3.5, vertical: true, foco: 28 },   // MASP — produto descendo de paraquedas
  { link: 'assets/videos/eventos-2.mp4', inicio: 112, dur: 2.8, foco: 35 },   // Eventos — Cubo Conecta, pianista
  { link: 'https://vimeo.com/1250444657', inicio: 12.6, dur: 3, zoom: 1.25, zy: 35 },   // NewSpace — Fernando falando, plano médio
  { link: 'https://vimeo.com/1245218878', inicio: 14.5, dur: 3 },   // NewSpace — Fernando na mesa, luz roxa
  { link: 'https://vimeo.com/1250416711', inicio: 38.5, dur: 3, zoom: 1.3, zy: 30 }, // Natura — Maju na janela, com os roteiros
  { link: 'https://vimeo.com/1243478297', inicio: 0.3, dur: 3, vertical: true, foco: 40 },   // Herbalife FOOH — lata caindo sobre São Paulo
  { link: 'https://vimeo.com/1245215006', inicio: 59, dur: 3, vertical: true, foco: 21 },    // Klabin — atriz com a mão no queixo
  { link: 'https://vimeo.com/1098558698', inicio: 0.95, dur: 2.6, vertical: true, foco: 35 },   // Adidas — mãos com anéis para a câmera
  { link: 'https://vimeo.com/952456882', inicio: 12.8, dur: 2.7, zoom: 1.35, zy: 42 },   // Descomplica — moça de fone falando
  { link: 'https://vimeo.com/1250415910', inicio: 3, dur: 3, vertical: true, foco: 39 },     // KaBuM — Lucca de boné laranja
  { link: 'https://vimeo.com/1250444220', inicio: 2.5, dur: 3, zoom: 1.3, zy: 30 },   // NewSpace — Fernando andando no escritório (ouvidoria)
  { link: 'https://vimeo.com/1250442398', inicio: 38, dur: 3, zoom: 1.3, zy: 35 },   // Leroy Merlin — casal conversando
  { link: 'https://vimeo.com/952456882', inicio: 19.5, dur: 3, zoom: 1.35, zy: 42 }, // Descomplica — moça de fone, rindo
  { link: 'https://vimeo.com/1250429878', inicio: 14, dur: 3, zoom: 1.3, zy: 40 },   // Amazon — Mavih abrindo os presentes
  { link: 'https://vimeo.com/1245218880', inicio: 11, dur: 3, zoom: 1.3, zy: 35 },   // NewSpace — Fernando de camisa bege, close
  { link: 'https://vimeo.com/1250429878', inicio: 17.8, dur: 3, zoom: 1.3, zy: 40 }, // Amazon — Mavih com a máscara de LED
  { link: 'https://vimeo.com/1243476834', inicio: 43, dur: 4 },                  // cacau se formando
  { link: 'https://vimeo.com/1250444657', inicio: 49.5, dur: 3, zoom: 1.3, zy: 30 },   // NewSpace — Fernando na porta, sorrindo
  { link: 'https://vimeo.com/1250428296', inicio: 20, dur: 3, zoom: 1.3, zy: 35 },   // Natura — Math falando no sofá
  { link: 'https://vimeo.com/1250429843', inicio: 47, dur: 3, zoom: 1.35, zy: 25 },   // Amazon — Fran falando, com as caixas
  { link: 'https://vimeo.com/1098558698', inicio: 66.5, dur: 3, vertical: true, foco: 28 },   // Adidas — Bianca em close
  { link: 'https://vimeo.com/1250429878', inicio: 6.6, dur: 3, zoom: 1.3, zy: 40 },  // Amazon — Mavih carregando as caixas
  { link: 'https://vimeo.com/1245214003', inicio: 266, dur: 3, zoom: 1.35, zx: 30, zy: 70 },   // Base — entrevista (zoom tira logo e legenda)
  { link: 'https://vimeo.com/1250416711', inicio: 64.6, dur: 2.3, zoom: 1.25, zy: 40 }, // Natura — turma acenando na mesa
  { link: 'https://vimeo.com/1250444221', inicio: 17, dur: 3, zoom: 1.3, zy: 35 },   // NewSpace — Fernando explicando (crédito)
  { link: 'https://vimeo.com/1250442398', inicio: 134, dur: 3, zoom: 1.3, zy: 35 },   // Leroy Merlin — casal rindo
  { link: 'https://vimeo.com/1250415913', inicio: 9, dur: 3, vertical: true, foco: 35 },     // KaBuM — Lucca explicando
  { link: 'https://vimeo.com/1245218878', inicio: 37, dur: 3, zoom: 1.3, zy: 35 },   // NewSpace — Fernando em chamada de vídeo
  { link: 'https://vimeo.com/1243476834', inicio: 46.5, dur: 4.5 },                  // "Experimente" com as 4 pessoas em cima dos produtos
  { link: 'https://vimeo.com/1250429843', inicio: 26, dur: 3, zoom: 1.35, zy: 25 },   // Amazon — Fran na cozinha
  { link: 'https://vimeo.com/1250429843', inicio: 36.5, dur: 3, zoom: 1.35, zy: 25 },   // Amazon — Fran com o produto na mão
  { link: 'https://vimeo.com/1098558698', inicio: 75.5, dur: 3, vertical: true, foco: 50 },   // Adidas — Bianca de corpo inteiro no gelo
  { link: 'https://vimeo.com/1250416711', inicio: 69, dur: 3, zoom: 1.3, zy: 30 },   // Natura — Maju no restaurante
  { link: 'assets/videos/eventos-1.mp4', inicio: 130, dur: 2.8, foco: 35 },   // Eventos — duas amigas sorrindo
  { link: 'https://vimeo.com/1250444220', inicio: 62, dur: 3, zoom: 1.3, zy: 30 },   // NewSpace — Fernando no corredor (ouvidoria)
  { link: 'https://vimeo.com/1250428296', inicio: 86, dur: 3, zoom: 1.3, zy: 35 },   // Natura — Math mais perto
  { link: 'https://vimeo.com/1250442398', inicio: 150, dur: 3, zoom: 1.3, zy: 35 },   // Leroy Merlin — casal no banheiro
  { link: 'https://vimeo.com/1243478834', inicio: 7.5, dur: 3, vertical: true, foco: 55 },   // Herbalife FOOH — helicóptero com os copos
  { link: 'https://vimeo.com/1245218879', inicio: 2, dur: 3 },                     // NewSpace — Fernando de corpo inteiro no escritório
  { link: 'https://vimeo.com/1250444657', inicio: 46, dur: 3 },   // NewSpace — Fernando surgindo na porta
  { link: 'https://vimeo.com/1098558698', inicio: 37.2, dur: 3.5, vertical: true, foco: 28 },   // Adidas — Bianca em close
  { link: 'https://vimeo.com/1250428296', inicio: 60, dur: 3, zoom: 1.3, zy: 35 },   // Natura — Math no sofá
  { link: 'https://vimeo.com/1250442398', inicio: 145, dur: 3, zoom: 1.3, zy: 35 },   // Leroy Merlin — casal no banheiro
  { link: 'https://vimeo.com/1098558698', inicio: 96, dur: 3, vertical: true, foco: 30 },   // Adidas — Bianca falando, close
  { link: 'https://vimeo.com/1245214003', inicio: 184, dur: 3, zoom: 1.3, zx: 30, zy: 70 },   // Base — embalando pedido
  { link: 'https://vimeo.com/1250428296', inicio: 112.5, dur: 3, zoom: 1.3, zy: 35 },   // Natura — Math no sofá, final
  { link: 'https://vimeo.com/1250429843', inicio: 49, dur: 2.8, zoom: 1.35, zy: 25 },   // Amazon — Fran falando com as caixas
  { link: 'https://vimeo.com/1243478297', inicio: 8.5, dur: 3, vertical: true, foco: 45 },   // Herbalife FOOH — paraquedas pousando
];

// Galeria aberta da seção Foto: fotos soltas, coladinhas, antes dos álbuns (a ordem aqui é a ordem na tela)
const GALERIA_ABERTA = [
  'assets/fotos/galeria/galeria-01.jpg',
  'assets/fotos/galeria/galeria-02.jpg',
  'assets/fotos/galeria/galeria-03.jpg',
  'assets/fotos/galeria/galeria-04.jpg',
  'assets/fotos/galeria/galeria-05.jpg',
  'assets/fotos/galeria/galeria-06.jpg',
  'assets/fotos/galeria/galeria-07.jpg',
  'assets/fotos/galeria/galeria-08.jpg',
  'assets/fotos/galeria/galeria-09.jpg',
  'assets/fotos/galeria/galeria-10.jpg',
  'assets/fotos/galeria/galeria-11.jpg',
  'assets/fotos/galeria/galeria-12.jpg',
  'assets/fotos/galeria/galeria-13.jpg',
  'assets/fotos/galeria/galeria-14.jpg',
  'assets/fotos/galeria/galeria-15.jpg',
  'assets/fotos/galeria/galeria-16.jpg',
  'assets/fotos/galeria/galeria-17.jpg',
  'assets/fotos/galeria/galeria-18.jpg',
  'assets/fotos/galeria/galeria-19.jpg',
  'assets/fotos/galeria/galeria-20.jpg',
  'assets/fotos/galeria/galeria-21.jpg',
];

const SECOES = [
  {
    id: 'video', nome: 'VÍDEO',
    grupos: [
      // grupo sem nome = os projetos aparecem direto, sem aba "campanhas" (a ordem aqui é a ordem na tela)
      { id: 'campanhas', nome: null,
        projetos: ['natura', 'newspace', 'adidas', 'base', 'descomplica', 'descomplica-pronto', 'kabum', 'amazon', 'klabin', 'descomplica-pos', 'leroy-merlin'] },
      { id: 'ia', nome: 'CRIAÇÃO COM IA', destaque: true,
        projetos: ['herbalife-fooh', 'herbalife-america-latina', 'herbalife-globo-nordeste'] },
      { id: 'video-tempo-real', nome: 'CONTEÚDO EM TEMPO REAL',
        projetos: ['eventos-video'] },
    ],
  },
  {
    id: 'foto', nome: 'FOTO',
    grupos: [
      // destaques: aparecem primeiro na seção Foto (grupo sem nome = sem aba)
      { id: 'destaques-foto', nome: null,
        projetos: ['chavosos', 'carbonext', 'jope', 'icaro', 'sete01'] },
      { id: 'moda', nome: 'MODA E RETRATO',
        projetos: ['artplan'] },
      { id: 'publicidade', nome: 'TRABALHOS PUBLICITÁRIOS',
        projetos: ['vale'] },
      { id: 'foto-tempo-real', nome: 'CONTEÚDO EM TEMPO REAL',
        projetos: ['rock-in-rio', 'eventos-corporativos'] },
    ],
  },
];

const PROJETOS = {
  // ---------------- VÍDEO · CRIAÇÃO COM IA ----------------
  'herbalife-fooh': {
    tipo: 'video', cliente: 'HERBALIFE', titulo: 'Invasão dos produtos',
    funcoes: ['Criação com IA', 'FOOH'],
    resumo: 'Produtos gigantes em paisagens conhecidas do Brasil, criados com IA.',
    texto: 'Campanha de relançamento da Herbalife. Criei todos os vídeos com IA, usando o Seedance e o Claude Code.',
    // blocos extras de explicação (aparecem abaixo do texto principal)
    extras: [
      { titulo: 'O QUE É FOOH',
        texto: 'FOOH (Fake Out Of Home) é um anúncio de rua que não existe de verdade. As cenas parecem instalações gigantes em lugares reais, com produtos do tamanho de prédios em paisagens conhecidas, mas são feitas no computador para circular nas redes sociais.' },
    ],
    ferramentas: ['Seedance', 'Claude Code'],
    thumb: 'assets/stills/herbalife-fooh-capa.jpg', // quadro limpo do FOOH São Paulo (paraquedas)
    videoPrincipal: '',
    sociais: ['https://vimeo.com/1243478834', 'https://vimeo.com/1243478297', 'https://vimeo.com/1250080492', 'https://www.youtube.com/watch?v=8sO3QLoXJes'], // o último é Alter do Chão (YouTube)
  },
  'herbalife-america-latina': {
    tipo: 'video', cliente: 'HERBALIFE', titulo: 'Campanha América Latina',
    funcoes: ['Criação com IA', 'Edição'],
    resumo: 'Lançamento dos novos produtos Herbalife na América Latina, feito com IA.',
    texto: 'Campanha criada do zero para lançar os novos produtos da Herbalife pela América Latina. Os produtos foram gerados no Seedance e todo o vídeo foi feito com IA. A edição também é minha.',
    thumb: 'https://i.vimeocdn.com/video/2222007767-e0f6531e46e6f48db80ccaef4b080981974ef35ada46c2689bc2011c5c00e7b2-d_1280x720?region=us',
    videoPrincipal: 'https://vimeo.com/1243476834', sociais: [],
  },
  'herbalife-globo-nordeste': {
    tipo: 'video', cliente: 'HERBALIFE', titulo: 'Lançamento Rede Globo Nordeste',
    funcoes: ['Criação com IA'],
    resumo: 'A invasão dos produtos Herbalife chega ao Nordeste.',
    texto: 'Criação da campanha Herbalife "Invasão dos produtos pelo Brasil" voltada para o público do Nordeste, para a Globo Nordeste e o Globoplay.',
    thumb: 'assets/stills/herbalife-globo-capa.jpg', foco: '50% 30%', // jornalista olhando, sem a tarja do Plantão
    videoPrincipal: 'https://vimeo.com/1243476045', sociais: [],
  },

  // ---------------- VÍDEO · PROJETOS ----------------
  'newspace': {
    tipo: 'video', cliente: 'NEWSPACE', titulo: 'Vídeos institucionais',
    funcoes: ['Storytelling', 'Direção', 'Direção de fotografia', 'Edição', 'Color grading'],
    resumo: 'Soluções complexas de dados traduzidas em narrativa clara.',
    texto: 'A New Space otimiza processos e organiza bancos de dados de forma inteligente, ajudando empresas a operarem com mais eficiência e segurança. O desafio foi criar vídeos institucionais que comunicassem esses serviços de maneira clara, dinâmica e estratégica.',
    // capa limpa (sem lettering), ele olhando para a câmera, tirada do vídeo das reclamações
    thumb: 'assets/stills/newspace-capa.jpg', foco: '50% 35%',
    // em destaque no topo: o filme principal "NEWSPACE" (com capa própria, sem legenda)
    videoPrincipal: 'https://vimeo.com/1250444657',
    poster: 'assets/stills/newspace-capa2.jpg', focoPoster: '50% 35%',
    // outros vídeos horizontais da mesma campanha (aparecem abaixo do principal)
    outrosVideos: [
      { titulo: 'Empresas não estão suportando lidar com os canais de reclamações', link: 'https://vimeo.com/1245218879' },
      { titulo: 'Gestão de ouvidoria', link: 'https://vimeo.com/1250444220' },
      { titulo: 'Os prazos para formalização de crédito na sua empresa estão apertados', link: 'https://vimeo.com/1250444221' },
      { titulo: 'A gestão de pessoas do seu negócio está desatualizada', link: 'https://vimeo.com/1245218878' },
      { titulo: 'Empresas que guardam anos de documento físico', link: 'https://vimeo.com/1245218880' },
      { titulo: 'Sua empresa não sabe mais como lidar com os processos judiciais', link: 'https://youtu.be/0q-Gx77tS6w' },
    ],
    sociais: [],
  },
  'adidas': {
    tipo: 'video', cliente: 'ADIDAS', titulo: 'Esportes de inverno',
    funcoes: ['Roteiro', 'Direção', 'Direção de fotografia', 'Edição', 'Color grading'],
    resumo: 'Lançamento do uniforme oficial com Bianca Herbetta.',
    texto: 'A Adidas convidou a influenciadora Bianca Herbetta para protagonizar o lançamento do uniforme oficial dos atletas de esportes de inverno. Fui responsável por toda a concepção e execução audiovisual: roteiro, pré-produção, direção geral, direção de fotografia, acompanhamento de performance em cena e pós-produção.',
    thumb: 'https://i.vimeocdn.com/video/2033218334-56f05d4d776e9c1ab30a2fec3e54459ad7b6aea2f19b1cfb5fd96774aa5a39cf-d_720x1280?region=us',
    videoPrincipal: '',
    sociais: ['https://vimeo.com/1098558698'], // Adidas nos esportes de inverno (vertical)
  },
  'base': {
    tipo: 'video', cliente: 'BASE', titulo: 'Empório do Celular',
    funcoes: ['Filmmaker', 'Edição'],
    resumo: 'Como a Base ajuda o Empório do Celular no dia a dia.',
    texto: 'A Base é um sistema de ERP para empresas de e-commerce. Visitamos o Empório do Celular, cliente da Base, para mostrar na prática como o sistema ajuda nos processos da loja.',
    thumb: 'https://i.vimeocdn.com/video/2224229181-22c5f8a9c998cb01d547c4c521e98fb446516dee77b94bff65459509dd2fee71-d_1280x720?region=us',
    videoPrincipal: 'https://vimeo.com/1245214003', sociais: [],
  },

  'klabin': {
    tipo: 'video', cliente: 'KLABIN', titulo: 'Klabin For You',
    funcoes: ['Filmmaker', 'Direção', 'Edição'],
    resumo: 'As novas caixas de papelão da Klabin.',
    texto: 'Projeto Klabin For You para apresentar as novas caixas de papelão da Klabin.',
    thumb: 'assets/stills/klabin-capa.jpg',
    foco: '50% 30%',   // atriz olhando para a câmera, sem legenda (roteiro 10)
    videoPrincipal: '',
    sociais: ['https://vimeo.com/1245215008', 'https://vimeo.com/1245215005', 'https://vimeo.com/1245215007', 'https://vimeo.com/1245215006'],
  },

  'descomplica': {
    tipo: 'video', cliente: 'DESCOMPLICA', titulo: 'Faculdade Digital',
    funcoes: ['Direção de fotografia', 'Edição'],
    resumo: 'Lançamento da campanha Descomplica Faculdade Digital.',
    texto: 'Produção de lançamento da campanha Descomplica Faculdade Digital.',
    thumb: 'assets/stills/descomplica-capa.jpg', foco: '50% 40%',
    videoPrincipal: 'https://vimeo.com/952456882',
    // os vídeos do YouTube com os dois rapazes (X3ZobxsYqyo e eGnuFS4lkSY) são de outra campanha: ficaram fora daqui
    sociais: [],
  },

  'descomplica-pos': {
    tipo: 'video', cliente: 'DESCOMPLICA', titulo: 'Campanha Pós-graduação',
    funcoes: ['Direção de fotografia', 'Edição'],
    resumo: 'Depoimentos de profissionais em busca de avanço na carreira.',
    texto: 'Produção de vídeo de lançamento para a nova campanha da plataforma de cursos de pós-graduação da Descomplica.',
    thumb: 'https://i.vimeocdn.com/video/1862160074-467027b3bce6239e2271f10cdd79dab53edd8c23bc9ebb8a8111531207b54e6c-d_720x1280?region=us',
    videoPrincipal: '',
    sociais: ['https://vimeo.com/952459037'], // vertical, 35 s
    semPrevia: true, // o Vimeo bloqueia este vídeo fora do site antigo — liberar nas configurações de incorporação
  },

  'descomplica-pronto': {
    tipo: 'video', cliente: 'DESCOMPLICA', titulo: 'Pronto by Descomplica',
    funcoes: ['[Funções]'],
    resumo: 'Campanha Pronto, com alunos da graduação e da pós-graduação.',
    texto: 'Campanha Pronto, da Descomplica, com depoimentos de alunos da graduação e da pós-graduação.',
    // capa limpa: João Gabriel rindo, recortado sem a tarja e sem o logo
    thumb: 'assets/stills/descomplica-pronto-capa.jpg', foco: '40% 30%',
    videoPrincipal: 'https://vimeo.com/1250436233',
    outrosVideos: [
      { titulo: 'Você pronto pro mercado de trabalho', link: 'https://vimeo.com/1250436234' },
    ],
    sociais: [],
  },

  // ---------------- VÍDEO · BLACK FRIDAY ----------------
  'amazon': {
    tipo: 'video', cliente: 'AMAZON', titulo: 'Black Friday dos Sonhos',
    funcoes: ['Filmmaker', 'Edição'],
    resumo: 'Campanha Black Friday dos Sonhos da Amazon, com Mavih e Fran.',
    texto: 'Campanha Black Friday dos Sonhos da Amazon. Cada personagem, Mavih e Fran, ganhou um filme de 60 segundos, desdobrado em cortes de 30 e 20 segundos.',
    thumb: 'assets/stills/amazon-capa.jpg', foco: '40% 30%', // Mavih olhando, recortado sem legenda
    videoPrincipal: 'https://youtu.be/hRXy2Hk6qJI',              // Mavih — filme de 60 s (hero)
    // demais vídeos horizontais, agrupados por personagem (o campo "grupo" vira um subtítulo)
    outrosVideos: [
      { grupo: 'Fran', titulo: 'Filme 60 s', link: 'https://vimeo.com/1250429843' },
      { grupo: 'Fran', titulo: 'Corte 30 s', link: 'https://vimeo.com/1250429842' },
      { grupo: 'Fran', titulo: 'Corte 20 s', link: 'https://youtu.be/xe91AWuAcCI' },
      { grupo: 'Fran', titulo: 'Bumper A', link: 'https://vimeo.com/1250429883' },
      { grupo: 'Fran', titulo: 'Bumper B', link: 'https://vimeo.com/1250429884' },
      { grupo: 'Mavih', titulo: 'Corte 30 s', link: 'https://vimeo.com/1250429878' },
      { grupo: 'Mavih', titulo: 'Corte 20 s', link: 'https://youtu.be/kS6KVk8kL5Q' },
    ],
    // cortes verticais para redes (segundo plano)
    sociais: ['https://vimeo.com/1250429841', 'https://vimeo.com/1250429844'],
  },
  'kabum': {
    tipo: 'video', cliente: 'KABUM', titulo: 'Black das Blacks',
    funcoes: ['Edição'],
    resumo: 'Black das Blacks da KaBuM!',
    texto: 'Black das Blacks da KaBuM!',
    // capa limpa (sem legenda): Lucca olhando para a câmera, tirada do anúncio 2
    thumb: 'assets/stills/kabum-capa.jpg', foco: '50% 40%',
    videoPrincipal: '',
    // anúncios verticais 9:16, na ordem 1 a 4
    sociais: ['https://vimeo.com/1250415910', 'https://vimeo.com/1250415913', 'https://vimeo.com/1250415912', 'https://vimeo.com/1250415911'],
  },
  'natura': {
    tipo: 'video', cliente: 'NATURA', titulo: 'Campanha Black Friday',
    funcoes: ['[Funções]'],
    resumo: 'Campanha Black Friday Natura.',
    texto: 'Campanha Black Friday Natura.',
    // capa limpa (sem legenda): Maju sorrindo para a câmera, tirada do filme longo
    thumb: 'assets/stills/natura-capa.jpg', foco: '45% 35%',
    // vídeo longo (horizontal): fica em destaque no topo da página
    videoPrincipal: 'https://vimeo.com/1250416711', // Maju — filme longo
    // outros horizontais (filme do Math, bumpers), agrupados por personagem
    outrosVideos: [
      { grupo: 'Math', titulo: 'Filme longo', link: 'https://vimeo.com/1250428296' },
      { grupo: 'Maju', titulo: 'Bumper 6 s', link: 'https://vimeo.com/1250417810' },
    ],
    // cortes para redes de cada personagem: aparecem embaixo, menores (segundo plano)
    personagens: [
      { nome: 'Maju', cortes: ['https://vimeo.com/1250417347'] },
      { nome: 'Math', cortes: ['https://vimeo.com/1250423512'] },
    ],
    sociais: [],
  },
  'leroy-merlin': {
    tipo: 'video', cliente: 'LEROY MERLIN', titulo: 'Campanha Black Friday',
    funcoes: ['Filmagem', 'Edição'],
    resumo: 'Campanha Black Friday Leroy Merlin.',
    texto: 'Campanha Black Friday Leroy Merlin.',
    // capa limpa: o casal em close, recortado sem legenda
    thumb: 'assets/stills/leroy-capa.jpg', foco: '50% 35%',
    videoPrincipal: 'https://vimeo.com/1250442398',
    outrosVideos: [
      { titulo: 'Bumper A', link: 'https://vimeo.com/1250442374' },
      { titulo: 'Bumper B', link: 'https://vimeo.com/1250442376' },
    ],
    sociais: ['https://vimeo.com/1250442375', 'https://vimeo.com/1250442378'],
  },

  // ---------------- VÍDEO · TEMPO REAL ----------------
  'eventos-video': {
    tipo: 'video', cliente: 'EVENTOS', titulo: 'Conteúdo no mesmo dia',
    funcoes: ['Captação', 'Edição ágil', 'Entrega em tempo real'],
    resumo: 'Filmou de manhã, postou no mesmo dia.',
    texto: 'Cobertura completa de eventos com captação profissional e fluxo de edição ágil que permite a entrega de conteúdo no mesmo dia: materiais prontos para publicação ainda durante o evento, no momento de maior visibilidade. Lançamentos, workshops, ativações, convenções e eventos corporativos.',
    thumb: 'assets/stills/eventos-1-capa.jpg', foco: '40% 30%',
    videoPrincipal: '',
    // vídeos do Cubo Itaú (Afro Cubo Day e Cubo Conecta), comprimidos e guardados no próprio site
    sociais: ['assets/videos/eventos-1.mp4', 'assets/videos/eventos-2.mp4'],
    // capa (sem legenda) de cada vídeo acima, na mesma ordem
    capasSociais: ['assets/stills/eventos-1-capa.jpg', 'assets/stills/eventos-2-capa.jpg'],
  },

  // ---------------- FOTO ----------------
  'artplan': {
    tipo: 'foto', cliente: 'ARTPLAN', titulo: 'Retrato para agência',
    funcoes: ['Retrato'], resumo: 'Retrato para a agência Artplan.',
    texto: '[Texto sobre o retrato para a Artplan.]', 
    thumb: 'assets/fotos/artplan-01.png',
    foco: '55% 35%',   // onde fica o rosto (horizontal vertical) para o corte das imagens
    fotos: ['assets/fotos/artplan/artplan-01.jpg', 'assets/fotos/artplan/artplan-02.jpg'],
  },
  'sete01': {
    tipo: 'foto', cliente: 'SETE01', titulo: 'Campanha editorial',
    funcoes: ['Moda', 'Editorial'], resumo: 'Campanha editorial de moda.',
    texto: '[Texto sobre a campanha editorial da Sete01.]', 
    thumb: 'assets/fotos/sete01-01.png',
    fotos: ['assets/fotos/sete01/sete01-01.jpg', 'assets/fotos/sete01/sete01-02.jpg', 'assets/fotos/sete01/sete01-03.jpg', 'assets/fotos/sete01/sete01-04.jpg', 'assets/fotos/sete01/sete01-05.jpg', 'assets/fotos/sete01/sete01-06.jpg', 'assets/fotos/sete01/sete01-07.jpg', 'assets/fotos/sete01/sete01-08.jpg', 'assets/fotos/sete01/sete01-09.jpg', 'assets/fotos/sete01/sete01-10.jpg', 'assets/fotos/sete01/sete01-11.jpg', 'assets/fotos/sete01/sete01-12.jpg'],
  },
  'icaro': {
    tipo: 'foto', cliente: 'ÍCARO', titulo: 'Barra de Guaratiba, RJ',
    funcoes: ['Retrato'], resumo: 'Retrato autoral.',
    texto: '[Texto sobre o ensaio.]', 
    thumb: 'assets/fotos/icaro-01.png',
    foco: '50% 22%',
    fotos: ['assets/fotos/icaro/icaro-01.jpg', 'assets/fotos/icaro/icaro-02.jpg', 'assets/fotos/icaro/icaro-03.jpg', 'assets/fotos/icaro/icaro-04.jpg', 'assets/fotos/icaro/icaro-05.jpg', 'assets/fotos/icaro/icaro-06.jpg', 'assets/fotos/icaro/icaro-07.jpg'],
  },
  'chavosos': {
    tipo: 'foto', cliente: 'KONDZILLA', titulo: 'Chavosos do Capão Redondo',
    funcoes: ['Fotografia'], resumo: 'Chavosos do Capão Redondo. Projeto KondZilla.',
    texto: 'Chavosos do Capão Redondo. Projeto KondZilla.',
    thumb: 'assets/fotos/chavosos/chavosos-01.jpg', foco: '50% 38%', // menino em preto e branco
    fotos: ['assets/fotos/chavosos/chavosos-01.jpg', 'assets/fotos/chavosos/chavosos-02.jpg', 'assets/fotos/chavosos/chavosos-03.jpg', 'assets/fotos/chavosos/chavosos-04.jpg', 'assets/fotos/chavosos/chavosos-05.jpg', 'assets/fotos/chavosos/chavosos-06.jpg'],
  },
  'jope': {
    tipo: 'foto', cliente: 'JOPE', titulo: 'Ensaio de moda',
    funcoes: ['Fotografia'], resumo: 'Ensaio de moda.',
    texto: 'Ensaio de moda.',
    thumb: 'assets/fotos/jope/jope-01.jpg', foco: '50% 30%',
    fotos: ['assets/fotos/jope/jope-01.jpg', 'assets/fotos/jope/jope-02.jpg', 'assets/fotos/jope/jope-03.jpg', 'assets/fotos/jope/jope-04.jpg', 'assets/fotos/jope/jope-05.jpg'],
  },
  'carbonext': {
    tipo: 'foto', cliente: 'CARBONEXT', titulo: 'Projeto Envira, Amazônia',
    funcoes: ['Fotografia documental'], resumo: 'A vida de uma comunidade seringueira no Acre.',
    texto: 'O projeto teve como objetivo documentar a vida dos moradores de uma comunidade seringueira no norte do Acre, investigando seu cotidiano, a relação com o meio ambiente e o propósito de preservação das áreas ribeirinhas onde vivem.', 
    thumb: 'assets/fotos/carbonext-01.jpg',
    fotos: ['assets/fotos/envira/envira-01.jpg', 'assets/fotos/envira/envira-02.jpg', 'assets/fotos/envira/envira-03.jpg', 'assets/fotos/envira/envira-04.jpg', 'assets/fotos/envira/envira-05.jpg', 'assets/fotos/envira/envira-06.jpg', 'assets/fotos/envira/envira-07.jpg', 'assets/fotos/envira/envira-08.jpg', 'assets/fotos/envira/envira-09.jpg', 'assets/fotos/envira/envira-10.jpg', 'assets/fotos/envira/envira-11.jpg', 'assets/fotos/envira/envira-12.jpg', 'assets/fotos/envira/envira-13.jpg', 'assets/fotos/envira/envira-14.jpg', 'assets/fotos/envira/envira-15.jpg', 'assets/fotos/envira/envira-16.jpg'],
  },
  'vale': {
    tipo: 'foto', cliente: 'VALE', titulo: 'Projeto Jovens Talentos',
    funcoes: ['Retrato', 'Campanha'], resumo: 'Campanha nacional em todas as sedes da Vale.',
    texto: 'Campanha fotográfica realizada em todas as sedes da Vale no Brasil, com o objetivo de retratar jovens talentos em uma ação de abrangência nacional.', 
    thumb: 'assets/fotos/vale-01.png',
    foco: '50% 24%',
    fotos: ['assets/fotos/vale-01.png', 'assets/fotos/vale-02.png', 'assets/fotos/vale-03.png'],
  },
  'rock-in-rio': {
    tipo: 'foto', cliente: 'ROCK IN RIO', titulo: 'Cobertura fotográfica',
    funcoes: ['Cobertura fotográfica', 'Entrega em tempo real'], resumo: 'Cobertura fotográfica do Rock in Rio.',
    texto: '[Texto sobre a cobertura do Rock in Rio para a A-Lab.]', 
    thumb: 'assets/fotos/capa-foto.jpg',
    fotos: ['assets/fotos/capa-foto.jpg', 'assets/fotos/rockinrio/rockinrio-01.jpg', 'assets/fotos/rockinrio/rockinrio-02.jpg', 'assets/fotos/rockinrio/rockinrio-03.jpg', 'assets/fotos/rockinrio/rockinrio-04.jpg', 'assets/fotos/rockinrio/rockinrio-05.jpg', 'assets/fotos/rockinrio/rockinrio-06.jpg', 'assets/fotos/rockinrio/rockinrio-07.jpg', 'assets/fotos/rockinrio/rockinrio-08.jpg', 'assets/fotos/rockinrio/rockinrio-09.jpg', 'assets/fotos/rockinrio/rockinrio-10.jpg', 'assets/fotos/rockinrio/rockinrio-11.jpg', 'assets/fotos/rockinrio/rockinrio-12.jpg', 'assets/fotos/rockinrio/rockinrio-13.jpg', 'assets/fotos/rockinrio/rockinrio-14.jpg', 'assets/fotos/rockinrio/rockinrio-15.jpg', 'assets/fotos/rockinrio/rockinrio-16.jpg', 'assets/fotos/rockinrio/rockinrio-17.jpg', 'assets/fotos/rockinrio/rockinrio-18.jpg', 'assets/fotos/rockinrio/rockinrio-19.jpg', 'assets/fotos/rockinrio/rockinrio-20.jpg', 'assets/fotos/rockinrio/rockinrio-21.jpg', 'assets/fotos/rockinrio/rockinrio-22.jpg', 'assets/fotos/rockinrio/rockinrio-23.jpg', 'assets/fotos/rockinrio/rockinrio-24.jpg', 'assets/fotos/rockinrio/rockinrio-25.jpg', 'assets/fotos/rockinrio/rockinrio-26.jpg', 'assets/fotos/rockinrio/rockinrio-27.jpg', 'assets/fotos/rockinrio/rockinrio-28.jpg', 'assets/fotos/rockinrio/rockinrio-29.jpg', 'assets/fotos/rockinrio/rockinrio-30.jpg', 'assets/fotos/rockinrio/rockinrio-31.jpg', 'assets/fotos/rockinrio/rockinrio-32.jpg', 'assets/fotos/rockinrio/rockinrio-33.jpg', 'assets/fotos/rockinrio/rockinrio-34.jpg', 'assets/fotos/rockinrio/rockinrio-35.jpg', 'assets/fotos/rockinrio/rockinrio-36.jpg', 'assets/fotos/rockinrio/rockinrio-37.jpg', 'assets/fotos/rockinrio/rockinrio-38.jpg', 'assets/fotos/rockinrio/rockinrio-39.jpg', 'assets/fotos/rockinrio/rockinrio-40.jpg', 'assets/fotos/rockinrio/rockinrio-41.jpg', 'assets/fotos/rockinrio/rockinrio-42.jpg', 'assets/fotos/rockinrio/rockinrio-43.jpg'],
  },
  'eventos-corporativos': {
    tipo: 'foto', cliente: 'EVENTOS', titulo: 'Eventos e conteúdo em tempo real',
    funcoes: ['Foto', 'Vídeo', 'Edição ágil', 'Entrega em tempo real'], resumo: 'Foto e vídeo de eventos com entrega em tempo real.',
    texto: 'Cobertura fotográfica de eventos corporativos com entrega em tempo real, garantindo imagens de alta qualidade, edição ágil e atenção aos detalhes. Registro dos melhores momentos com olhar criativo, valorizando a essência e o propósito de cada ocasião.', 
    thumb: 'assets/fotos/eventos-01.jpg',
    fotos: ['assets/fotos/eventos-01.jpg', 'assets/fotos/eventos-02.jpg', 'assets/fotos/eventos-03.jpg', 'assets/fotos/eventos-04.jpg', 'assets/fotos/eventos-05.jpg', 'assets/fotos/eventos-06.jpg', 'assets/fotos/eventos-07.jpg', 'assets/fotos/eventos-08.jpg', 'assets/fotos/eventos-09.jpg', 'assets/fotos/eventos-10.jpg', 'assets/fotos/eventos-11.jpg', 'assets/fotos/eventos-12.jpg', 'assets/fotos/eventos-13.jpg', 'assets/fotos/eventos-14.jpg'],
  },
};
