# Site Senhor Fix — Guia rápido de edição

## Como abrir o site
Dê **dois cliques em `index.html`**. Ele abre no navegador; não precisa instalar nada.
Depois de salvar uma alteração, aperte **F5** no navegador para ver o resultado.

Para editar, use um editor de código gratuito como o **VS Code** (recomendado) ou o Bloco de Notas.

## Testar como fica no celular
Dê dois cliques em **`simulador-celular.html`**. Ele mostra o site dentro de um celular,
com botões para trocar o modelo (Android pequeno, iPhone SE, iPhone 14, Pro Max),
girar a tela e recarregar.
Esse arquivo é só para testes: **não envie ele quando publicar o site**.

## O que tem em cada pasta

```
senhor-fix/
├── index.html        → TEXTOS e estrutura da página
├── css/estilo.css    → VISUAL: cores, fonte, tamanhos
├── js/config.js      → WhatsApp, mensagens prontas, desconto Pix
├── js/precos.js      → MODELOS, SERVIÇOS e PREÇOS
├── js/main.js        → lógica (normalmente não precisa mexer)
├── simulador-celular.html → ferramenta de teste (não faz parte do site)
└── img/              → imagens (logo, ícones) — vazia por enquanto
```

## "Quero mudar…" → "Abra…"

| Quero mudar…                                   | Arquivo            | Onde                                        |
|-----------------------------------------------|--------------------|---------------------------------------------|
| Um preço (de cada peça)                       | `js/precos.js`     | lista `MODELOS`                             |
| Adicionar ou remover um modelo de iPhone      | `js/precos.js`     | lista `MODELOS` (copie uma linha)           |
| Nome ou descrição de um serviço (card)        | `js/precos.js`     | lista `SERVICOS`                            |
| Opções de peça de um serviço (Original etc.)  | `js/precos.js`     | lista `SERVICOS` → `pecas`                  |
| Primeira linha da mensagem do orçamento       | `js/config.js`     | `mensagens.orcamento`                       |
| Títulos das 4 etapas do orçamento             | `js/main.js`       | `TITULOS_ETAPAS` no topo                    |
| Explicação do botão "ⓘ" (histórico de peças)  | `js/precos.js`     | `AJUDA_HISTORICO` (usada em bateria, tampa traseira e câmera traseira) |
| Aviso azul da tela ("sem mensagem…")          | `js/precos.js`     | serviço `tela` → `nota`                     |
| Quais modelos usam tampa traseira             | `js/precos.js`     | lista `MODELOS_COM_TAMPA`                   |
| Perguntas e respostas das Dúvidas frequentes  | `index.html`       | procure `id="duvidas"` (um `<details>` por pergunta) |
| Mensagem do "Pergunte pelo WhatsApp"          | `js/config.js`     | `mensagens.duvida`                          |
| Número do WhatsApp                            | `js/config.js`     | `whatsapp`                                  |
| Mensagem que já vai escrita no WhatsApp       | `js/config.js`     | `mensagens`                                 |
| Porcentagem do desconto no Pix                | `js/config.js`     | `descontoPix`                               |
| Ligar/desligar arredondamento do Pix (x9,90)  | `js/config.js`     | `arredondarPix` (`true` ou `false`)         |
| Modelo que já aparece selecionado             | `js/config.js`     | `modeloInicial`                             |
| Texto do aviso "Tem Samsung, Motorola…"       | `index.html`       | procure `aviso-marcas`                      |
| Texto/botão "Reparo urgente"                  | `index.html`       | procure `urgente`                           |
| Mensagem do WhatsApp do botão urgente         | `js/config.js`     | `mensagens.urgente` (abertura e menu)       |
| Mensagem do "⚡ Urgente" da tabela de preços   | `js/config.js`     | `mensagens.urgenteModelo`                   |
| Cor do botão verde do WhatsApp                | `css/estilo.css`   | `--cor-whatsapp`                            |
| Textos do rodapé                              | `index.html`       | procure `<footer>`                          |
| Cor do botão urgente (laranja)                | `css/estilo.css`   | `--cor-urgente`                             |
| Texto acima da lista de modelos (celular)     | `index.html`       | procure `seletor-celular`                   |
| Mensagem do WhatsApp do aviso de outras marcas| `js/config.js`     | `mensagens.outrasMarcas`                    |
| Cores do site                                 | `css/estilo.css`   | seção **CONFIGURAÇÕES** no topo             |
| Fonte do site                                 | `css/estilo.css`   | `--fonte-principal`                         |
| Títulos, frases, textos de botões             | `index.html`       | procure o texto com **Ctrl+F**              |
| Endereço                                      | `index.html`       | aparece em 4 lugares — use Ctrl+F "Imperial"|
| Texto pequeno de aviso dos preços             | `index.html`       | procure `disclaimer`                        |
| Texto do Google (descrição)                   | `index.html`       | `<meta name="description"` no topo          |
| Título/texto da prévia ao compartilhar o link | `index.html`       | linhas `og:title` e `og:description`        |
| Itens do menu (computador e celular)          | `index.html`       | procure `<nav id="menu">`                   |
| Logo do cabeçalho / do rodapé                 | `img/logo.png` / `img/logo-branca.png` | troque o arquivo mantendo o mesmo nome |
| Tamanho da logo                               | `css/estilo.css`   | `.logo img` → `height`                      |
| Ícone da aba do navegador                     | `img/favicon-64.png` | ícone da logo (celular + engrenagem)      |
| Imagem da prévia ao compartilhar o link       | `img/compartilhar.png` | ativar no `index.html` quando tiver domínio (`og:image`) |
| Etiqueta "Recomendável" de uma peça           | `js/precos.js`     | `selo: 'Recomendável'` na peça              |
| Fonte do site                                 | `index.html` + `css/estilo.css` | link do Google Fonts no topo + `--fonte-principal` |

## Regras de ouro para não quebrar nada

1. **Preços usam ponto, não vírgula:** `899.90` ✅ — `899,90` ❌
2. **Não apague aspas, vírgulas nem chaves `{ }`** nos arquivos `.js`. Mude só o que está dentro das aspas ou os números.
3. **No `index.html`, mude só o texto entre as tags.** Ex.: em `<h2>Cuidado com cada detalhe.</h2>`, troque apenas a frase.
4. **Antes de mexer, faça uma cópia da pasta.** Se algo der errado, é só voltar.
5. Se a tabela de preços sumir do site, quase sempre é uma vírgula ou aspa faltando em `precos.js`.

## Exemplos

### Como funciona o orçamento
O cliente passa por 4 etapas: **① Modelo → ② Defeitos → ③ Peças → ④ Resumo**.
No resumo ele pode alterar o modelo, trocar a peça, remover ou adicionar defeitos,
e envia **uma única mensagem** no WhatsApp com tudo.

**Peças cadastradas hoje** (chaves usadas nos preços):

| Serviço (chave)     | Peças (chave)                                                      |
|---------------------|--------------------------------------------------------------------|
| `tela`              | `premium`                                                          |
| `bateria`           | `premium` (msg. "peça desconhecida"), `semMensagem` (exige formatação), `genuina` (msg. de peça genuína — não é original Apple) |
| `conector`          | `original` (original retirado), `paralelo`                         |
| `traseira` (vidro, até iPhone 13 e 14 Pro Max) | `oem` (OEM hidrofóbico)                 |
| `tampa` (tampa traseira, iPhone 14 em diante, exceto 14 Pro Max) | `oem` (Premium OEM hidrofóbica), `original` (original retirada) |
| `cameraTraseira`    | `original`, `paralelo`                                             |
| `cameraFrontal`     | `original`, `paralelo`                                             |
| `placa`, `outros`   | sem peças (preço direto)                                           |

**Mudar o preço da tela do iPhone 13 para R$ 849,90** (`js/precos.js`):
```js
    tela:           { premium: 849.90 },
```

**Colocar preço do conector original retirado no iPhone 13:**
```js
    conector:       { original: 499.00, paralelo: 399.00 },
```
Peça sem preço aparece como "Sob consulta".

**Pix com valor especial** (em vez dos 12% automáticos), como o iPhone 17:
```js
    tela:           { premium: { parcelado: 1499.00, pix: 1300.00 } },
```

**Preço de um serviço sem escolha de peça** (placa, outros reparos):
```js
    placa:          350.00,
```

**Criar uma nova opção de peça**, em `SERVICOS`, dentro de `pecas` do serviço:
```js
{ chave: 'nova', nome: 'Nome que o cliente vê', descricao: 'Explicação curta.' },
```
Para exigir que o cliente marque "Estou ciente…", acrescente `confirmacao: 'texto do aviso'`.

**Trocar o azul principal do site** (`css/estilo.css`):
```css
--cor-principal: #1256c8;
```
Troque pelo código da nova cor (ex.: `#0a7d4f`). Para escolher cores, pesquise "color picker" no Google.
