#!/usr/bin/env node
// Genera códigos Pro de UN SOLO USO para vender.
//   node tools/generar-codigos.js 20      -> crea 20 códigos nuevos
//
// - Los códigos en texto plano se guardan en  codigos-privados.txt  (NO se sube a GitHub: está en .gitignore).
// - Se imprime y guarda en  codigos-sql.txt  la sentencia SQL con los hashes SHA-256 de esos códigos.
//   Pégala en Supabase → SQL Editor → Run para que los códigos funcionen (el servidor nunca guarda el código real).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const PRIVATE_FILE = path.join(ROOT, 'codigos-privados.txt');
const SQL_FILE = path.join(ROOT, 'codigos-sql.txt');
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O/1/I para evitar confusiones

const count = Math.max(1, Math.min(500, parseInt(process.argv[2], 10) || 10));
const norm = s => s.toUpperCase().replace(/[^A-Z0-9]/g, '');
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const group = () => Array.from(crypto.randomBytes(4), b => ALPHABET[b % ALPHABET.length]).join('');

const fresh = [];
const seen = new Set();
while (fresh.length < count) {
  const code = `CK-${group()}-${group()}-${group()}`;
  const h = sha(norm(code));
  if (seen.has(h)) continue;
  seen.add(h);
  fresh.push({ code, h });
}

const sql = 'insert into public.pro_codes (code_hash) values\n' +
  fresh.map(f => `  ('${f.h}')`).join(',\n') + '\non conflict do nothing;\n';

fs.appendFileSync(PRIVATE_FILE, `# Generados ${new Date().toISOString().slice(0, 10)}\n` + fresh.map(f => f.code).join('\n') + '\n\n');
fs.writeFileSync(SQL_FILE, sql);

console.log(`Listo: ${fresh.length} códigos nuevos.`);
console.log(`  Códigos (privados): ${PRIVATE_FILE}`);
console.log(`  SQL para Supabase:  ${SQL_FILE}`);
console.log('Pega el SQL en Supabase → SQL Editor → Run. NO subas codigos-privados.txt a GitHub.');
