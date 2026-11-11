/* =============================================================
   SENHOR FIX — CONFIGURAÇÕES GERAIS
   -------------------------------------------------------------
   Aqui ficam os dados da loja usados pelos botões do site.
   Mude só o que está entre aspas '...' ou os números.
   ============================================================= */
 
const CONFIG = {
 
  // NÚMERO DO WHATSAPP
  // Formato: 55 (Brasil) + DDD + número, tudo junto, sem espaços,
  // traços ou parênteses. Ex.: (99) 98183-1886 → '5599981831886'
  whatsapp: '5599984771332',
 
  // DESCONTO NO PIX / À VISTA
  // 0.12 = 12% de desconto sobre o preço exibido no card.
  descontoPix: 0.12,
 
  // ARREDONDAR O VALOR DO PIX
  // true  = arredonda PARA BAIXO até o valor terminado em 9,90
  //         (ex.: 299,90 − 12% = 263,91 → R$ 259,90)
  // false = mostra o valor exato do desconto (R$ 263,91)
  arredondarPix: true,
 
  // MODELO QUE APARECE SELECIONADO QUANDO A PÁGINA ABRE
  // Precisa ser escrito igual a um item da lista em js/precos.js
  modeloInicial: '13',
 
  // MENSAGENS QUE JÁ VÃO ESCRITAS NO WHATSAPP
  mensagens: {
    // Botão "Pedir orçamento pelo WhatsApp" (faixa final)
    // e o botão verde flutuante
    geral: 'Olá! Vim pelo site da Senhor Fix e gostaria de solicitar um orçamento.',
 
    // Botão "Enviar orçamento pelo WhatsApp" (etapa ④ Resumo).
    // Esta é a primeira linha da mensagem. Abaixo dela o site
    // escreve sozinho o modelo, cada reparo com a peça e os valores.
    orcamento: 'Olá! Vim pelo site da Senhor Fix e quero confirmar este orçamento:',
 
    // Botão "Outro problema? Consulte →"
    outroProblema: 'Olá! Tenho um iPhone {modelo} e preciso de ajuda com outro problema.',
 
    // Botão laranja "⚡ Reparo urgente" (na abertura do site)
    // Também usada no item "⚡ Reparo urgente" do menu do celular
    urgente: 'Olá! Vim pelo site da Senhor Fix e preciso de um reparo com urgência.',
 
    // Botão "⚡ Urgente" da tabela de preços (já inclui o modelo escolhido)
    urgenteModelo: 'Olá! Vim pelo site da Senhor Fix e preciso de um reparo com urgência no meu iPhone {modelo}.',
 
    // Botão "Pergunte pelo WhatsApp" (seção Dúvidas frequentes)
    duvida: 'Olá! Vim pelo site da Senhor Fix e tenho uma dúvida:',
 
    // Botão do aviso "Tem Samsung, Motorola, Xiaomi ou outra marca?"
    outrasMarcas: 'Olá! Meu celular não é iPhone e gostaria de um orçamento.'
  }
};
