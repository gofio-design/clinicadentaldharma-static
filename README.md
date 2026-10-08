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

Las fuentes (Merriweather, Lato, Crimson Text, Inter, Poppins, Cousine) están alojadas en `fonts/` (Fontsource, licencia OFL), sin llamadas a Google Fonts.

Se conservan el selector de idioma (GTranslate), el mapa de Google y el enlace de cita de Calendly, que dependen de servicios externos.

## Nuevo artículo

La web es HTML estático: no hay CMS. Para publicar un artículo se copia la plantilla, se edita el texto y se añade el enlace al menú.

### 1. Copia la plantilla

Duplica la carpeta `_plantilla-articulo/` y ponle el nombre que tendrá la dirección del artículo: en minúsculas, sin tildes ni eñes, con guiones. Por ejemplo `bruxismo-y-estres/` → `https://clinicadentaldharma.com/bruxismo-y-estres/`.

La carpeta tiene que estar en la raíz del repositorio, al lado de `dentosofia/` o `tratamientos/`. Si la metes en otra subcarpeta se rompen las rutas de estilos e imágenes.

### 2. Edita el `index.html` de la carpeta nueva

Busca `EDITAR` en el archivo: cada comentario indica qué cambiar.

- **Cabecera (`<head>`)**
  - `<title>` y `og:title`: el título del artículo.
  - `description` y `og:description`: un resumen de unos 150 caracteres.
  - `canonical` y `og:url`: sustituye `NOMBRE-DE-LA-CARPETA` por el nombre de tu carpeta.
  - `robots`: cambia `noindex, nofollow` por `index, follow`. Si no lo cambias, Google no indexará el artículo.
- **Bloque 1**: imagen principal, título (`<h1>`) y entradilla.
- **Bloque 2**: subtítulo (`<h2>`), texto e imagen lateral. Si no te hace falta, puedes borrarlo entero, desde su comentario hasta el `</div>` que cierra la fila.
- **Bloque 3**: texto final a todo el ancho.

Dentro de cada texto puedes añadir o quitar párrafos `<p>`, listas `<ul><li>`, `<strong>` y enlaces. No añadas bloques nuevos copiando filas con otros números (`et_pb_row_3`, `et_pb_text_5`…): no tienen estilos y se verían mal.

**Imágenes**: súbelas a `wp-content/uploads/articulos/`, con un ancho máximo de unos 1600 px y en JPG si son fotos. En cada `<img>` cambia:
- `src`: la ruta de tu imagen, empezando por `../`. Por ejemplo `../wp-content/uploads/articulos/mi-foto.jpg`.
- `srcset`: bórralo, o deja solo tu imagen.
- `width` y `height`: el tamaño real en píxeles.
- `alt`: una descripción de lo que se ve en la imagen.

### 3. Añádelo al menú

El menú está copiado en **cada página** (`index.html` de la raíz y el `index.html` de cada carpeta, incluida la plantilla), dentro de `<ul ... id="menu-principal">`. Hay que añadir la línea del artículo en todos ellos. El menú del móvil se genera solo a partir de este.

Ojo con la ruta del enlace:
- en el `index.html` de la raíz: `href="bruxismo-y-estres/"`
- en todas las demás páginas: `href="../bruxismo-y-estres/"`

**Opción A: dentro del desplegable «Tratamientos»**. Añade una línea justo después de la de *Coaching Dental Holístico*:

```html
<li class="menu-item"><a href="../bruxismo-y-estres/">Bruxismo y estrés</a></li>
```

**Opción B: como entrada propia en la barra** (por ejemplo, un «Blog» o un artículo destacado). Añádela antes del último `</ul>` del menú, después del `</li>` que cierra «Tratamientos»:

```html
<li class="menu-item"><a href="../bruxismo-y-estres/">Bruxismo y estrés</a></li>
```

**Para hacerlo de una vez en VS Code**: usa *Buscar en archivos* (Ctrl+Mayús+H) con «Usar expresión regular» activado.

- Buscar: `(<a (?:aria-current="page" )?href="(\.\./)?coaching-dental-holistico/">Coaching Dental Holístico</a></li>)`
- Reemplazar: `$1\n<li class="menu-item"><a href="$2bruxismo-y-estres/">Bruxismo y estrés</a></li>`

El `$2` guarda el `../` cuando lo hay, así que la ruta queda bien en todas las páginas. Antes de reemplazar, revisa que haya una coincidencia por página (ahora mismo son 12).

En el artículo nuevo puedes marcar su propia entrada como página actual añadiendo `current-menu-item` a su `class`. No es obligatorio.

### 4. Añádelo al sitemap

En `sitemap.xml`, añade una línea antes de `</urlset>`:

```xml
  <url><loc>https://clinicadentaldharma.com/bruxismo-y-estres/</loc></url>
```

### 5. Revisa y publica

```sh
python -m http.server 8000      # abre http://localhost:8000/bruxismo-y-estres/
git add -A
git commit -m "Nuevo artículo: Bruxismo y estrés"
git push
```

GitHub Pages lo publica en un par de minutos.

## Publicar

GitHub Pages: *Settings → Pages → Deploy from a branch → `main` / `(root)`*.
Para usar el dominio propio, añade un archivo `CNAME` con `clinicadentaldharma.com` y apunta el DNS a GitHub Pages.

## Ver en local

```sh
python3 -m http.server 8000
```
