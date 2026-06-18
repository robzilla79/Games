# Games

This repository contains small standalone browser games and tools.

## Crown Circuit: Queens of the Ring

A self-contained browser wrestling RPG focused on a **women's-only wrestling league** with a polished presentation style, expanded customization, and TV-style exhibition viewing.

### Files

- `index.html` — Crown Circuit main build
- `neon-slam-mobile-single-file.html` — single-file portable Crown Circuit build
- `icons/` — app icons

## TextureForge 2K

A standalone browser texture decal workflow for building repeatable 2K-style texture packs.

### Files

- `textureforge-2k/index.html` — standalone app build
- `textureforge-2k/README_TEXTUREFORGE_2K.txt` — usage notes
- `textureforge-2k/V2_LOCAL_GENERATION.md` — V2 local ComfyUI/Ollama generation plan
- `textureforge-2k/config/textureforge_v2_local_profiles.json` — local model profile placeholders
- `textureforge-2k/comfyui/workflows/` — ComfyUI API workflow templates
- `textureforge-2k/ollama/` — Ollama schema and system prompt

### Current TextureForge features

- Body, clothing, and full-pack modes
- Region templates with prompt generation
- Bulk image import with filename matching and duplicate-match protection
- Browser-side neutral-background removal and transparent PNG processing
- Mirrored and split output variants
- Validation for completeness, dimensions, alpha, and size warnings
- Manifest, README, prompt, PNG, contact sheet, and zip export

### V2 direction

TextureForge V2 is being designed as a local-first reference-to-texture pipeline:

- ChatGPT/manual handoff for highest-quality reference interpretation
- ComfyUI workflow export/API automation for local image generation
- Ollama structured prompt assistant for local text and QA tasks
- TextureForge import, processing, validation, and packaging as the control room

## iPhone use

Host the folder on any static host, open the relevant `index.html` in Safari, then use **Share → Add to Home Screen**.
