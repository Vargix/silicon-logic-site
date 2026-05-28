# silicon-logic-site

Source for [siliconlogic.dev](https://siliconlogic.dev) — the public-facing publication for Silicon Logic.

The editorial substrate (signed benchmark runs, methodology, canonical article Markdown) lives at [Silicon-Logic/silicon-logic](https://github.com/Silicon-Logic/silicon-logic). This repo is the renderer that turns that substrate into a publication readers can read.

## Status

Pre-launch. First article in progress.

Launch toggle: `SILICON_LOGIC_COMING_SOON_MODE` defaults to `true`; set it to `false` and rebuild/redeploy to restore the existing gated/public site.

## Verification

Every benchmark Silicon Logic publishes is a cryptographically signed artifact. Readers do not have to trust the editor — they can verify the math.

The maintainer's Ed25519 public key fingerprint:
```
48d35cd9413be6fb2475b3b95261620d45fb418c99016ad0ef9463348895f73e
```

The committed public key, the canonical methodology, and every signed `BenchmarkRun` live in the [main repository](https://github.com/Silicon-Logic/silicon-logic). See [`docs/methodology.md`](https://github.com/Silicon-Logic/silicon-logic/blob/main/docs/methodology.md) for how runs are produced, aggregated, signed, and verified.

## License

Code in this repo: pending decision (likely MIT or Apache 2.0).
Article content rendered here: CC BY 4.0, with each article's license notice committed alongside it in the main repository.
