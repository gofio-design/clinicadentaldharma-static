# Clínica Dental Dharma · web con CMS

Web de [clinicadentaldharma.com](https://clinicadentaldharma.com) hecha con [Astro](https://astro.build) y editable desde el navegador con [Sveltia CMS](https://sveltiacms.app) (CMS basado en git: cada cambio es un commit en este repositorio).

## Editar la web

1. Entra en **`/admin/`** de la web publicada (por ejemplo `https://gofio-design.github.io/clinicadentaldharma-cms/admin/`).
2. Inicia sesión con una de estas opciones:
   - **Sign In Using Access Token**: pega un *token* de GitHub con permiso de escritura en este repositorio (GitHub → Settings → Developer settings → Fine-grained tokens → acceso a `clinicadentaldharma-cms` con *Contents: Read and write*).
   - **Work with Local Repository** (Chrome o Edge): elige la carpeta del repositorio clonado en tu ordenador; los cambios se guardan en tus archivos y luego haces commit y push.
3. En **Páginas** está cada página con su título y descripción para Google y sus bloques de contenido en el orden en que aparecen (textos, imágenes, botones y tarjetas). En **Datos de la clínica** están la dirección, el horario, el teléfono, el WhatsApp, el email y las redes, que se usan en el pie y en el bloque «Horario» de todas las páginas.
4. Al guardar, el CMS hace un commit en `main` y GitHub Actions vuelve a publicar la web en uno o dos minutos.

Las imágenes nuevas se suben a `public/wp-content/uploads/` y la biblioteca de medios muestra también las que ya había.

## Cómo está montado

- `src/plantillas/<página>.html`: la maquetación original de Divi de cada página, con marcas `{{...}}` donde va el contenido editable. `_pie.html` es el pie común.
- `src/content/paginas/<página>.yml`: el contenido de cada página (textos en Markdown).
- `src/content/ajustes/clinica.yml`: datos de contacto y horario.
- `src/lib/render.ts`: rellena las plantillas con el contenido al compilar.
- `public/`: CSS, JS, fuentes (`fonts/`, Fontsource, licencia OFL), imágenes y vídeo, `robots.txt`, `sitemap.xml` y el editor (`admin/`).

Los enlaces son relativos, así que la web funciona igual en GitHub Pages (`/clinicadentaldharma-cms/`) y en el dominio propio.

Para añadir un bloque editable nuevo: pon una marca en la plantilla (`{{md:texto_N}}`, `{{cms:clave.campo}}`, `{{src:imagen_N.imagen}}` o `{{href:boton_N.enlace}}`), añade el valor en el `.yml` de la página y el campo en `public/admin/config.yml`.

## Publicar

Una sola vez: *Settings → Pages → Build and deployment → Source: **GitHub Actions***. Desde entonces, cada push a `main` (incluidos los cambios hechos desde el CMS) compila y publica la web con `.github/workflows/deploy.yml`.

Para usar el dominio propio, añade `public/CNAME` con `clinicadentaldharma.com`, apunta el DNS a GitHub Pages y cambia `site_url` en `public/admin/config.yml`.

## En local

```sh
npm install
npm run dev      # http://localhost:4321 · editor en http://localhost:4321/admin/index.html
npm run build    # genera dist/
```
