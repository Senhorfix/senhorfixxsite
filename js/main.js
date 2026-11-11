/* =============================================================
   SENHOR FIX — LÓGICA DO SITE
   -------------------------------------------------------------
   Você normalmente NÃO precisa mexer aqui.
   • Serviços, peças, modelos e preços → js/precos.js
   • WhatsApp, mensagens e desconto     → js/config.js

   O que este arquivo faz:
   1. Monta o orçamento em 4 etapas:
      ① Modelo → ② Defeitos → ③ Peças → ④ Resumo
   2. Monta a mensagem do WhatsApp com o orçamento completo.
   3. Coloca os links do WhatsApp nos outros botões do site.
   4. Abre e fecha o menu ☰ do celular.
   ============================================================= */


/* =============================================================
   ESTADO DO ORÇAMENTO (o que o cliente escolheu até agora)
   ============================================================= */
const orcamento = {
  etapa: 1,                        // etapa que está aparecendo (1 a 4)
  modelo: CONFIG.modeloInicial,    // ex.: '13'
  defeitos: [],                    // chaves dos serviços marcados, ex.: ['tela', 'bateria']
  pecas: {},                       // peça escolhida por serviço, ex.: { bateria: 'genuina' }
  confirmacoes: {}                 // "estou ciente" marcados, ex.: { 'bateria:semMensagem': true }
};

const TITULOS_ETAPAS = {
  1: { nome: 'Modelo',   titulo: 'Qual é o modelo do seu iPhone?' },
  2: { nome: 'Defeitos', titulo: 'Quais são os defeitos?' },
  3: { nome: 'Peças',    titulo: 'Escolha as peças' },
  4: { nome: 'Resumo',   titulo: 'Revise seu orçamento' }
};


/* =============================================================
   FUNÇÕES AUXILIARES
   ============================================================= */

// Atalho para pegar um elemento pelo id
const $ = id => document.getElementById(id);

// Formata um número como dinheiro: 899 → "R$ 899,00"
function formatarReal(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Calcula o valor no Pix: aplica o desconto e, se ativado no
// config.js, arredonda PARA BAIXO até o valor terminado em 9,90.
// Ex.: 263,91 → 259,90 | 791,12 → 789,90
function calcularPix(preco) {
  const comDesconto = preco * (1 - CONFIG.descontoPix);
  if (!CONFIG.arredondarPix) return comDesconto;

  // Conta em centavos para evitar erros de arredondamento do computador
  const centavos = Math.round(comDesconto * 100);
  const arredondado = Math.floor((centavos + 10) / 1000) * 1000 - 10;

  // Segurança: se o valor for muito baixo (menos de R$ 9,90), não arredonda
  return arredondado > 0 ? arredondado / 100 : comDesconto;
}

// Monta o link do WhatsApp com a mensagem já escrita
function linkWhatsApp(mensagem) {
  return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(mensagem);
}

// Troca {modelo} dentro das mensagens do config.js
function preencherMensagem(texto, dados) {
  return texto.replace('{modelo}', dados.modelo || '');
}

// Procura os dados de um modelo na lista de precos.js
function buscarModelo(nome) {
  return MODELOS.find(item => item.modelo === nome) || { modelo: nome };
}

// Procura um serviço pela chave (ex.: 'tela')
function buscarServico(chave) {
  return SERVICOS.find(servico => servico.chave === chave);
}

// Serviços que aparecem para um modelo (ex.: a partir do 14 → "Tampa traseira")
function servicosDoModelo(modelo) {
  return SERVICOS.filter(servico =>
    (!servico.apenasModelos || servico.apenasModelos.includes(modelo)) &&
    (!servico.excetoModelos || !servico.excetoModelos.includes(modelo)));
}

// Ao trocar de modelo, ajusta os defeitos já marcados:
// troca pelo serviço equivalente (vidro ↔ tampa) ou remove se não existir
function ajustarDefeitosAoModelo() {
  const disponiveis = servicosDoModelo(orcamento.modelo);
  orcamento.defeitos = orcamento.defeitos.map(chave => {
    if (disponiveis.some(s => s.chave === chave)) return chave;
    const grupo = buscarServico(chave).grupo;
    const equivalente = grupo && disponiveis.find(s => s.grupo === grupo);
    return equivalente ? equivalente.chave : null;
  }).filter(Boolean);
}

// Transforma o que está na tabela em { preco, pix }:
//   899.00                              → { preco: 899, pix: 12% automático }
//   { parcelado: 1499.00, pix: 1300.00 } → Pix com valor especial
//   vazio                               → null (sob consulta)
function lerValor(valor) {
  if (typeof valor === 'number' && valor > 0) return { preco: valor, pix: calcularPix(valor) };
  if (valor && typeof valor === 'object' && valor.parcelado > 0) {
    return { preco: valor.parcelado, pix: valor.pix > 0 ? valor.pix : calcularPix(valor.parcelado) };
  }
  return null;
}

// Valores { preco, pix } de um serviço + peça para o modelo escolhido (ou null = sob consulta)
function valorDe(servico, chavePeca) {
  const dados = buscarModelo(orcamento.modelo)[servico.chave];
  // Serviço sem peças (placa, outros): o preço é direto
  if (servico.pecas.length === 0) return lerValor(dados);
  // Serviço com peças: o preço fica dentro de { premium: ..., genuina: ... }
  return dados && typeof dados === 'object' ? lerValor(dados[chavePeca]) : null;
}

// Menor valor entre as peças de um serviço (para "a partir de")
function menorValor(servico) {
  if (servico.pecas.length === 0) return valorDe(servico);
  const valores = servico.pecas.map(peca => valorDe(servico, peca.chave)).filter(Boolean);
  return valores.length ? valores.reduce((menor, v) => (v.preco < menor.preco ? v : menor)) : null;
}

// Peça escolhida para um serviço. Se ainda não escolheu,
// sugere a primeira peça que tem preço (ou a primeira da lista).
function pecaEscolhida(servico) {
  if (servico.pecas.length === 0) return null;
  const escolhida = servico.pecas.find(peca => peca.chave === orcamento.pecas[servico.chave]);
  if (escolhida) return escolhida;
  return servico.pecas.find(peca => valorDe(servico, peca.chave)) || servico.pecas[0];
}

// A peça escolhida pede confirmação (ex.: formatação) e o cliente ainda não marcou?
function faltaConfirmar(servico) {
  const peca = pecaEscolhida(servico);
  return Boolean(peca && peca.confirmacao && !orcamento.confirmacoes[servico.chave + ':' + peca.chave]);
}

function confirmacoesPendentes() {
  return orcamento.defeitos.map(buscarServico).filter(faltaConfirmar);
}

// Lista final do orçamento: cada defeito com peça e valores
function itensDoOrcamento() {
  return orcamento.defeitos.map(chave => {
    const servico = buscarServico(chave);
    const peca = pecaEscolhida(servico);
    const valor = valorDe(servico, peca && peca.chave);
    return {
      servico, peca,
      preco: valor ? valor.preco : null,
      pix: valor ? valor.pix : null,
      confirmacao: peca && peca.confirmacao ? peca.confirmacao : null
    };
  });
}


/* =============================================================
   INDICADOR DE ETAPAS  ① Modelo ─ ② Defeitos ─ ③ Peças ─ ④ Resumo
   ============================================================= */

// Pode ir para a etapa? (2 em diante só com modelo; 3 e 4 só com defeito marcado)
function podeIrPara(etapa) {
  if (etapa <= 2) return true;
  if (orcamento.defeitos.length === 0) return false;
  // Resumo só depois de confirmar avisos obrigatórios (ex.: formatação)
  if (etapa === 4) return confirmacoesPendentes().length === 0;
  return true;
}

function desenharIndicador() {
  $('etapas').innerHTML = [1, 2, 3, 4].map(numero => {
    const atual = numero === orcamento.etapa;
    const feita = numero < orcamento.etapa;
    const classe = atual ? 'atual' : feita ? 'feita' : '';
    const bloqueada = !atual && !podeIrPara(numero);
    return `<li class="${classe}">
        <button type="button" data-ir="${numero}" ${atual ? 'aria-current="step"' : ''} ${bloqueada ? 'disabled' : ''}>
          <span class="etapa-num">${feita ? '✓' : numero}</span>
          <span class="etapa-nome">${TITULOS_ETAPAS[numero].nome}</span>
        </button>
      </li>`;
  }).join('');
}


/* =============================================================
   ETAPA ① — MODELO
   ============================================================= */

// Botões dos modelos (computador)
function desenharBotoesModelos() {
  $('chips').innerHTML = MODELOS.map(item => {
    const selecionado = item.modelo === orcamento.modelo;
    return `<button type="button" class="chip ${selecionado ? 'active' : ''}" data-model="${item.modelo}" aria-pressed="${selecionado}">iPhone ${item.modelo}</button>`;
  }).join('');
}

// Lista de seleção (celular)
function desenharListaModelos() {
  $('listaModelos').innerHTML = MODELOS.map(item =>
    `<option value="${item.modelo}" ${item.modelo === orcamento.modelo ? 'selected' : ''}>iPhone ${item.modelo}</option>`
  ).join('');
}

// Só troca o destaque, sem recriar os botões
// (assim quem usa teclado não perde a posição).
function marcarModeloAtivo() {
  document.querySelectorAll('#chips [data-model]').forEach(botao => {
    const selecionado = botao.dataset.model === orcamento.modelo;
    botao.classList.toggle('active', selecionado);
    botao.setAttribute('aria-pressed', selecionado);
  });
  $('listaModelos').value = orcamento.modelo;
}

function escolherModelo(modelo) {
  orcamento.modelo = modelo;
  ajustarDefeitosAoModelo();
  marcarModeloAtivo();
  atualizarCabecalho();
}


/* =============================================================
   ETAPA ② — DEFEITOS (cards marcáveis)
   ============================================================= */
function desenharDefeitos() {
  $('services').innerHTML = servicosDoModelo(orcamento.modelo).map(servico => {
    const marcado = orcamento.defeitos.includes(servico.chave);
    const valor = menorValor(servico);
    // "A partir de" só quando há mais de uma peça com preço
    const varias = servico.pecas.filter(peca => valorDe(servico, peca.chave)).length > 1;

    const blocoPreco = valor
      ? `<div class="small a-partir">${varias ? 'A partir de' : '&nbsp;'}</div>
         <div class="price price--a-partir">${formatarReal(valor.preco)}</div>
         <div class="small">em até 12x sem juros • Pix: ${varias ? 'a partir de ' : ''}${formatarReal(valor.pix)}</div>`
      : `<div class="price price--consulta">Sob consulta</div>
         <div class="small">Avaliação e disponibilidade</div>`;

    return `<label class="service service--opcao ${marcado ? 'marcado' : ''}">
        <input type="checkbox" class="service-check" value="${servico.chave}" ${marcado ? 'checked' : ''}>
        <h4>${servico.nome}</h4>
        <div class="muted">${servico.descricao}</div>
        ${blocoPreco}
        <span class="service-marcar" aria-hidden="true">${marcado ? '✓ Selecionado' : '+ Selecionar'}</span>
      </label>`;
  }).join('');
}

function marcarDesmarcarDefeito(chave, marcar) {
  if (marcar && !orcamento.defeitos.includes(chave)) {
    orcamento.defeitos.push(chave);
    // Mantém a mesma ordem dos cards
    orcamento.defeitos.sort((a, b) =>
      SERVICOS.findIndex(s => s.chave === a) - SERVICOS.findIndex(s => s.chave === b));
  }
  if (!marcar) {
    orcamento.defeitos = orcamento.defeitos.filter(item => item !== chave);
  }
}


/* =============================================================
   ETAPA ③ — PEÇAS
   ============================================================= */
function desenharPecas() {
  $('listaPecas').innerHTML = orcamento.defeitos.map(chave => {
    const servico = buscarServico(chave);

    // Serviço sem escolha de peça
    if (servico.pecas.length === 0) {
      const valor = valorDe(servico);
      return `<div class="peca-grupo peca-grupo--sem">
          <div class="peca-grupo-titulo">${servico.nome}</div>
          <p class="muted">Sem escolha de peça. ${valor
            ? `Valor: <b>${formatarReal(valor.preco)}</b>.`
            : 'O valor é informado após a avaliação técnica.'}</p>
        </div>`;
    }

    const escolhida = pecaEscolhida(servico);
    const opcoes = servico.pecas.map(peca => {
      const valor = valorDe(servico, peca.chave);
      const marcada = escolhida && escolhida.chave === peca.chave;
      return `<label class="peca-opcao ${marcada ? 'marcada' : ''}">
          <input type="radio" name="peca-${servico.chave}" value="${peca.chave}" data-servico="${servico.chave}" ${marcada ? 'checked' : ''}>
          <span class="peca-texto">
            <span class="peca-nome">${peca.nome}${peca.selo ? ` <span class="peca-selo">${peca.selo}</span>` : ''}</span>
            <span class="peca-desc">${peca.descricao}</span>
          </span>
          <span class="peca-valor">
            ${valor
              ? `<b>${formatarReal(valor.preco)}</b><span class="small">Pix: ${formatarReal(valor.pix)}</span>`
              : '<b class="peca-consulta">Sob consulta</b>'}
          </span>
        </label>`;
    }).join('');

    // Botão "ⓘ" com explicação (se o serviço tiver "ajuda" em precos.js)
    const ajuda = servico.ajuda
      ? `<button type="button" class="botao-ajuda" aria-expanded="false" aria-controls="ajuda-${servico.chave}">
           <span aria-hidden="true">ⓘ</span> ${servico.ajuda.botao}
         </button>
         <div class="ajuda-texto" id="ajuda-${servico.chave}" hidden>
           ${servico.ajuda.textos.map(texto => `<p>${texto}</p>`).join('')}
         </div>`
      : '';

    // Aviso curto embaixo do título (se o serviço tiver "nota" em precos.js)
    const nota = servico.nota ? `<p class="peca-nota"><span aria-hidden="true">ℹ️</span> ${servico.nota}</p>` : '';

    return `<fieldset class="peca-grupo">
        <legend class="peca-grupo-titulo">${servico.nome}</legend>
        ${nota}
        ${ajuda}
        ${opcoes}
        ${desenharConfirmacao(servico, escolhida)}
      </fieldset>`;
  }).join('');
}

// Caixa "Estou ciente…" que aparece quando a peça escolhida exige confirmação
function desenharConfirmacao(servico, peca) {
  if (!peca || !peca.confirmacao) return '';
  const id = servico.chave + ':' + peca.chave;
  const marcado = Boolean(orcamento.confirmacoes[id]);
  return `<label class="confirmacao ${marcado ? 'ok' : ''}">
      <input type="checkbox" class="confirmacao-check" data-confirmacao="${id}" ${marcado ? 'checked' : ''}>
      <span><b>⚠️ Atenção:</b> ${peca.confirmacao}</span>
    </label>`;
}


/* =============================================================
   ETAPA ④ — RESUMO
   ============================================================= */
function desenharResumo() {
  const itens = itensDoOrcamento();
  const comPreco = itens.filter(item => item.preco !== null);
  const semPreco = itens.length - comPreco.length;
  const totalParcelado = comPreco.reduce((soma, item) => soma + item.preco, 0);
  const totalPix = comPreco.reduce((soma, item) => soma + item.pix, 0);   // soma dos Pix de cada item

  const linhas = itens.map(item => `
      <div class="resumo-linha">
        <div class="resumo-item">
          <b>${item.servico.nome}</b>
          <span class="resumo-sub">${item.peca ? 'Peça: ' + item.peca.nome : 'Avaliação técnica'}</span>
          ${item.confirmacao ? '<span class="resumo-alerta">⚠️ Exige formatação completa do aparelho — você confirmou ciência</span>' : ''}
        </div>
        <div class="resumo-valor">
          ${item.preco !== null
            ? `<b>${formatarReal(item.preco)}</b><span class="small">Pix: ${formatarReal(item.pix)}</span>`
            : '<b class="peca-consulta">Sob consulta</b>'}
        </div>
        <div class="resumo-acoes">
          ${item.servico.pecas.length > 1 ? `<button type="button" class="link-acao" data-ir="3">Trocar peça</button>` : ''}
          <button type="button" class="link-acao link-remover" data-remover="${item.servico.chave}" aria-label="Remover ${item.servico.nome}">Remover</button>
        </div>
      </div>`).join('');

  const totais = comPreco.length
    ? `<div class="resumo-total">
         <div><span>Total em até 12x sem juros</span><b>${formatarReal(totalParcelado)}</b></div>
         <div class="resumo-total-pix"><span>Total à vista no Pix</span><b>${formatarReal(totalPix)}</b></div>
         ${semPreco ? `<p class="small">+ ${semPreco} ${semPreco > 1 ? 'itens' : 'item'} sob consulta: valor confirmado pelo WhatsApp.</p>` : ''}
       </div>`
    : `<div class="resumo-total"><p class="small">Os itens escolhidos são sob consulta: a equipe confirma os valores pelo WhatsApp.</p></div>`;

  $('resumo').innerHTML = `
    <div class="resumo-linha resumo-modelo">
      <div class="resumo-item"><span class="resumo-sub">Modelo</span><b>iPhone ${orcamento.modelo}</b></div>
      <div class="resumo-acoes"><button type="button" class="link-acao" data-ir="1">Alterar modelo</button></div>
    </div>
    ${linhas}
    <button type="button" class="link-acao link-adicionar" data-ir="2">+ Adicionar ou alterar defeitos</button>
    ${totais}
    <a class="btn btn-enviar" target="_blank" rel="noopener" href="${linkWhatsApp(mensagemDoOrcamento(itens, totalParcelado, totalPix, semPreco))}">
      <span class="so-computador">Enviar orçamento pelo WhatsApp</span><span class="so-celular">Enviar pelo WhatsApp</span>&nbsp;↗
    </a>
    <p class="small resumo-aviso">Os valores são confirmados pela equipe no WhatsApp antes do serviço.</p>`;
}

// Texto que vai para o WhatsApp
function mensagemDoOrcamento(itens, totalParcelado, totalPix, semPreco) {
  const linhas = [CONFIG.mensagens.orcamento, '', `Modelo: iPhone ${orcamento.modelo}`];
  itens.forEach(item => {
    const peca = item.peca ? ` — ${item.peca.nome}` : '';
    const valor = item.preco !== null
      ? `${formatarReal(item.preco)} | Pix ${formatarReal(item.pix)}`
      : 'sob consulta';
    linhas.push(`• ${item.servico.nome}${peca}: ${valor}`);
    if (item.confirmacao) linhas.push('   ⚠️ Estou ciente de que será necessário formatar o aparelho (todos os dados apagados).');
  });
  if (totalParcelado > 0) {
    linhas.push('', `Total: ${formatarReal(totalParcelado)} em até 12x | Pix ${formatarReal(totalPix)}`);
    if (semPreco) linhas.push(`+ ${semPreco} ${semPreco > 1 ? 'itens' : 'item'} sob consulta`);
  }
  return linhas.join('\n');
}


/* =============================================================
   TROCA DE ETAPA E BOTÕES "VOLTAR" / "PRÓXIMO"
   ============================================================= */

// Atualiza "Etapa 2 de 4 • iPhone 13", os botões do painel e o rodapé do painel
function atualizarCabecalho() {
  const etapa = orcamento.etapa;
  $('etapaRotulo').textContent = `Etapa ${etapa} de 4 • iPhone ${orcamento.modelo}`;
  $('etapaTitulo').textContent = TITULOS_ETAPAS[etapa].titulo;

  // Botões do topo do painel
  const linkOutro = linkWhatsApp(preencherMensagem(CONFIG.mensagens.outroProblema, { modelo: orcamento.modelo }));
  $('otherWa').href = linkOutro;          // computador (topo do painel)
  $('otherWaCelular').href = linkOutro;   // celular (embaixo do painel)
  $('panelUrgenteWa').href = linkWhatsApp(preencherMensagem(CONFIG.mensagens.urgenteModelo, { modelo: orcamento.modelo }));

  // Botões de baixo
  const textos = { 1: 'Escolher defeitos →', 2: 'Escolher peças →', 3: 'Ver resumo →' };
  $('btnVoltar').hidden = etapa === 1;
  $('btnAvancar').hidden = etapa === 4;
  $('btnAvancar').textContent = textos[etapa] || '';
  const pendentes = confirmacoesPendentes().length;
  $('btnAvancar').disabled = (etapa === 2 && orcamento.defeitos.length === 0) || (etapa === 3 && pendentes > 0);

  const qtd = orcamento.defeitos.length;
  $('etapaInfo').textContent =
    etapa === 2 ? (qtd ? `${qtd} ${qtd > 1 ? 'defeitos selecionados' : 'defeito selecionado'}` : 'Marque pelo menos um defeito')
    : etapa === 3 && pendentes ? 'Confirme o aviso de formatação para continuar'
    : '';

  desenharIndicador();
}

function irParaEtapa(etapa, { focar = true } = {}) {
  if (!podeIrPara(etapa)) etapa = 2;
  orcamento.etapa = etapa;

  [1, 2, 3, 4].forEach(numero => { $('etapa' + numero).hidden = numero !== etapa; });
  if (etapa === 2) desenharDefeitos();
  if (etapa === 3) desenharPecas();
  if (etapa === 4) desenharResumo();
  atualizarCabecalho();

  if (focar) {
    // Leva a tela até o topo do painel, se ele estiver fora de vista
    const painel = document.querySelector('#precos .panel');
    const alturaCabecalho = document.querySelector('header').offsetHeight;
    if (painel.getBoundingClientRect().top < alturaCabecalho) {
      window.scrollTo({ top: painel.getBoundingClientRect().top + window.scrollY - alturaCabecalho - 12 });
    }
    $('etapaTitulo').focus({ preventScroll: true });
  }
}


/* =============================================================
   CLIQUES E ESCOLHAS DO CLIENTE
   ============================================================= */

// ① Computador: clique em um botão de modelo
$('chips').addEventListener('click', evento => {
  const botao = evento.target.closest('[data-model]');
  if (botao) escolherModelo(botao.dataset.model);
});

// ① Celular: escolha na lista de seleção
$('listaModelos').addEventListener('change', evento => escolherModelo(evento.target.value));

// ② Marcar / desmarcar defeito
$('services').addEventListener('change', evento => {
  if (!evento.target.matches('.service-check')) return;
  marcarDesmarcarDefeito(evento.target.value, evento.target.checked);
  const card = evento.target.closest('.service');
  card.classList.toggle('marcado', evento.target.checked);
  card.querySelector('.service-marcar').textContent = evento.target.checked ? '✓ Selecionado' : '+ Selecionar';
  atualizarCabecalho();
});

// ③ Escolher peça
$('listaPecas').addEventListener('change', evento => {
  const alvo = evento.target;

  // Caixa "Estou ciente…"
  if (alvo.matches('.confirmacao-check')) {
    orcamento.confirmacoes[alvo.dataset.confirmacao] = alvo.checked;
    alvo.closest('.confirmacao').classList.toggle('ok', alvo.checked);
    atualizarCabecalho();
    return;
  }

  if (!alvo.matches('input[type="radio"]')) return;
  const servico = buscarServico(alvo.dataset.servico);
  orcamento.pecas[servico.chave] = alvo.value;
  const grupo = alvo.closest('.peca-grupo');
  grupo.querySelectorAll('.peca-opcao').forEach(opcao => {
    opcao.classList.toggle('marcada', opcao.contains(alvo));
  });

  // Mostra ou esconde a caixa de confirmação conforme a peça escolhida
  const antiga = grupo.querySelector('.confirmacao');
  if (antiga) antiga.remove();
  grupo.insertAdjacentHTML('beforeend', desenharConfirmacao(servico, pecaEscolhida(servico)));
  atualizarCabecalho();
});

// Indicador de etapas e botões "Alterar" / "Trocar peça" / "Remover" do resumo
document.querySelector('#precos').addEventListener('click', evento => {
  const ir = evento.target.closest('[data-ir]');
  if (ir && !ir.disabled) irParaEtapa(Number(ir.dataset.ir));

  const remover = evento.target.closest('[data-remover]');
  if (remover) {
    marcarDesmarcarDefeito(remover.dataset.remover, false);
    irParaEtapa(orcamento.defeitos.length ? 4 : 2);
  }
});

// ③ Botão "ⓘ" abre e fecha a explicação
$('listaPecas').addEventListener('click', evento => {
  const botao = evento.target.closest('.botao-ajuda');
  if (!botao) return;
  const abrir = botao.getAttribute('aria-expanded') !== 'true';
  botao.setAttribute('aria-expanded', abrir);
  $(botao.getAttribute('aria-controls')).hidden = !abrir;
});

$('btnVoltar').addEventListener('click', () => irParaEtapa(orcamento.etapa - 1));
$('btnAvancar').addEventListener('click', () => irParaEtapa(orcamento.etapa + 1));


/* =============================================================
   INÍCIO: roda quando a página abre
   ============================================================= */
desenharBotoesModelos();
desenharListaModelos();
irParaEtapa(1, { focar: false });

// Botões gerais de WhatsApp (faixa final e botão flutuante)
['endWa', 'floatWa'].forEach(id => {
  $(id).href = linkWhatsApp(CONFIG.mensagens.geral);
});

// Botão laranja de reparo urgente (abertura) e item do menu do celular
['urgenteWa', 'menuUrgenteWa'].forEach(id => {
  $(id).href = linkWhatsApp(CONFIG.mensagens.urgente);
});

// Botão do aviso para celulares que não são iPhone
$('outrasMarcasWa').href = linkWhatsApp(CONFIG.mensagens.outrasMarcas);

// Botão "Pergunte pelo WhatsApp" (Dúvidas frequentes)
$('duvidaWa').href = linkWhatsApp(CONFIG.mensagens.duvida);


/* =============================================================
   MENU DO CELULAR (botão ☰)
   ============================================================= */
const menu = $('menu');
const botaoMenu = $('botaoMenu');

function abrirFecharMenu(abrir) {
  menu.classList.toggle('aberto', abrir);
  botaoMenu.setAttribute('aria-expanded', abrir);
  botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
}

botaoMenu.addEventListener('click', () => abrirFecharMenu(!menu.classList.contains('aberto')));

// Fecha o menu ao tocar em um link dele
menu.addEventListener('click', evento => {
  if (evento.target.closest('a')) abrirFecharMenu(false);
});

// Fecha o menu ao apertar Esc
document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape') abrirFecharMenu(false);
});
