# docs-summary

A tiny Node.js CLI that scans a docs folder and generates a top-level SUMMARY.md listing markdown files with their first heading.

Usage:

- Install Node.js (>=14)
- From the repository root run:

  node docs-summary/index.js [docs_dir] [output_file]

Defaults:
- docs_dir: `docs`
- output_file: `SUMMARY.md`

Example:

  node docs-summary/index.js docs SUMMARY.md

This will scan the `docs/` directory and write `SUMMARY.md` at the repo root.
