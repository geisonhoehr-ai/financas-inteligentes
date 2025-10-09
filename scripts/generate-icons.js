const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Configurações
const ICON_TEXT = '💰';
const APP_NAME = 'Financeiro';
const SIZES = [192, 512];

// Cores (Apple Blue)
const GRADIENT_START = '#007AFF';
const GRADIENT_END = '#0051D5';

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Criar gradiente azul (Apple style)
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, GRADIENT_START);
  gradient.addColorStop(1, GRADIENT_END);

  // Desenhar fundo com gradiente
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Desenhar emoji/ícone
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const emojiSize = size * 0.5;
  ctx.font = `${emojiSize}px Arial`;
  ctx.fillText(ICON_TEXT, size / 2, APP_NAME ? size / 2 - size * 0.1 : size / 2);

  // Desenhar nome do app (se houver)
  if (APP_NAME) {
    ctx.fillStyle = 'white';
    const textSize = size * 0.12;
    ctx.font = `bold ${textSize}px Arial, sans-serif`;
    ctx.fillText(APP_NAME, size / 2, size / 2 + size * 0.25);
  }

  // Aplicar bordas arredondadas (iOS style)
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  const radius = size * 0.225; // 22.5% radius (iOS padrão)
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();

  return canvas;
}

// Gerar ícones
console.log('🎨 Gerando ícones PWA...\n');

SIZES.forEach(size => {
  const canvas = generateIcon(size);
  const filename = `icon-${size}.png`;
  const filepath = path.join(__dirname, '..', 'public', filename);
  
  // Salvar arquivo
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filepath, buffer);
  
  console.log(`✅ ${filename} criado com sucesso!`);
});

console.log('\n🎉 Ícones gerados com sucesso em public/\n');
console.log('📋 Arquivos criados:');
console.log('   - public/icon-192.png');
console.log('   - public/icon-512.png');
console.log('\n✨ Pronto para deploy!');

