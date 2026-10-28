# CreatorKit

Herramientas gratis para creadores de contenido (YouTube, TikTok). Funciona en el navegador, se instala como app en Android (PWA) y no usa ninguna API de pago: todo corre en el dispositivo.

## Qué incluye
- **Títulos**: generador de títulos, descripción y tags por tipo de video.
- **Analizador**: puntaje de 0 a 100 para un título, con consejos y comparación A/B.
- **Miniatura**: editor 1280×720 con imagen o degradado, texto con contorno, borde y descarga JPG (≤ 2 MB) o PNG.
- **Calendario**, **Checklist** por video e **Ideas**.

## Uso
Abre `index.html` en el navegador, o publícalo con GitHub Pages (Settings → Pages → rama `main`, carpeta `/ (root)`).

Los datos se guardan solo en el dispositivo (localStorage). Al cambiar archivos, sube el número de `CACHE` en `sw.js` para que las apps instaladas se actualicen.
