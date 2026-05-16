# Fonts Build Pipeline

This document explains how Tiempos fonts are integrated into the silicon-logic.com build without exposing them in the public repository.

## The problem

Silicon Logic uses Tiempos Text Web and Tiempos Headline from Klim Type Foundry under a paid Web Font Licence (20,000 monthly pageviews, single domain). The license permits use on silicon-logic.com but explicitly forbids redistribution. Committing the WOFF2 files to this public repository would violate the license.

## The architecture
Klim WOFF2 files
│
▼
silicon-logic-fonts (private repo)
│
│  cloned at build time using SSH deploy key
▼
silicon-logic-site/public/fonts/tiempos/
│
│  Astro build copies to dist/
▼
Cloudflare Pages production deployment

Two repositories:

- **silicon-logic-site** (this repo, public): Astro source, design system, no font binaries
- **silicon-logic-fonts** (separate, private): the 13 Tiempos WOFF2 files

A pre-build script in this repo clones the private fonts repo and copies the WOFF2 files into `public/fonts/tiempos/` before Astro runs. The fonts are then served like any other static asset at `/fonts/tiempos/<filename>.woff2`.

## How it works

### `scripts/fetch-fonts.sh`

This script handles font fetching in two contexts:

1. **Cloudflare Pages build (CI)**: detects the `FONTS_DEPLOY_KEY` environment variable, writes it to a temporary SSH private key file, and clones the private fonts repo via SSH using that key.

2. **Local development**: clones the private fonts repo via HTTPS using your normal GitHub authentication (gh CLI, git credential helper, or SSH agent).

In both modes, the script:
- Shallow-clones `silicon-logic-fonts` (depth=1, branch=main)
- Validates the cloned repo contains a `tiempos/` directory with WOFF2 files
- Copies all `*.woff2` files into `public/fonts/tiempos/`
- Validates source and target file counts match
- Cleans up temporary files on exit (including SSH key)

The script exits 0 on success and non-zero on any failure.

### `public/fonts/tiempos/*.woff2` is gitignored

The `.gitignore` file in this repo excludes the WOFF2 files. The fetch script populates them locally and in CI, but they are never committed to git. This is the load-bearing rule that keeps the license boundary visible.

## Cloudflare Pages configuration

### Environment variable: `FONTS_DEPLOY_KEY`

A Secret-type environment variable in Cloudflare Pages contains the SSH private key for the silicon-logic-fonts deploy key. Configured in:

- Production environment
- Preview environment

The corresponding public key is added to the `silicon-logic-fonts` repo as a deploy key with read-only access.

### Build command

The Cloudflare Pages build command runs the fetch script before Astro builds:

```bash
bash scripts/fetch-fonts.sh && pnpm install --frozen-lockfile && pnpm build
```

This ordering matters:
1. Fetch fonts into `public/fonts/tiempos/`
2. Install dependencies
3. Astro build (`pnpm build`) copies `public/` (now including fonts) to `dist/`

If the fetch step fails, the build aborts before pnpm runs.

## Local development setup

For working on silicon-logic-site locally:

```bash
# One-time: ensure you can authenticate to GitHub from your terminal
# (gh auth login, or have an SSH key registered with GitHub)

# Whenever you need to populate fonts in your local working tree:
bash scripts/fetch-fonts.sh

# Then run dev as normal
pnpm dev
```

The fetch script is safe to run repeatedly — it overwrites the existing files each time. You don't need to re-run it unless the fonts in the private repo have changed.

## Rotating the deploy key

If the SSH deploy key is ever compromised or needs rotation:

1. Generate a new ed25519 keypair on a trusted machine
2. Add the new public key as a deploy key in `silicon-logic-fonts` settings
3. Update the `FONTS_DEPLOY_KEY` Cloudflare Pages secret with the new private key (both Production and Preview environments)
4. Trigger a new build to verify
5. Delete the old deploy key from `silicon-logic-fonts`

Total downtime: zero. The new key works the moment it's in both Cloudflare and GitHub.

## When fonts in the private repo change

If Klim ships updated WOFF2 files (bug fixes, expanded character sets) or you license additional weights:

1. Push the new files to `silicon-logic-fonts` main branch
2. Trigger a rebuild of silicon-logic-site (push any commit, or use Cloudflare's "Retry deployment")
3. The fetch script pulls the latest fonts during the next build

No code changes in this repo required.

## Why not commit the fonts to a private branch of this repo?

Considered, rejected. The repo is public for transparency (Silicon Logic positions on verifiability and openness). Making it private to commit fonts would compromise that positioning. A separate private repo for licensed binaries keeps the public code public and the licensed assets private.

## Why not Cloudflare R2?

Considered, but the build-time fetch pattern is simpler operationally:
- One credential (the deploy key) instead of an R2 access key + bucket
- Fonts are version-controlled in the private repo
- No CORS configuration needed
- No separate hosting service to monitor

If font load times become a bottleneck (unlikely at Silicon Logic's archive-first scale), revisit.
