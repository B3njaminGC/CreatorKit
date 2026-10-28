#!/usr/bin/env node
// Genera códigos Pro para vender.
//   node tools/generar-codigos.js 20      -> crea 20 códigos nuevos
//
// - Los códigos en texto plano se guardan en  codigos-privados.txt  (NO se sube a GitHub: está en .gitignore).
// - Solo los hashes SHA-256 se agregan a  pro-codes.js  (eso sí se sube; no se puede sacar el código de un hash).
// Después de generar, haz commit y push de pro-codes.js para que los códigos nuevos funcionen en la app.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const HASH_FILE = path.join(ROOT, 'pro-codes.js');
const PRIVATE_FILE = path.join(ROOT, 'codigos-privados.txt');
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O/1/I para evitar confusiones

const count = Math.max(1, Math.min(500, parseInt(process.argv[2], 10) || 10));
const norm = s => s.toUpperCase().replace(/[^A-Z0-9]/g, '');
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const group = () => Array.from(crypto.randomBytes(4), b => ALPHABET[b % ALPHABET.length]).join('');

let existing = [];
if (fs.existsSync(HASH_FILE)) existing = [...fs.readFileSync(HASH_FILE, 'utf8').matchAll(/"([0-9a-f]{64})"/g)].map(m => m[1]);

const seen = new Set(existing);
const fresh = [];
while (fresh.length < count) {
  const code = `CK-${group()}-${group()}-${group()}`;
  const h = sha(norm(code));
  if (seen.has(h)) continue;
  seen.add(h);
  fresh.push({ code, h });
}

const all = existing.concat(fresh.map(f => f.h));
fs.writeFileSync(HASH_FILE,
  '// Hashes SHA-256 de los códigos Pro válidos. Es seguro que sea público: no revela los códigos.\n' +
  'const PRO_HASHES = [\n' + all.map(h => `  "${h}"`).join(',\n') + '\n];\n');

const stamp = new Date().toISOString().slice(0, 10);
fs.appendFileSync(PRIVATE_FILE, `# Generados ${stamp}\n` + fresh.map(f => f.code).join('\n') + '\n\n');

console.log(`Listo: ${fresh.length} códigos nuevos.`);
console.log(`  Códigos (privados): ${PRIVATE_FILE}`);
console.log(`  Hashes (públicos):  ${HASH_FILE}  -> total ${all.length}`);
console.log('Ahora sube pro-codes.js a GitHub. NO subas codigos-privados.txt.');
