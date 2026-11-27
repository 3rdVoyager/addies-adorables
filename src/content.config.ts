import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z, type ZodType } from "astro/zod";

export type ImageBlock = {
  type: "image";
  src: string;
  alt?: string;
  size?: "small" | "medium" | "large" | "full";
  crop?: "natural" | "landscape" | "square" | "portrait";
};

export type ButtonBlock = {
  type: "button";
  href: string;
  title: string;
  variant?: "primary" | "secondary";
};

export type GalleryBlock = {
  type: "gallery";
  images: string[];
  size?: "small" | "medium" | "large" | "full";
  crop?: "natural" | "landscape" | "square" | "portrait";
  controls?: boolean;
  indicators?: boolean;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  pauseOnHover?: boolean;
};

export type ContentBlock =
  | { type: "text"; text: string }
  | ImageBlock
  | ButtonBlock
  | GalleryBlock
  | {
      type: "block";
      color?: "navy" | "cream" | "white" | "slate" | "pink" | "transparent";
      variant?: "default" | "card";
      layout?: "auto" | "1col" | "2cols" | "3cols" | "4cols" | "5cols";
      blocks?: ContentBlock[];
    };

export type ContentSection = {
  color: "navy" | "cream" | "white" | "slate" | "pink";
  layout?: "auto" | "1col" | "2cols" | "3cols" | "4cols" | "5cols";
  blocks?: ContentBlock[];
};

export type PageFrontmatter = {
  title: string;
  description?: string;
  standalone: boolean;
  sections: ContentSection[];
};

const layoutSchema = z.enum(["auto", "1col", "2cols", "3cols", "4cols", "5cols"]);

const contentBlockSchema: ZodType<ContentBlock> = z.lazy(() =>
  z.discriminatedUnion("type", [
    z.object({
      type: z.literal("text"),
      text: z.string(),
    }),
    z.object({
      type: z.literal("image"),
      src: z.string(),
      alt: z.string().optional(),
      size: z.enum(["small", "medium", "large", "full"]).optional(),
      crop: z.enum(["natural", "landscape", "square", "portrait"]).optional(),
    }),
    z.object({
      type: z.literal("button"),
      href: z.string(),
      title: z.string(),
      variant: z.enum(["primary", "secondary"]).optional(),
    }),
    z.object({
      type: z.literal("gallery"),
      images: z.array(z.string()),
      size: z.enum(["small", "medium", "large", "full"]).optional(),
      crop: z.enum(["natural", "landscape", "square", "portrait"]).optional(),
      controls: z.boolean().optional(),
      indicators: z.boolean().optional(),
      autoScroll: z.boolean().optional(),
      autoScrollInterval: z.number().optional(),
      pauseOnHover: z.boolean().optional(),
    }),
    z.object({
      type: z.literal("block"),
      color: z.enum(["navy", "cream", "white", "slate", "pink", "transparent"]).optional(),
      variant: z.enum(["default", "card"]).optional(),
      layout: layoutSchema.optional(),
      blocks: z.array(contentBlockSchema).optional(),
    }),
  ]),
);

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    standalone: z.boolean().default(false),
    sections: z
      .array(
        z.object({
          color: z.enum(["navy", "cream", "white", "slate", "pink"]),
          layout: layoutSchema.optional(),
          blocks: z.array(contentBlockSchema).optional(),
        }),
      )
      .default([]),
  }),
});

export const collections = {
  pages,
};
