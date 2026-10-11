// Ferragem Ponto Certo · comportamento do site (JavaScript puro, sem dependências)
// Para alterar dados do negócio, edite somente o objeto CONFIG abaixo.

const CONFIG = {
  // WhatsApp da loja, só dígitos, com 55 + DDD (confirmado pelo proprietário).
  whatsapp: '5553997103055',

  // Horário confirmado pelo proprietário (10/10/2026). Dias: 0 = domingo ... 6 = sábado.
  // Cada dia tem uma lista de períodos [abre, fecha] em horas decimais (11.5 = 11h30).
  horario: {
    1: [[8, 11.5], [13, 18]], 2: [[8, 11.5], [13, 18]], 3: [[8, 11.5], [13, 18]],
    4: [[8, 11.5], [13, 18]], 5: [[8, 11.5], [13, 18]],
    6: [[8, 12]],
  },
  // As categorias (texto e fotos) ficam no index.html, para aparecerem já no primeiro carregamento.
};

function linkWhatsApp(texto) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;
}

function mensagemCategoria(nome) {
  return `Olá! Vim pelo site. Vocês têm ${nome.toLowerCase()}? Procuro: `;
}

function ligarCategorias() {
  document.querySelectorAll('.card[data-categoria]').forEach((card) => {
    card.href = linkWhatsApp(mensagemCategoria(card.dataset.categoria));
  });
}

function ligarBotoesWhatsApp() {
  document.querySelectorAll('[data-zap]').forEach((el) => {
    el.href = linkWhatsApp(el.dataset.zap);
  });
}

function ligarFormulario() {
  const form = document.getElementById('form-procura');
  if (!form) return;
  const item = form.querySelector('#item');
  const nome = form.querySelector('#nome');
  const erro = form.querySelector('#erro-item');

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const pedido = item.value.trim();
    if (!pedido) {
      erro.hidden = false;
      item.setAttribute('aria-invalid', 'true');
      item.focus();
      return;
    }
    erro.hidden = true;
    item.removeAttribute('aria-invalid');
    const quem = nome.value.trim();
    const texto = `Olá! ${quem ? `Meu nome é ${quem}. ` : ''}Vim pelo site e queria saber se vocês têm: ${pedido}`;
    window.open(linkWhatsApp(texto), '_blank', 'noopener');
  });
}

// Horário de Brasília, independente do fuso do aparelho
function agoraEmCangucu(data = new Date()) {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false,
  }).formatToParts(data);
  const get = (t) => partes.find((p) => p.type === t).value;
  const dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { dia: dias[get('weekday')], hora: (Number(get('hour')) % 24) + Number(get('minute')) / 60 };
}

function estaAberto({ dia, hora }) {
  return (CONFIG.horario[dia] || []).some(([abre, fecha]) => hora >= abre && hora < fecha);
}

function formatarHora(h) {
  const min = Math.round((h % 1) * 60);
  return `${Math.floor(h)}h${min ? String(min).padStart(2, '0') : ''}`;
}

// "Aberto agora", "Fechado agora · abre às 13h" (mesmo dia) ou "Fechado agora"
function textoStatus(agora) {
  if (estaAberto(agora)) return 'Aberto agora';
  const proximo = (CONFIG.horario[agora.dia] || []).find(([abre]) => abre > agora.hora);
  return proximo ? `Fechado agora · abre às ${formatarHora(proximo[0])}` : 'Fechado agora';
}

function mostrarStatus() {
  const el = document.getElementById('status-aberto');
  if (!el) return;
  const agora = agoraEmCangucu();
  el.textContent = textoStatus(agora);
  el.classList.toggle('aberto', estaAberto(agora));
}

if (typeof document !== 'undefined') {
  ligarCategorias();
  ligarBotoesWhatsApp();
  ligarFormulario();
  mostrarStatus();
}

if (typeof module !== 'undefined') {
  module.exports = { CONFIG, linkWhatsApp, mensagemCategoria, agoraEmCangucu, estaAberto, textoStatus };
}
