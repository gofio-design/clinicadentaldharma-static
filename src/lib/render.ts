import { marked } from 'marked';

// Plantillas HTML de cada página (maquetación original de Divi) con marcas {{...}}
// que se rellenan con el contenido editable desde el CMS.
const plantillas = import.meta.glob<string>('../plantillas/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function plantilla(nombre: string): string {
  const html = plantillas[`../plantillas/${nombre}.html`];
  if (html === undefined) throw new Error(`Falta la plantilla src/plantillas/${nombre}.html`);
  return html;
}

type Bloque = Record<string, unknown>;
type Pagina = { titulo: string; descripcion: string; bloques: Record<string, Bloque> };
type Clinica = Record<string, unknown> & {
  direccion: string;
  horario: { dias: string; horas: string }[];
  whatsapp: string;
};

const escapar = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// '/tratamientos/' -> 'tratamientos/' en la portada y '../tratamientos/' en las demás.
function resolver(url: string, raiz: string): string {
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  return raiz + url.slice(1) || './';
}

const ALINEACION: Record<string, string> = { izquierda: 'left', centro: 'center' };

// `envolver` reproduce los estilos en línea que tenía el bloque en Divi (tamaño, color, peso).
function markdown(texto: string, raiz: string, alineacion?: unknown, envolver?: string): string {
  let html = marked.parse(texto ?? '', { async: false }).trim();
  if (envolver) {
    html = html.replace(
      /<(p|h[1-6]|li)>([\s\S]*?)<\/\1>/g,
      (_, tag, contenido) => `<${tag}><span style="${envolver}">${contenido}</span></${tag}>`,
    );
  }
  html = html.replace(/(href|src)="(\/[^"]*)"/g, (_, attr, url) => `${attr}="${resolver(url, raiz)}"`);
  const align = ALINEACION[String(alineacion)];
  if (align) html = html.replace(/<(p|h[1-6]|ul|ol)>/g, `<$1 style="text-align: ${align};">`);
  return html;
}

function pie(c: Clinica, raiz: string): string {
  const direccion = `<p>${c.direccion.trim().split('\n').map(escapar).join('<br/>')}</p>`;
  const horario = c.horario.map((h) => `<p>${escapar(h.dias)}<br/>${escapar(h.horas)}</p>`).join('\n');
  return plantilla('_pie')
    .replaceAll('{{raiz}}', raiz)
    .replace('{{direccion}}', direccion)
    .replace('{{horario_pie}}', horario);
}

function horarioTarjeta(c: Clinica): string {
  const blanco = (s: string) => `<span style="color: #ffffff;">${escapar(s)}</span>`;
  return [
    `<p>${blanco('')}</p>`,
    ...c.horario.map((h) => `<p>${blanco(h.dias)}</p>\n<h2>${blanco(h.horas)}</h2>`),
    '<p></p>',
  ].join('\n');
}

// Si se cambia la imagen desde el CMS, se quitan srcset/sizes/dimensiones de la original.
function imagenes(html: string): string {
  return html.replace(/<img\b[^>]*\sdata-src-original="([^"]*)"[^>]*>/g, (tag, original) => {
    const src = /\ssrc="([^"]*)"/.exec(tag)?.[1];
    let t = tag.replace(/\sdata-src-original="[^"]*"/, '');
    if (src !== original) t = t.replace(/\s(srcset|sizes|width|height|title)="[^"]*"/g, '');
    return t;
  });
}

// Un h4 justo después de un h2 se publica como h3 con el aspecto de h4 (orden de títulos accesible).
function ordenTitulos(html: string): string {
  let ultimo = 0;
  const cambiados: boolean[] = [];
  return html.replace(/<(\/?)h([1-6])\b([^>]*)>/g, (tag, cierre, n, attrs) => {
    const nivel = Number(n);
    if (cierre) {
      if (nivel === 4 && cambiados.pop()) return '</h3>';
      return tag;
    }
    if (nivel === 4 && ultimo < 3) {
      cambiados.push(true);
      ultimo = 3;
      const clase = /\sclass="([^"]*)"/.exec(attrs);
      const resto = attrs.replace(/\sclass="[^"]*"/, '');
      return `<h3 class="${clase ? clase[1] + ' ' : ''}was-h4"${resto}>`;
    }
    if (nivel === 4) cambiados.push(false);
    ultimo = nivel;
    return tag;
  });
}

export function renderPagina(id: string, pagina: Pagina, clinica: Clinica): string {
  const raiz = id === 'inicio' ? '' : '../';
  const c: Record<string, unknown> = {
    ...clinica,
    whatsapp_enlace: `https://wa.me/34${clinica.whatsapp.replace(/\D/g, '')}`,
  };
  const campo = (ruta: string): unknown => {
    const [clave, sub] = ruta.split('.');
    return sub === undefined ? c[clave] : pagina.bloques[clave]?.[sub];
  };

  let html = plantilla(id).replace('{{pie}}', pie(clinica, raiz));
  html = html.replace(/\{\{([a-z_]+)(?::([^}|]+))?(?:\|([^}]+))?\}\}/g, (marca, tipo: string, ruta?: string, envolver?: string) => {
    switch (tipo) {
      case 'seo':
        return marca;
      case 'cms':
        return escapar(campo(ruta!));
      case 'src':
      case 'href':
        return escapar(resolver(String(campo(ruta!) ?? ''), raiz));
      case 'md': {
        const b = pagina.bloques[ruta!] ?? {};
        return markdown(String(b.texto ?? ''), raiz, b.alineacion, envolver);
      }
      case 'json':
        return JSON.stringify(pagina.titulo).replace(/</g, '\\u003c');
      case 'horario_tarjeta':
        return horarioTarjeta(clinica);
      default:
        throw new Error(`Marca desconocida ${marca} en la plantilla ${id}`);
    }
  });
  html = html
    .replaceAll('{{seo.titulo}}', escapar(pagina.titulo))
    .replaceAll('{{seo.descripcion}}', escapar(pagina.descripcion));
  return ordenTitulos(imagenes(html));
}
