import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Cada bloque es un módulo de la plantilla: texto, imagen, botón, tarjeta o portada.
const bloque = z.object({
  texto: z.string().nullish(),
  alineacion: z.enum(["izquierda", "centro"]).nullish(),
  imagen: z.string().nullish(),
  alt: z.string().nullish(),
  enlace: z.string().nullish(),
  titulo: z.string().nullish(),
});

const paginas = defineCollection({
  loader: glob({ pattern: '*.yml', base: './src/content/paginas' }),
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string(),
    bloques: z.record(z.string(), bloque),
  }),
});

const ajustes = defineCollection({
  loader: glob({ pattern: '*.yml', base: './src/content/ajustes' }),
  schema: z.object({
    direccion: z.string(),
    horario: z.array(z.object({ dias: z.string(), horas: z.string() })),
    email: z.string(),
    telefono: z.string(),
    whatsapp: z.string(),
    facebook: z.string(),
    instagram: z.string(),
    copyright: z.string(),
  }),
});

export const collections = { paginas, ajustes };
