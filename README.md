# CreatorKit

Herramientas gratis para creadores de contenido (YouTube, TikTok). Funciona en el navegador, se instala como app en Android (PWA) y no usa ninguna API de pago: todo corre en el dispositivo.

## Qué incluye
- **Títulos**: generador de títulos, descripción y tags por tipo de video.
- **Analizador**: puntaje de 0 a 100 para un título, con consejos y comparación A/B.
- **Miniatura**: editor 1280×720 con imagen o degradado, texto con contorno, borde y descarga JPG (≤ 2 MB) o PNG.
- **Calendario**, **Checklist** por video e **Ideas**.
- **Pro**: packs por nicho (Gaming, Cocina, Fitness, Finanzas, Educación) con títulos, descripciones, tags y ganchos. Se desbloquean con un código.

## Uso
Abre `index.html` en el navegador, o publícalo con GitHub Pages (Settings → Pages → rama `main`, carpeta `/ (root)`).

Los datos se guardan solo en el dispositivo (localStorage). Al cambiar archivos, sube el número de `CACHE` en `sw.js` para que las apps instaladas se actualicen.

## Vender Pro (sin servidor)
1. Genera códigos: `node tools/generar-codigos.js 20` (crea `codigos-privados.txt`, que **no** se sube, y agrega los hashes a `pro-codes.js`).
2. Sube `pro-codes.js` a GitHub para que los códigos nuevos funcionen.
3. Entrega un código a cada comprador (Gumroad, Mercado Pago, Ko-fi, etc.).
4. Pega tu link de pago en `PRO_URL` (dentro de `index.html`) para mostrar el botón "Conseguir Pro".

Nunca subas `codigos-privados.txt`. Un código puede compartirse; para algo más estricto habría que validar online (por ejemplo con la API de licencias de Gumroad).
