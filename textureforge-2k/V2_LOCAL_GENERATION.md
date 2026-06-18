# TextureForge 2K V2 Local Generation Plan

This folder defines the first local-generation bridge for TextureForge V2.

## Goal

TextureForge should become the control room for creating WWE2K-style texture import packs from references:

1. Upload or describe a face/body/gear reference.
2. Generate structured cues and prompts.
3. Send image jobs to local ComfyUI or export workflows manually.
4. Import generated outputs back into TextureForge.
5. Process, validate, and export the final texture pack zip.

## Local Services

### ComfyUI

Default URL:

```text
http://127.0.0.1:8188
```

ComfyUI workflows should be exported/used in API format. The official ComfyUI docs describe API workflows as JSON objects where node IDs map to `class_type` and `inputs`; the queue endpoint is `/prompt`.

Current starter workflows:

- `comfyui/workflows/textureforge_v2_sdxl_img2img_api.json`
- `comfyui/workflows/textureforge_v2_sdxl_txt2img_region_api.json`

These are intentionally vanilla ComfyUI workflows. They use core nodes so they can run before we know which custom nodes are installed.

### Ollama

Default URL:

```text
http://127.0.0.1:11434
```

Use Ollama `/api/chat` with `stream: false` for structured JSON responses.

Current Ollama files:

- `ollama/textureforge_v2_reference_schema.json`
- `ollama/textureforge_v2_system_prompt.md`

## Model Decision

Do not hard-code one public model name yet. Rob's local install decides the real filenames.

TextureForge should use model slots:

- `__USER_REALISTIC_SDXL_CHECKPOINT__`
- `__USER_REALISTIC_OR_DESIGN_SDXL_CHECKPOINT__`
- `__USER_FAST_INSTRUCTION_MODEL__`
- `__USER_VISION_MODEL_IF_INSTALLED__`

Recommended profile behavior:

| Profile | Backend | Purpose | Starting settings |
|---|---|---|---|
| realistic_face_reference | ComfyUI img2img | face, likeness cues, skin tone | 26 steps, CFG 5.5, denoise 0.38 |
| skin_body_regions | ComfyUI img2img | body shading decals | 26 steps, CFG 5.0, denoise 0.42 |
| gear_panels | ComfyUI txt2img | clothing, boots, panels | 30 steps, CFG 6.0, denoise 1.0 |
| reference_notes_to_json | Ollama chat | convert notes into TextureForge JSON | temp 0.35, stream false |

## Files Needed From Rob's PC

Run or collect:

```bash
ollama list
```

List these ComfyUI folders:

```text
ComfyUI/models/checkpoints
ComfyUI/models/loras
ComfyUI/models/vae
ComfyUI/models/controlnet
ComfyUI/models/ipadapter
ComfyUI/models/upscale_models
ComfyUI/custom_nodes
```

Once those inventories are known, replace the placeholders in:

```text
config/textureforge_v2_local_profiles.json
```

## V2 Implementation Steps

1. Add a TextureForge settings panel for:
   - ComfyUI base URL
   - Ollama base URL
   - model profile selection
   - connection test buttons

2. Add local inventory checks:
   - `GET /system_stats` or simple ComfyUI reachability check
   - Ollama `/api/tags` model list

3. Add workflow export:
   - fill prompt placeholders
   - fill checkpoint filename
   - fill output prefix
   - export per-region workflow JSON

4. Add ComfyUI API automation:
   - POST workflow to `/prompt`
   - poll history/output when available
   - import generated outputs back into TextureForge

5. Add Ollama structured prompt assistant:
   - send system prompt and user notes to `/api/chat`
   - require JSON matching `textureforge_v2_reference_schema.json`
   - import returned texture plan and prompts

## Safety / Quality Rules

- Keep prompts texture-focused and game-character-focused.
- For real-person references, describe face/skin/body construction cues without explicit or invasive framing.
- Avoid copyrighted logos or brand marks unless supplied as original user art.
- Treat ComfyUI generated outputs as source images, then let TextureForge process alpha, crop, mirror, split, validate, and package.

## Next Upgrade To The App

The current repo app should get a new `Local AI` section with:

- endpoint settings
- model profiles
- `Export ComfyUI Workflow`
- `Send to ComfyUI`
- `Ask Ollama for Prompt Plan`
- `Import Prompt Plan JSON`
- `Import ComfyUI Outputs`
