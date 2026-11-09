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

## Cuentas y Pro (Supabase, plan gratis)
- Lo gratis (generador con 6 packs, analizador, miniaturas, calendario, checklist, ideas) funciona sin cuenta.
- **Pro**: requiere cuenta gratis. Se activa con un código de **un solo uso** y queda guardado en la cuenta para siempre. Desbloquea packs extra (Tecnología, Viajes, Emprendimiento, Belleza y moda, Humor) cuyo contenido vive **solo en el servidor** (tabla `packs`, visible únicamente para cuentas Pro).
- El esquema está en `supabase/schema.sql`. La clave `sb_publishable_…` del código es pública por diseño; la seguridad la dan las reglas RLS del servidor.

### Vender Pro
1. Genera códigos: `node tools/generar-codigos.js 20` (crea `codigos-privados.txt` y `codigos-sql.txt`; ninguno se sube a GitHub).
2. Pega el contenido de `codigos-sql.txt` en Supabase → SQL Editor → Run.
3. Entrega un código a cada comprador (Gumroad, Mercado Pago, Ko-fi, etc.).
4. Pega tu link de pago en `PRO_URL` (dentro de `index.html`) para mostrar el botón "Conseguir Pro".

## App de Android (APK)
Actions → **Compilar APK** → Run workflow. Al crear una etiqueta `v1.0.0` el APK se publica como Release.

Nota: los proyectos gratis de Supabase se pausan tras una semana sin uso (se reactivan desde su panel).
