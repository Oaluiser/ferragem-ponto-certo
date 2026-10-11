# Site da Ferragem Ponto Certo

Projeto de Extensão Unicesumar (atividade 1949) · Aluisio Pereira da Fonseca · ADS

Site estático de página única: HTML, CSS e JavaScript puro, sem dependências e sem custo de hospedagem.

## Arquivos

| Arquivo | Para quê |
|---|---|
| `index.html` | Conteúdo da página (textos, horário, endereço, dados para o Google) |
| `style.css` | Visual (cores no topo do arquivo) |
| `app.js` | Dados do negócio em `CONFIG` (WhatsApp, horário) e comportamento |
| `img/` | Logo (círculos da placa) e fotos reais da loja em WebP (800×600). Nunca use imagens geradas por IA |
| `tests/app.test.js` | Testes automatizados: `node --test tests/app.test.js` |

## Depois da conversa de requisitos: o que trocar

Procure por `CONFIRMAR` em `index.html` e `app.js`:

1. ~~WhatsApp~~: já confirmado, `5553997103055`.
2. ~~Horário~~: confirmado (seg-sex 8h-11h30 e 13h-18h; sáb 8h-12h). Se mudar: `app.js` → `CONFIG.horario`, tabela no `index.html` e `openingHours` no `ld+json`.
3. ~~Categorias e fotos~~: feitas a partir das fotos da loja (6 cards no `index.html`, seção `#categorias`).
4. ~~Pagamento e entrega~~: confirmados e no `index.html`.
5. ~~Fachada~~: `img/fachada.webp`, já no topo.
6. Rode os testes e confira no celular.

## Publicar grátis no GitHub Pages (GitHub Desktop)

Este site é um repositório **público** separado do projeto da faculdade (que fica privado em `Documents/GitHub/unicesumar`).

1. GitHub Desktop → **File → Add local repository** → escolha `Documents/GitHub/ferragem-ponto-certo`.
2. Ele avisa que a pasta não é um repositório: clique em **create a repository** → **Create repository**.
3. Clique em **Publish repository**, **desmarque "Keep this code private"** e confirme.
4. No github.com, abra o repositório → **Settings → Pages** → Source: *Deploy from a branch* → Branch `main` / `(root)` → **Save**.
5. Em 1 a 2 minutos o site fica em `https://SEU-USUARIO.github.io/ferragem-ponto-certo/`.

Para atualizar depois: altere os arquivos, faça **Commit** e **Push origin** no GitHub Desktop.

Opcional (recomendado ao dono): cadastrar a loja no **Perfil da Empresa no Google** (google.com/business) e colocar o link do site lá. É o que faz a loja aparecer no Google Maps.

## Testes realizados (10/10/2026)

- 9/9 testes automatizados aprovados (inclui intervalo de almoço e aviso "abre às 13h").
- Formulário: bloqueia envio vazio; envio válido abre o WhatsApp com o texto certo; sem erros no console.
- Celular 390 px sem rolagem lateral.
- Lighthouse celular: 99 · 100 · 100 · 100 (LCP 1,9 s, CLS 0). Computador: 99 · 100 · 100 · 100.
