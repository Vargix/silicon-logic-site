import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articleTrackSchema = z.enum(["reviews", "benchmarks", "notes"]);

const articles = defineCollection({
  loader: glob({
    pattern: ["**/*.md", "**/*.markdown", "!**/README.md", "!**/README.markdown"],
    base: "./src/content/articles",
  }),
  schema: z
    .object({
      title: z.string().min(1),
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      track: articleTrackSchema,
      date: z.coerce.date(),
      description: z.string().min(40).max(220),
      author: z.string().min(1),
      concepts: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)),
      signed: z.boolean().default(false),
      signed_run: z.string().optional(),
      artifact_sha: z.string().optional(),
      methodology_version: z.string().optional(),
      toc: z.boolean().default(false),
      updated: z.coerce.date().optional(),
      draft: z.boolean().default(false),
    })
    .strict()
    .superRefine((data, ctx) => {
      if (!data.signed) return;

      if (!data.signed_run) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["signed_run"],
          message: "signed_run is required when signed is true.",
        });
      }

      if (!data.methodology_version) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["methodology_version"],
          message: "methodology_version is required when signed is true.",
        });
      }
    }),
});

export const collections = { articles };
