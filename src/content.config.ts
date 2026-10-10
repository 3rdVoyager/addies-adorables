import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    pageTitle: z.string(),
    heroTitle: z.string().optional(),
    subTitle: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  pages,
};
