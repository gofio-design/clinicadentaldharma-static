# Clínica Dental Dharma · web estática

Copia estática de [clinicadentaldharma.com](https://clinicadentaldharma.com), sin WordPress.

## Qué se ha hecho

- 11 páginas públicas (inicio + tratamientos), cada una en `slug/index.html`, con las mismas URLs que la web original.
- Enlaces internos relativos y todos los recursos (CSS, JS, fuentes, imágenes, vídeo) dentro del repositorio.
- Eliminado: Google Site Kit / gtag (Analytics), WP Consent API, `xmlrpc`, `wp-json`, oEmbed, feeds RSS, *shortlink*, *speculation rules*, metas `generator` y comentarios de plugins.
- Eliminadas las páginas sobrantes de WordPress (entrada de ejemplo, categoría y autor).
- Corregido el botón de WhatsApp, que en la web original apuntaba a `wa.me/...` sin `https://` y daba error.
- Vídeo de portada recomprimido (de 94 MB a 4 MB, sin audio porque se reproduce silenciado).
- `sitemap.xml` y `robots.txt` nuevos. Se mantienen las metas SEO de Yoast (title, description, Open Graph, JSON-LD) con la URL canónica del dominio real.

Se conservan el selector de idioma (GTranslate), el mapa de Google y el enlace de cita de Calendly, que dependen de servicios externos.

## Publicar

GitHub Pages: *Settings → Pages → Deploy from a branch → `main` / `(root)`*.
Para usar el dominio propio, añade un archivo `CNAME` con `clinicadentaldharma.com` y apunta el DNS a GitHub Pages.

## Ver en local

```sh
python3 -m http.server 8000
```
