// Testes de unidade das regras do site: node --test tests/
const test = require('node:test');
const assert = require('node:assert');
const { CONFIG, linkWhatsApp, mensagemCategoria, agoraEmCangucu, estaAberto, textoStatus } = require('../app.js');

test('link do WhatsApp usa o número configurado e codifica a mensagem', () => {
  const url = linkWhatsApp('Olá! Têm cano 3/4 & joelho?');
  assert.ok(url.startsWith(`https://wa.me/${CONFIG.whatsapp}?text=`));
  assert.ok(url.includes('Ol%C3%A1!%20T%C3%AAm%20cano%203%2F4%20%26%20joelho%3F'));
});

test('número do WhatsApp tem só dígitos e começa com 55', () => {
  assert.match(CONFIG.whatsapp, /^55\d{10,11}$/);
});

test('horário: aberto em dia útil às 10h e 15h, fechado no almoço, às 19h e no domingo', () => {
  assert.strictEqual(estaAberto({ dia: 3, hora: 10 }), true);
  assert.strictEqual(estaAberto({ dia: 3, hora: 12 }), false);
  assert.strictEqual(estaAberto({ dia: 3, hora: 15 }), true);
  assert.strictEqual(estaAberto({ dia: 3, hora: 19 }), false);
  assert.strictEqual(estaAberto({ dia: 0, hora: 10 }), false);
});

test('horário: almoço começa às 11h30 (limite exclusivo) e volta às 13h', () => {
  assert.strictEqual(estaAberto({ dia: 2, hora: 11.49 }), true);
  assert.strictEqual(estaAberto({ dia: 2, hora: 11.5 }), false);
  assert.strictEqual(estaAberto({ dia: 2, hora: 13 }), true);
});

test('status mostra quando reabre no mesmo dia', () => {
  assert.strictEqual(textoStatus({ dia: 3, hora: 12 }), 'Fechado agora · abre às 13h');
  assert.strictEqual(textoStatus({ dia: 3, hora: 7 }), 'Fechado agora · abre às 8h');
  assert.strictEqual(textoStatus({ dia: 3, hora: 10 }), 'Aberto agora');
  assert.strictEqual(textoStatus({ dia: 3, hora: 19 }), 'Fechado agora');
  assert.strictEqual(textoStatus({ dia: 0, hora: 10 }), 'Fechado agora');
});

test('horário: sábado fecha ao meio-dia (limite exclusivo)', () => {
  assert.strictEqual(estaAberto({ dia: 6, hora: 11.99 }), true);
  assert.strictEqual(estaAberto({ dia: 6, hora: 12 }), false);
});

test('fuso: 13h UTC de quarta é 10h em Canguçu', () => {
  const r = agoraEmCangucu(new Date('2026-10-14T13:00:00Z'));
  assert.deepStrictEqual(r, { dia: 3, hora: 10 });
});

test('categorias do index.html: 6 cards, cada um com nome, texto alternativo e foto existente', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const cards = [...html.matchAll(/data-categoria="([^"]+)"[\s\S]*?<img class="card-foto" src="([^"]+)" alt="([^"]*)"/g)];
  assert.strictEqual(cards.length, 6);
  for (const [, nome, foto, alt] of cards) {
    assert.ok(nome && alt, nome);
    assert.ok(fs.existsSync(path.join(__dirname, '..', foto)), `foto ausente: ${foto}`);
  }
});

test('mensagem da categoria cita a categoria em minúsculas', () => {
  assert.strictEqual(mensagemCategoria('Telas e arames'), 'Olá! Vim pelo site. Vocês têm telas e arames? Procuro: ');
});
