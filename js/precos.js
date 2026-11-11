/* =============================================================
   SENHOR FIX — SERVIÇOS, PEÇAS, MODELOS E PREÇOS
   Tabela oficial de manutenção (atualizada em 11/11/2026)
   -------------------------------------------------------------
   ⚠️ REGRAS IMPORTANTES PARA NÃO QUEBRAR O SITE
   • Preço usa PONTO, não vírgula:   899.90   (certo)
                                     899,90   (errado)
   • Não use "R$" nem ponto de milhar: 1499.90 (certo)
                                       1.499,90 (errado)
   • Cada linha termina com vírgula.
   • Abriu chave { ? Feche com } . Abriu colchete [ ? Feche com ] .
   • Peça ou serviço sem preço → aparece "Sob consulta".
   ============================================================= */


/* -------------------------------------------------------------
   1. SERVIÇOS E PEÇAS
   -------------------------------------------------------------
   Cada serviço é um card na etapa ② (Defeitos).
   • chave:     nome curto, usado na tabela de preços abaixo
   • nome:      título do card
   • descricao: texto cinza abaixo do título
   • pecas:     opções de peça que o cliente escolhe na etapa ③
       - chave:     nome curto, usado na tabela de preços abaixo
       - nome:      o que o cliente vê
       - descricao: explicação curta da peça
       - confirmacao (opcional): texto que o cliente precisa
         marcar como "ciente" antes de continuar
       - selo (opcional): etiqueta ao lado do nome, ex.: selo: 'Recomendável'
   • ajuda (opcional): botão "ⓘ" com uma explicação, ao lado do
     título do serviço na etapa ③
   • nota (opcional): aviso curto que aparece embaixo do título do
     serviço na etapa ③ (veja o exemplo da tela)
   • apenasModelos / excetoModelos (opcional): o card só aparece
     (ou não aparece) nos modelos da lista
   • grupo (opcional): serviços equivalentes. Se o cliente trocar de
     modelo, o site troca um pelo outro (ex.: vidro ↔ tampa traseira)
     Serviço sem escolha de peça (ex.: reparo de placa): pecas: []
   ------------------------------------------------------------- */

// Explicação do botão "ⓘ O que é o histórico de peças?"
// (usada na bateria, na tampa traseira e na câmera traseira)
const AJUDA_HISTORICO = {
  botao: 'O que é o histórico de peças?',
  textos: [
    'Desde o iOS 15.2, o iPhone mostra em Ajustes > Geral > Sobre uma seção chamada "Histórico de peças e serviço". Ela aparece quando algumas peças são substituídas (as peças verificadas variam conforme o modelo).',
    'Nessa seção, o iPhone exibe uma mensagem sobre a peça instalada:',
    '• <b>Peça desconhecida:</b> o sistema não reconhece a peça como original da Apple.',
    '• <b>Mensagem de peça genuína:</b> o sistema exibe a peça como genuína.',
    '• <b>Peça usada:</b> a peça é original da Apple, mas já foi instalada em outro iPhone (ex.: peça original retirada).',
    '• <b>Sem mensagem:</b> nenhum aviso sobre a peça aparece nessa seção.',
    'Nossas peças têm qualidade fiel ao original. Na descrição de cada opção, informamos quando aparece alguma mensagem.'
  ]
};

// Modelos que usam TAMPA TRASEIRA no lugar de VIDRO TRASEIRO
// (a partir do iPhone 14, exceto o 14 Pro Max)
const MODELOS_COM_TAMPA = [
  '14', '14 Plus', '14 Pro',
  '15', '15 Plus', '15 Pro', '15 Pro Max',
  '16', '16e', '16 Plus', '16 Pro', '16 Pro Max',
  '17', '17 Pro', '17 Pro Max',
];

const SERVICOS = [
  {
    chave: 'tela', nome: 'Troca de tela', descricao: 'Tela quebrada, manchas ou falhas no toque.',
    nota: 'O serviço é feito sem mensagem de peça substituída no histórico do iPhone quando a tela atual ainda é a original do aparelho.',
    pecas: [
      { chave: 'premium', nome: 'Tela Premium',
        descricao: 'Imagem e acabamento fiéis ao original.' },
    ]
  },
  {
    chave: 'bateria', nome: 'Troca de bateria', descricao: 'Bateria descarregando rápido ou desligamentos.',
    ajuda: AJUDA_HISTORICO,
    pecas: [
      { chave: 'premium', nome: 'Bateria Premium',
        descricao: 'Qualidade e desempenho fiéis ao original. No histórico de peças do iPhone aparece a mensagem "Peça desconhecida".' },
      { chave: 'semMensagem', nome: 'Bateria sem mensagem',
        descricao: 'Mesma qualidade, sem nenhuma mensagem no histórico de peças. Exige a formatação completa do aparelho. Obs.: só é possível fazer este serviço se a bateria atual do aparelho ainda for a original.',
        confirmacao: 'Estou ciente de que, para instalar esta bateria, é necessário formatar o aparelho por completo, apagando todos os dados (fotos, conversas e aplicativos). Vou fazer backup antes.' },
      { chave: 'genuina', nome: 'Bateria com mensagem de genuína', selo: 'Recomendável',
        descricao: 'Mesma qualidade premium. Não é uma bateria original da Apple, mas no histórico de peças do iPhone aparece a mensagem de peça genuína.' },
    ]
  },
  {
    chave: 'conector', nome: 'Conector de carga', descricao: 'Problema para carregar ou falha na conexão (flex de carga).',
    pecas: [
      { chave: 'original', nome: 'Original retirado', descricao: 'Peça original retirada de outro aparelho.' },
      { chave: 'paralelo', nome: 'Paralelo',          descricao: 'Peça paralela de boa qualidade.' },
    ]
  },
  {
    // Até o iPhone 13 e no 14 Pro Max
    chave: 'traseira', nome: 'Vidro traseiro', descricao: 'Traseira trincada ou quebrada.',
    grupo: 'traseira', excetoModelos: MODELOS_COM_TAMPA,
    // Sem botão "ⓘ": a troca do vidro traseiro não aparece no histórico de peças
    pecas: [
      { chave: 'oem', nome: 'Vidro OEM hidrofóbico', descricao: 'Acabamento fiel ao original.' },
    ]
  },
  {
    // A partir do iPhone 14 (exceto 14 Pro Max)
    chave: 'tampa', nome: 'Tampa traseira', descricao: 'Tampa traseira trincada ou quebrada.',
    grupo: 'traseira', apenasModelos: MODELOS_COM_TAMPA,
    ajuda: AJUDA_HISTORICO,
    pecas: [
      { chave: 'oem',      nome: 'Tampa traseira Premium OEM hidrofóbica', descricao: 'Acabamento fiel ao original.' },
      { chave: 'original', nome: 'Tampa traseira original retirada',
        descricao: 'Peça original retirada de outro aparelho. No histórico de peças do iPhone aparece a mensagem "Peça usada".' },
    ]
  },
  {
    chave: 'cameraTraseira', nome: 'Câmera traseira', descricao: 'Fotos borradas, manchas ou câmera sem funcionar.',
    ajuda: AJUDA_HISTORICO,
    pecas: [
      { chave: 'original', nome: 'Original retirada',
        descricao: 'Peça original retirada de outro aparelho. No histórico de peças do iPhone aparece a mensagem "Peça usada".' },
      { chave: 'paralelo', nome: 'Paralela',          descricao: 'Peça paralela de boa qualidade.' },
    ]
  },
  {
    chave: 'cameraFrontal', nome: 'Câmera frontal', descricao: 'Selfie com falhas ou câmera frontal sem funcionar.',
    pecas: [
      { chave: 'original', nome: 'Original retirada', descricao: 'Peça original retirada de outro aparelho.' },
      { chave: 'paralelo', nome: 'Paralela',          descricao: 'Peça paralela de boa qualidade.' },
    ]
  },
  {
    chave: 'placa', nome: 'Reparo de placa', descricao: 'Falhas que exigem análise técnica.',
    pecas: []   // sem escolha de peça: valor definido após avaliação
  },
  {
    chave: 'outros', nome: 'Outros reparos', descricao: 'Som, microfone, botões, software e mais.',
    pecas: []   // sem escolha de peça: valor definido após avaliação
  },
];


/* -------------------------------------------------------------
   2. MODELOS E PREÇOS (valor em até 12x sem juros)
   -------------------------------------------------------------
   Para cada serviço, o preço de cada peça (use as chaves acima):
       bateria: { premium: 449.00, semMensagem: 449.00, genuina: 579.00 },

   Serviço que não aparece na linha do modelo → "Sob consulta".

   PIX COM VALOR ESPECIAL (em vez dos 12% automáticos):
       tela: { premium: { parcelado: 1499.00, pix: 1300.00 } },

   Serviço sem peças (placa, outros) → preço direto:  placa: 350.00,

   ⚠️ Conector e câmeras: só o "paralelo" tem preço. Quando tiver o
      valor do "original", acrescente: { original: 499.00, paralelo: 399.00 }

   ⚠️ Tampa traseira (iPhone 14 em diante, exceto 14 Pro Max): use
      "tampa" no lugar de "traseira". Só a "oem" tem preço; quando
      tiver o valor da original retirada: tampa: { oem: 399.00, original: 599.00 }

   A ordem aqui é a ordem dos modelos no site.
   ------------------------------------------------------------- */
const MODELOS = [
  { modelo: '7',
    bateria:        { premium: 199.00, semMensagem: 199.00 },
    conector:       { paralelo: 299.00 },
    cameraTraseira: { paralelo: 299.00 },
    cameraFrontal:  { paralelo: 299.00 } },
  { modelo: '7 Plus',
    tela:           { premium: 249.90 },
    bateria:        { premium: 199.00, semMensagem: 199.00 },
    conector:       { paralelo: 299.00 },
    cameraTraseira: { paralelo: 299.00 },
    cameraFrontal:  { paralelo: 299.00 } },
  { modelo: '8',
    tela:           { premium: 249.90 },
    bateria:        { premium: 199.00, semMensagem: 199.00 },
    conector:       { paralelo: 299.00 },
    traseira:       { oem: 299.00 },
    cameraTraseira: { paralelo: 299.00 },
    cameraFrontal:  { paralelo: 299.00 } },
  { modelo: '8 Plus',
    tela:           { premium: 299.90 },
    bateria:        { premium: 199.00, semMensagem: 199.00 },
    conector:       { paralelo: 299.00 },
    traseira:       { oem: 299.00 },
    cameraTraseira: { paralelo: 299.00 },
    cameraFrontal:  { paralelo: 299.00 } },
  { modelo: 'X',
    tela:           { premium: 349.90 } },
  { modelo: 'XR',
    tela:           { premium: 349.90 },
    bateria:        { premium: 349.00, semMensagem: 349.00 },
    conector:       { paralelo: 349.00 },
    traseira:       { oem: 299.00 },
    cameraTraseira: { paralelo: 349.00 },
    cameraFrontal:  { paralelo: 349.00 } },
  { modelo: 'XS',
    tela:           { premium: 349.90 } },
  { modelo: 'XS Max',
    tela:           { premium: 349.90 } },
  { modelo: '11',
    tela:           { premium: 399.90 },
    bateria:        { premium: 349.00, semMensagem: 349.00 },
    conector:       { paralelo: 349.00 },
    traseira:       { oem: 349.00 },
    cameraTraseira: { paralelo: 399.00 },
    cameraFrontal:  { paralelo: 399.00 } },
  { modelo: '11 Pro',
    tela:           { premium: 599.90 },
    bateria:        { premium: 399.00, semMensagem: 399.00 },
    conector:       { paralelo: 399.00 },
    traseira:       { oem: 349.00 },
    cameraTraseira: { paralelo: 499.00 },
    cameraFrontal:  { paralelo: 399.00 } },
  { modelo: '11 Pro Max',
    tela:           { premium: 599.90 },
    bateria:        { premium: 399.00, semMensagem: 399.00 },
    conector:       { paralelo: 399.00 },
    traseira:       { oem: 349.00 },
    cameraTraseira: { paralelo: 499.00 },
    cameraFrontal:  { paralelo: 399.00 } },
  { modelo: '12',
    tela:           { premium: 699.00 },
    bateria:        { premium: 449.00, semMensagem: 449.00, genuina: 599.00 },
    conector:       { paralelo: 399.00 },
    traseira:       { oem: 399.00 },
    cameraTraseira: { paralelo: 599.00 },
    cameraFrontal:  { paralelo: 399.00 } },
  { modelo: '12 Mini' },   // sem preços cadastrados: tudo sob consulta
  { modelo: '12 Pro',
    tela:           { premium: 699.00 },
    bateria:        { premium: 499.00, semMensagem: 499.00 },
    conector:       { paralelo: 399.00 },
    traseira:       { oem: 399.00 },
    cameraTraseira: { paralelo: 599.00 },
    cameraFrontal:  { paralelo: 499.00 } },
  { modelo: '12 Pro Max',
    tela:           { premium: 749.90 },
    bateria:        { premium: 449.00, semMensagem: 449.00, genuina: 599.00 },
    conector:       { paralelo: 399.00 },
    traseira:       { oem: 399.00 },
    cameraTraseira: { paralelo: 599.00 },
    cameraFrontal:  { paralelo: 499.00 } },
  { modelo: '13',
    tela:           { premium: 799.90 },
    bateria:        { premium: 449.00, semMensagem: 449.00, genuina: 579.00 },
    conector:       { paralelo: 399.00 },
    traseira:       { oem: 399.00 },
    cameraTraseira: { paralelo: 499.00 },
    cameraFrontal:  { paralelo: 499.00 } },
  { modelo: '13 Mini' },   // sem preços cadastrados: tudo sob consulta
  { modelo: '13 Pro',
    tela:           { premium: 749.90 },
    bateria:        { premium: 449.00, semMensagem: 449.00, genuina: 579.00 },
    conector:       { paralelo: 499.00 },
    traseira:       { oem: 399.00 },
    cameraTraseira: { paralelo: 699.00 },
    cameraFrontal:  { paralelo: 499.00 } },
  { modelo: '13 Pro Max',
    tela:           { premium: 749.90 },
    bateria:        { premium: 499.00, semMensagem: 499.00, genuina: 649.00 },
    conector:       { paralelo: 499.00 },
    traseira:       { oem: 399.00 },
    cameraTraseira: { paralelo: 699.00 },
    cameraFrontal:  { paralelo: 499.00 } },
  { modelo: '14',
    tela:           { premium: 799.90 },
    bateria:        { premium: 449.00, semMensagem: 449.00, genuina: 579.00 },
    conector:       { paralelo: 499.00 },
    tampa:          { oem: 399.00 },
    cameraTraseira: { paralelo: 499.00 },
    cameraFrontal:  { paralelo: 499.00 } },
  { modelo: '14 Plus' },   // sem preços cadastrados: tudo sob consulta
  { modelo: '14 Pro',
    tela:           { premium: 1199.99 },
    bateria:        { premium: 549.00, semMensagem: 549.00, genuina: 699.00 },
    conector:       { paralelo: 499.00 },
    tampa:          { oem: 399.00 },
    cameraTraseira: { paralelo: 799.00 },
    cameraFrontal:  { paralelo: 599.00 } },
  { modelo: '14 Pro Max',
    tela:           { premium: 1199.99 },
    bateria:        { premium: 549.00, semMensagem: 549.00, genuina: 699.00 },
    conector:       { paralelo: 499.00 },
    traseira:       { oem: 399.00 },
    cameraTraseira: { paralelo: 799.00 },
    cameraFrontal:  { paralelo: 599.00 } },
  { modelo: '15',
    tela:           { premium: 999.90 },
    bateria:        { premium: 499.00, semMensagem: 499.00, genuina: 599.00 },
    conector:       { paralelo: 499.00 },
    tampa:          { oem: 499.00 },
    cameraTraseira: { paralelo: 999.00 },
    cameraFrontal:  { paralelo: 599.00 } },
  { modelo: '15 Plus' },   // sem preços cadastrados: tudo sob consulta
  { modelo: '15 Pro',
    tela:           { premium: 1199.90 },
    bateria:        { premium: 549.00, semMensagem: 549.00, genuina: 699.00 },
    conector:       { paralelo: 599.00 },
    tampa:          { oem: 499.00 },
    cameraTraseira: { paralelo: 1399.00 },
    cameraFrontal:  { paralelo: 799.00 } },
  { modelo: '15 Pro Max',
    tela:           { premium: 1199.99 },
    bateria:        { premium: 549.00, semMensagem: 549.00, genuina: 699.00 },
    conector:       { paralelo: 599.00 },
    tampa:          { oem: 599.00 },
    cameraTraseira: { paralelo: 1399.00 },
    cameraFrontal:  { paralelo: 799.00 } },
  { modelo: '16',
    tela:           { premium: 999.90 },
    bateria:        { premium: 599.00, semMensagem: 599.00 },
    conector:       { paralelo: 699.00 },
    tampa:          { oem: 599.00 },
    cameraTraseira: { paralelo: 1499.00 },
    cameraFrontal:  { paralelo: 999.00 } },
  { modelo: '16e' },   // sem preços cadastrados: tudo sob consulta
  { modelo: '16 Plus' },   // sem preços cadastrados: tudo sob consulta
  { modelo: '16 Pro',
    tela:           { premium: 1299.90 },
    bateria:        { premium: 699.00, semMensagem: 699.00 },
    conector:       { paralelo: 699.00 },
    tampa:          { oem: 799.00 },
    cameraTraseira: { paralelo: 1499.00 },
    cameraFrontal:  { paralelo: 1299.00 } },
  { modelo: '16 Pro Max',
    tela:           { premium: 1499.99 },
    bateria:        { premium: 699.00, semMensagem: 699.00 },
    conector:       { paralelo: 699.00 },
    tampa:          { oem: 999.00 },
    cameraTraseira: { paralelo: 1499.00 },
    cameraFrontal:  { paralelo: 1399.00 } },
  { modelo: '17',
    tela:           { premium: { parcelado: 1499.00, pix: 1300.00 } } },
  { modelo: '17 Pro' },   // sem preços cadastrados: tudo sob consulta
  { modelo: '17 Pro Max',
   tela:           { premium: 1899.90 } },   // sem preços cadastrados: tudo sob consulta
];
