import { defineConfig } from 'astro/config';

// Las páginas usan rutas relativas, así que la web funciona igual en
// gofio-design.github.io/clinicadentaldharma-cms/ y en el dominio propio.
export default defineConfig({
  site: 'https://clinicadentaldharma.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: false,
});
